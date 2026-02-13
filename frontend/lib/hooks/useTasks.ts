"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskCreate, TaskUpdate } from "../types/task";
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  toggleTaskComplete as apiToggleComplete,
} from "../api";

export interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (data: TaskCreate) => Promise<Task>;
  updateTask: (taskId: number, data: TaskUpdate) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleComplete: (taskId: number) => Promise<Task>;
  retry: () => void;
}

export function useTasks(userId: string | undefined): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getTasks(userId);
      setTasks(response.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (data: TaskCreate): Promise<Task> => {
      if (!userId) throw new Error("Not authenticated");

      // Optimistic update with temp task
      const tempId = -Date.now();
      const tempTask: Task = {
        id: tempId,
        user_id: userId,
        title: data.title,
        description: data.description || null,
        is_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTasks((prev) => [tempTask, ...prev]);

      try {
        const newTask = await apiCreateTask(userId, data);
        // Replace temp task with real one
        setTasks((prev) => prev.map((t) => (t.id === tempId ? newTask : t)));
        return newTask;
      } catch (err) {
        // Rollback on error
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
        throw err;
      }
    },
    [userId]
  );

  const updateTask = useCallback(
    async (taskId: number, data: TaskUpdate): Promise<Task> => {
      if (!userId) throw new Error("Not authenticated");

      // Store previous state for rollback
      const previousTasks = [...tasks];

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      try {
        const updated = await apiUpdateTask(userId, taskId, data);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        return updated;
      } catch (err) {
        // Rollback on error
        setTasks(previousTasks);
        throw err;
      }
    },
    [userId, tasks]
  );

  const deleteTask = useCallback(
    async (taskId: number): Promise<void> => {
      if (!userId) throw new Error("Not authenticated");

      // Store previous state for rollback
      const previousTasks = [...tasks];

      // Optimistic update
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      try {
        await apiDeleteTask(userId, taskId);
      } catch (err) {
        // Rollback on error
        setTasks(previousTasks);
        throw err;
      }
    },
    [userId, tasks]
  );

  const toggleComplete = useCallback(
    async (taskId: number): Promise<Task> => {
      if (!userId) throw new Error("Not authenticated");

      // Store previous state for rollback
      const previousTasks = [...tasks];

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, is_complete: !t.is_complete, updated_at: new Date().toISOString() }
            : t
        )
      );

      try {
        const updated = await apiToggleComplete(userId, taskId);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        return updated;
      } catch (err) {
        // Rollback on error
        setTasks(previousTasks);
        throw err;
      }
    },
    [userId, tasks]
  );

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    retry: fetchTasks,
  };
}
