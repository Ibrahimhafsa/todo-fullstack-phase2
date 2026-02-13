/**
 * API client with JWT injection and 401 redirect handling.
 * Per FR-010, research.md Section 6, contracts/task-api.md.
 */

import { Task, TaskCreate, TaskListResponse, TaskUpdate } from "./types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * API client with JWT token injection via Authorization header.
 * Handles 401 by showing error (dashboard will handle auth state).
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

  // Handle 401 - don't redirect; let the component handle it
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
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
 * PATCH request with auth.
 */
export function apiPatch<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request with auth.
 */
export function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "DELETE" });
}

// ============ Task API Methods ============

/**
 * Fetch all tasks for a user.
 */
export async function getTasks(userId: string): Promise<TaskListResponse> {
  return apiGet<TaskListResponse>(`/api/${userId}/tasks`);
}

/**
 * Create a new task.
 */
export async function createTask(userId: string, data: TaskCreate): Promise<Task> {
  return apiPost<Task>(`/api/${userId}/tasks`, data);
}

/**
 * Get a single task by ID.
 */
export async function getTask(userId: string, taskId: number): Promise<Task> {
  return apiGet<Task>(`/api/${userId}/tasks/${taskId}`);
}

/**
 * Update an existing task.
 */
export async function updateTask(
  userId: string,
  taskId: number,
  data: TaskUpdate
): Promise<Task> {
  return apiPut<Task>(`/api/${userId}/tasks/${taskId}`, data);
}

/**
 * Delete a task.
 */
export async function deleteTask(userId: string, taskId: number): Promise<void> {
  await apiDelete(`/api/${userId}/tasks/${taskId}`);
}

/**
 * Toggle task completion status.
 */
export async function toggleTaskComplete(
  userId: string,
  taskId: number
): Promise<Task> {
  return apiPatch<Task>(`/api/${userId}/tasks/${taskId}/complete`);
}
