import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialize the client to avoid crashing at module evaluation
// when env vars aren't available yet (e.g. during Turbopack bundling)

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Server-side Supabase client with service role (for admin operations)
export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceRoleKey);
}
