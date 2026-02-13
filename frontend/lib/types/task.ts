/**
 * Task entity as returned by the API.
 * Mirrors backend TaskResponse schema.
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Response from GET /api/{user_id}/tasks
 */
export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

/**
 * Input for creating a new task.
 * POST /api/{user_id}/tasks
 */
export interface TaskCreate {
  title: string;
  description?: string;
}

/**
 * Input for updating an existing task.
 * PUT /api/{user_id}/tasks/{task_id}
 */
export interface TaskUpdate {
  title?: string;
  description?: string;
}
