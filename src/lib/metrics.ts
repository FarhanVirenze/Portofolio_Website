import { Registry, collectDefaultMetrics, Counter, Histogram, Gauge, Summary } from "prom-client";

// ─── Singleton Registry ──────────────────────────────────────────────────────
// Prevents duplicate metrics on Next.js hot-reload in dev mode

const globalForMetrics = globalThis as unknown as {
  _metricsRegistry?: Registry;
};

export const metricsRegistry = globalForMetrics._metricsRegistry || new Registry();

if (process.env.NODE_ENV !== "production") {
  globalForMetrics._metricsRegistry = metricsRegistry;
  // Clear registry on HMR to prevent "already registered" errors
  metricsRegistry.clear();
}

metricsRegistry.setDefaultLabels({
  app: "portofolio-nextjs",
});

// Default Node.js metrics: CPU, memory, event loop, GC, heap, active handles
collectDefaultMetrics({ register: metricsRegistry });

// ─── HTTP Metrics ────────────────────────────────────────────────────────────

/** Total HTTP requests — label by method, route, status */
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [metricsRegistry],
});

/** HTTP request duration in seconds */
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [metricsRegistry],
});

/** Currently in-flight requests */
export const httpActiveRequests = new Gauge({
  name: "http_active_requests",
  help: "Number of HTTP requests currently being processed",
  labelNames: ["method"] as const,
  registers: [metricsRegistry],
});

// ─── Page View Metrics ───────────────────────────────────────────────────────

/** Page views by route */
export const pageViewsTotal = new Counter({
  name: "page_views_total",
  help: "Total page views by route",
  labelNames: ["route"] as const,
  registers: [metricsRegistry],
});

// ─── Server Action Metrics ───────────────────────────────────────────────────

/** Server action invocations (CRUD, auth, upload) */
export const serverActionTotal = new Counter({
  name: "server_action_invocations_total",
  help: "Total server action invocations",
  labelNames: ["action", "status"] as const,
  registers: [metricsRegistry],
});

/** Server action duration in seconds */
export const serverActionDuration = new Histogram({
  name: "server_action_duration_seconds",
  help: "Duration of server action execution in seconds",
  labelNames: ["action"] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30],
  registers: [metricsRegistry],
});

// ─── Supabase / Database Metrics ─────────────────────────────────────────────

/** Supabase query count by table and operation */
export const supabaseQueriesTotal = new Counter({
  name: "supabase_queries_total",
  help: "Total Supabase database queries",
  labelNames: ["table", "operation", "status"] as const,
  registers: [metricsRegistry],
});

/** Supabase query duration in seconds */
export const supabaseQueryDuration = new Histogram({
  name: "supabase_query_duration_seconds",
  help: "Duration of Supabase queries in seconds",
  labelNames: ["table", "operation"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

// ─── Auth Metrics ────────────────────────────────────────────────────────────

/** Login attempts */
export const authAttemptsTotal = new Counter({
  name: "auth_login_attempts_total",
  help: "Total login attempts",
  labelNames: ["status"] as const,  // "success" | "failure"
  registers: [metricsRegistry],
});

// ─── File Upload Metrics ─────────────────────────────────────────────────────

/** File uploads */
export const fileUploadsTotal = new Counter({
  name: "file_uploads_total",
  help: "Total file uploads to Supabase storage",
  labelNames: ["type", "status"] as const,  // type: "image" | "pdf" | "other"
  registers: [metricsRegistry],
});

/** Upload file size in bytes */
export const fileUploadSize = new Summary({
  name: "file_upload_size_bytes",
  help: "Size of uploaded files in bytes",
  labelNames: ["type"] as const,
  percentiles: [0.5, 0.9, 0.95, 0.99],
  registers: [metricsRegistry],
});

// ─── Error Metrics ───────────────────────────────────────────────────────────

/** Application errors by source */
export const appErrorsTotal = new Counter({
  name: "app_errors_total",
  help: "Total application errors",
  labelNames: ["source", "error_type"] as const,
  registers: [metricsRegistry],
});

// ─── Business Metrics ────────────────────────────────────────────────────────

/** Content updates (edits on admin panel) */
export const contentUpdatesTotal = new Counter({
  name: "content_updates_total",
  help: "Total content updates via admin panel",
  labelNames: ["content_type", "operation"] as const, // content_type: "project" | "skill" | "certification" | "home" | "about"
  registers: [metricsRegistry],
});

// ─── App Info ────────────────────────────────────────────────────────────────

/** Application build info (always 1, carries version labels) */
export const appInfo = new Gauge({
  name: "app_info",
  help: "Application info",
  labelNames: ["version", "node_env"] as const,
  registers: [metricsRegistry],
});
appInfo.set({ version: "0.1.0", node_env: process.env.NODE_ENV || "development" }, 1);

// ─── Helper: Track Server Action ─────────────────────────────────────────────
/**
 * Wraps a server action function to automatically track:
 * - Invocation count (success/error)
 * - Duration
 * - Errors
 *
 * Usage:
 * ```ts
 * export const addProject = trackServerAction("addProject", async (formData: FormData) => {
 *   // ... original logic
 * });
 * ```
 */
export function trackServerAction<TArgs extends unknown[], TReturn>(
  actionName: string,
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const end = serverActionDuration.startTimer({ action: actionName });
    try {
      const result = await fn(...args);
      serverActionTotal.inc({ action: actionName, status: "success" });
      return result;
    } catch (error) {
      serverActionTotal.inc({ action: actionName, status: "error" });
      appErrorsTotal.inc({
        source: "server_action",
        error_type: error instanceof Error ? error.name : "UnknownError",
      });
      throw error;
    } finally {
      end();
    }
  };
}

// ─── Helper: Track Supabase Query ────────────────────────────────────────────
/**
 * Tracks a Supabase query's duration and success/error status.
 *
 * Usage:
 * ```ts
 * const { data, error } = await trackSupabaseQuery("projects", "select", () =>
 *   supabase.from("projects").select("*")
 * );
 * ```
 */
export async function trackSupabaseQuery<T>(
  table: string,
  operation: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const end = supabaseQueryDuration.startTimer({ table, operation });
  try {
    const result = await queryFn();
    supabaseQueriesTotal.inc({ table, operation, status: "success" });
    return result;
  } catch (error) {
    supabaseQueriesTotal.inc({ table, operation, status: "error" });
    appErrorsTotal.inc({
      source: "supabase",
      error_type: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  } finally {
    end();
  }
}
