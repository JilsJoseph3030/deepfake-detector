/**
 * validators.ts
 * Pure, testable validation functions for media file uploads.
 */

export const VALID_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
] as const;

export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

/** Returns true if the MIME type is in the allowed list. */
export function isValidMimeType(mimeType: string): boolean {
  return (VALID_MIME_TYPES as readonly string[]).includes(mimeType);
}

/** Returns true if file size is within the allowed limit. */
export function isValidFileSize(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= MAX_FILE_SIZE_BYTES;
}

/**
 * Sanitizes a filename by stripping path traversal characters
 * and any characters outside a safe alphanumeric set.
 */
export function sanitizeFileName(rawName: string): string {
  // Strip directory traversal
  let name = rawName.replace(/^.*[\\/]/, "");
  // Allow only safe characters
  name = name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  return name || "unnamed_file";
}

/** In-memory rate limiter — max requests per window per key. */
export class RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly maxRequests: number = 5,
    private readonly windowMs: number = 60_000
  ) {}

  /** Returns true if the key is within the rate limit. */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }
}

/** Singleton rate limiter instance for the analyze endpoint. */
export const analyzeRateLimiter = new RateLimiter(5, 60_000);
