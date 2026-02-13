/**
 * API client with JWT injection.
 * Per FR-010, research.md Section 6.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const STORAGE_KEY = "auth_session";

interface Session {
  token: string | null;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const session: Session = JSON.parse(stored);
    return session.token;
  } catch {
    return null;
  }
}

/**
 * API client that auto-injects Authorization: Bearer header.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

/**
 * GET request with auth.
 */
export function apiGet<T = unknown>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "GET" });
}

/**
 * POST request with auth.
 */
export function apiPost<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request with auth.
 */
export function apiPut<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request with auth.
 */
export function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "DELETE" });
}
