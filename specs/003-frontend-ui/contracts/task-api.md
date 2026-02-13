# Task API Contract (Frontend Client)

**Feature**: 003-frontend-ui
**Date**: 2026-01-23
**Backend**: FastAPI (Spec-2)

## Overview

This document defines the API client methods the frontend will use to interact with the backend Task API. All methods include JWT authentication via the existing `apiClient`.

---

## 1. Base Configuration

```typescript
// frontend/lib/api.ts (existing, to be enhanced)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

---

## 2. Task Endpoints

### 2.1 List Tasks

**Endpoint**: `GET /api/{user_id}/tasks`

**Frontend Method**:
```typescript
export async function getTasks(userId: string): Promise<TaskListResponse> {
  return apiGet<TaskListResponse>(`/api/${userId}/tasks`);
}
```

**Request**:
- Headers: `Authorization: Bearer <token>`
- Body: None

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "uuid-string",
      "title": "Task title",
      "description": "Task description",
      "is_complete": false,
      "created_at": "2026-01-23T12:00:00Z",
      "updated_at": "2026-01-23T12:00:00Z"
    }
  ],
  "count": 1
}
```

**Error Responses**:
- `401 Unauthorized`: Missing/invalid token → Redirect to signin

---

### 2.2 Create Task

**Endpoint**: `POST /api/{user_id}/tasks`

**Frontend Method**:
```typescript
export async function createTask(userId: string, data: TaskCreate): Promise<Task> {
  return apiPost<Task>(`/api/${userId}/tasks`, data);
}
```

**Request**:
```json
{
  "title": "New task title",
  "description": "Optional description"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "user_id": "uuid-string",
  "title": "New task title",
  "description": "Optional description",
  "is_complete": false,
  "created_at": "2026-01-23T12:00:00Z",
  "updated_at": "2026-01-23T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation error (empty title)
- `401 Unauthorized`: Missing/invalid token

---

### 2.3 Get Single Task

**Endpoint**: `GET /api/{user_id}/tasks/{task_id}`

**Frontend Method**:
```typescript
export async function getTask(userId: string, taskId: number): Promise<Task> {
  return apiGet<Task>(`/api/${userId}/tasks/${taskId}`);
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "is_complete": false,
  "created_at": "2026-01-23T12:00:00Z",
  "updated_at": "2026-01-23T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing/invalid token
- `404 Not Found`: Task doesn't exist or belongs to another user

---

### 2.4 Update Task

**Endpoint**: `PUT /api/{user_id}/tasks/{task_id}`

**Frontend Method**:
```typescript
export async function updateTask(
  userId: string,
  taskId: number,
  data: TaskUpdate
): Promise<Task> {
  return apiPut<Task>(`/api/${userId}/tasks/${taskId}`, data);
}
```

**Request**:
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "Updated title",
  "description": "Updated description",
  "is_complete": false,
  "created_at": "2026-01-23T12:00:00Z",
  "updated_at": "2026-01-23T12:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing/invalid token
- `404 Not Found`: Task doesn't exist

---

### 2.5 Delete Task

**Endpoint**: `DELETE /api/{user_id}/tasks/{task_id}`

**Frontend Method**:
```typescript
export async function deleteTask(userId: string, taskId: number): Promise<void> {
  await apiDelete(`/api/${userId}/tasks/${taskId}`);
}
```

**Response** (204 No Content): Empty body

**Error Responses**:
- `401 Unauthorized`: Missing/invalid token
- `404 Not Found`: Task doesn't exist

---

### 2.6 Toggle Completion

**Endpoint**: `PATCH /api/{user_id}/tasks/{task_id}/complete`

**Frontend Method** (NEW - to be added to api.ts):
```typescript
export async function apiPatch<T = unknown>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: "PATCH" });
}

export async function toggleTaskComplete(
  userId: string,
  taskId: number
): Promise<Task> {
  return apiPatch<Task>(`/api/${userId}/tasks/${taskId}/complete`);
}
```

**Request**: No body required (server toggles current state)

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "is_complete": true,
  "created_at": "2026-01-23T12:00:00Z",
  "updated_at": "2026-01-23T12:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing/invalid token
- `404 Not Found`: Task doesn't exist

---

## 3. Error Handling

### 3.1 Global 401 Handler

```typescript
// Enhanced apiClient in frontend/lib/api.ts

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

  // Handle 401 - redirect to signin
  if (response.status === 401) {
    localStorage.removeItem("auth_session");
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
    throw new Error("Session expired");
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
```

### 3.2 Error Response Format

All API errors follow this format:
```json
{
  "detail": "Human-readable error message"
}
```

---

## 4. TypeScript Interfaces

```typescript
// frontend/lib/types/task.ts

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
}
```

---

## 5. Usage Example

```typescript
// In Dashboard page or hook

import { getTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

function DashboardPage() {
  const { session } = useAuth();
  const userId = session.user?.id;

  // Fetch tasks
  const fetchTasks = async () => {
    if (!userId) return;
    const response = await getTasks(userId);
    setTasks(response.tasks);
  };

  // Create task
  const handleCreate = async (data: TaskCreate) => {
    if (!userId) return;
    const newTask = await createTask(userId, data);
    setTasks(prev => [...prev, newTask]);
  };

  // Toggle completion
  const handleToggle = async (taskId: number) => {
    if (!userId) return;
    const updated = await toggleTaskComplete(userId, taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
  };
}
```
