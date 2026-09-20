const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:4000";
const DEFAULT_TIMEOUT_MS = 5000;

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Callers control caching per request via `next`/`cache` in `init` — this
// helper only adds the base URL, a request timeout, and error normalization.
export async function fetchApi<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...requestInit } = init ?? {};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...requestInit,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ApiError(`API request failed: ${res.status} ${res.statusText}`, res.status);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(`API request to ${path} timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
