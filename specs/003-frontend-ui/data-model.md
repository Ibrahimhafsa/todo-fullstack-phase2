# Data Model: Frontend UI

**Feature**: 003-frontend-ui
**Date**: 2026-01-23
**Status**: Complete

## Overview

This document defines the TypeScript interfaces and types used in the frontend application. These models mirror the backend API schemas and provide type safety throughout the frontend codebase.

---

## 1. Task Entity

### 1.1 Core Task Interface

```typescript
// frontend/lib/types/task.ts

/**
 * Task entity as returned by the API.
 * Mirrors backend TaskResponse schema.
 */
export interface Task {
  /** Unique task identifier */
  id: number;

  /** Owner user ID (from JWT) */
  user_id: string;

  /** Task title (required, max 255 chars) */
  title: string;

  /** Task description (optional) */
  description: string | null;

  /** Completion status */
  is_complete: boolean;

  /** ISO datetime when task was created */
  created_at: string;

  /** ISO datetime when task was last updated */
  updated_at: string;
}
```

### 1.2 Task List Response

```typescript
/**
 * Response from GET /api/{user_id}/tasks
 */
export interface TaskListResponse {
  /** Array of tasks */
  tasks: Task[];

  /** Total count of tasks */
  count: number;
}
```

### 1.3 Task Create Input

```typescript
/**
 * Input for creating a new task.
 * POST /api/{user_id}/tasks
 */
export interface TaskCreate {
  /** Task title (required) */
  title: string;

  /** Task description (optional) */
  description?: string;
}
```

### 1.4 Task Update Input

```typescript
/**
 * Input for updating an existing task.
 * PUT /api/{user_id}/tasks/{task_id}
 */
export interface TaskUpdate {
  /** New title (optional) */
  title?: string;

  /** New description (optional) */
  description?: string;
}
```

---

## 2. User/Session Entity

### 2.1 User Interface

```typescript
// Already defined in AuthProvider, reuse existing

/**
 * User information from JWT claims.
 */
export interface User {
  /** User ID (UUID string) */
  id: string;

  /** User email address */
  email: string;
}
```

### 2.2 Session Interface

```typescript
/**
 * Session state stored in localStorage.
 */
export interface Session {
  /** Current user (null if not authenticated) */
  user: User | null;

  /** JWT token (null if not authenticated) */
  token: string | null;
}
```

---

## 3. UI State Types

### 3.1 Loading State

```typescript
/**
 * Generic async operation state.
 */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';
```

### 3.2 Task Form State

```typescript
/**
 * State for task create/edit form.
 */
export interface TaskFormState {
  title: string;
  description: string;
  isSubmitting: boolean;
  error: string | null;
}
```

### 3.3 Tasks Hook Return Type

```typescript
/**
 * Return type for useTasks hook.
 */
export interface UseTasksReturn {
  /** List of tasks */
  tasks: Task[];

  /** Loading state */
  isLoading: boolean;

  /** Error message (null if no error) */
  error: string | null;

  /** Create a new task */
  createTask: (data: TaskCreate) => Promise<Task>;

  /** Update an existing task */
  updateTask: (taskId: number, data: TaskUpdate) => Promise<Task>;

  /** Delete a task */
  deleteTask: (taskId: number) => Promise<void>;

  /** Toggle task completion */
  toggleComplete: (taskId: number) => Promise<Task>;

  /** Retry failed fetch */
  retry: () => void;
}
```

---

## 4. Component Props Types

### 4.1 Button Props

```typescript
export interface ButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Button size */
  size?: 'sm' | 'md' | 'lg';

  /** Disabled state */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Click handler */
  onClick?: () => void;

  /** Button content */
  children: React.ReactNode;

  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';

  /** Additional CSS classes */
  className?: string;
}
```

### 4.2 TextInput Props

```typescript
export interface TextInputProps {
  /** Input label */
  label?: string;

  /** Input placeholder */
  placeholder?: string;

  /** Current value */
  value: string;

  /** Change handler */
  onChange: (value: string) => void;

  /** Error message */
  error?: string;

  /** Input type */
  type?: 'text' | 'email' | 'password';

  /** Required field */
  required?: boolean;

  /** Input ID for label association */
  id?: string;

  /** Disabled state */
  disabled?: boolean;
}
```

### 4.3 TextArea Props

```typescript
export interface TextAreaProps {
  /** Textarea label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Current value */
  value: string;

  /** Change handler */
  onChange: (value: string) => void;

  /** Error message */
  error?: string;

  /** Number of visible rows */
  rows?: number;

  /** Input ID for label association */
  id?: string;

  /** Disabled state */
  disabled?: boolean;
}
```

### 4.4 TaskCard Props

```typescript
export interface TaskCardProps {
  /** Task data */
  task: Task;

  /** Toggle completion handler */
  onToggleComplete: (taskId: number) => void;

  /** Edit handler */
  onEdit: (task: Task) => void;

  /** Delete handler */
  onDelete: (taskId: number) => void;

  /** Whether an operation is in progress */
  isUpdating?: boolean;
}
```

### 4.5 TaskForm Props

```typescript
export interface TaskFormProps {
  /** Submit handler */
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;

  /** Cancel handler (for edit mode) */
  onCancel?: () => void;

  /** Initial values (for edit mode) */
  initialValues?: {
    title: string;
    description: string;
  };

  /** Form mode */
  mode: 'create' | 'edit';

  /** Submit button text override */
  submitLabel?: string;
}
```

### 4.6 GlassCard Props

```typescript
export interface GlassCardProps {
  /** Card content */
  children: React.ReactNode;

  /** Additional CSS classes */
  className?: string;

  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

### 4.7 EmptyState Props

```typescript
export interface EmptyStateProps {
  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Action button label */
  actionLabel?: string;

  /** Action button handler */
  onAction?: () => void;
}
```

### 4.8 LoadingState Props

```typescript
export interface LoadingStateProps {
  /** Loading message */
  message?: string;

  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
}
```

---

## 5. Entity Relationships

```
┌─────────────────────────────────────────────────────────┐
│                        Session                          │
│  ┌─────────────┐    ┌─────────────────────────────┐    │
│  │    User     │    │          Token              │    │
│  │  - id       │    │  (JWT string)               │    │
│  │  - email    │    │                             │    │
│  └─────────────┘    └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                              │
                              │ owns (user_id)
                              ▼
┌─────────────────────────────────────────────────────────┐
│                         Task                            │
│  - id: number                                           │
│  - user_id: string (FK to User)                        │
│  - title: string                                        │
│  - description: string | null                           │
│  - is_complete: boolean                                 │
│  - created_at: string                                   │
│  - updated_at: string                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `Task.title` | Required, max 255 chars | "Title is required" / "Title must be 255 characters or less" |
| `Task.description` | Optional, no max | N/A |
| `TaskCreate.title` | Required | "Title is required" |
| `TaskUpdate.title` | If provided, non-empty | "Title cannot be empty" |

---

## 7. State Transitions

### 7.1 Task Completion State

```
┌──────────────┐     toggle      ┌──────────────┐
│ is_complete  │ ◄─────────────► │ is_complete  │
│    false     │                 │    true      │
└──────────────┘                 └──────────────┘
```

### 7.2 Async Operation State

```
┌────────┐   start    ┌─────────┐   success   ┌─────────┐
│  idle  │ ─────────► │ loading │ ──────────► │ success │
└────────┘            └─────────┘             └─────────┘
                           │
                           │ error
                           ▼
                      ┌─────────┐   retry    ┌─────────┐
                      │  error  │ ─────────► │ loading │
                      └─────────┘            └─────────┘
```
