const MAX_LENGTHS = {
  name: 255,
  title: 255,
  description: 5000,
  short_name: 100,
  email: 255,
  issuer: 255,
  issued_date: 50,
  timeline: 100,
  category: 100,
  level: 50,
  greeting: 500,
} as const;

const URL_FIELDS = ["github_url", "demo_url", "cv_url", "credential_url", "icon_url", "image_url"] as const;

const ALLOWED_URL_PROTOCOLS = ["https:"];

export function validateString(value: unknown, fieldName: string, maxLength?: number): string {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  const limit = maxLength || MAX_LENGTHS[fieldName as keyof typeof MAX_LENGTHS] || 255;
  if (str.length > limit) {
    throw new Error(`Field '${fieldName}' exceeds maximum length of ${limit} characters`);
  }
  return str;
}

export function validateRequired(value: unknown, fieldName: string): string {
  const str = validateString(value, fieldName);
  if (!str) {
    throw new Error(`Field '${fieldName}' is required`);
  }
  return str;
}

export function validateUrl(value: unknown, fieldName: string): string {
  const str = validateString(value, fieldName);
  if (!str) return "";

  try {
    const url = new URL(str);
    if (!ALLOWED_URL_PROTOCOLS.includes(url.protocol)) {
      throw new Error(`Field '${fieldName}' must use HTTPS protocol`);
    }
    return str;
  } catch (e) {
    if (e instanceof Error && e.message.includes("must use HTTPS")) throw e;
    throw new Error(`Field '${fieldName}' is not a valid URL`);
  }
}

export function validateNumber(value: unknown, fieldName: string, options?: { min?: number; max?: number }): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Field '${fieldName}' must be a valid number`);
  }
  if (options?.min !== undefined && num < options.min) {
    throw new Error(`Field '${fieldName}' must be at least ${options.min}`);
  }
  if (options?.max !== undefined && num > options.max) {
    throw new Error(`Field '${fieldName}' must be at most ${options.max}`);
  }
  return num;
}

export function validateArray(value: unknown, fieldName: string): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `File type '.${ext}' is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `MIME type '${file.type}' is not allowed` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  return { valid: true };
}

export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    if (message.includes("relation") || message.includes("column") || message.includes("table")) {
      return "An internal error occurred. Please try again.";
    }
    if (message.includes("Upload failed")) {
      return "File upload failed. Please try again.";
    }
  }
  return "An unexpected error occurred. Please try again.";
}
