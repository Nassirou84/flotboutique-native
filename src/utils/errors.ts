/** Extracts a readable message from whatever the API client rejected with. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string' && error) return error;
  if (error && typeof error === 'object') {
    const e = error as { message?: unknown; detail?: unknown; error?: unknown; description?: unknown };
    for (const v of [e.detail, e.message, e.error, e.description]) {
      if (typeof v === 'string' && v) return v;
    }
  }
  return fallback;
}
