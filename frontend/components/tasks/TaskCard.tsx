"use client";

import { useState } from "react";
import { Task, TaskUpdate } from "@/lib/types/task";
import { Button } from "@/components/ui/Button";
import { TaskForm } from "./TaskForm";

export interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: number) => Promise<void>;
  onEdit: (taskId: number, data: TaskUpdate) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  isUpdating?: boolean;
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isUpdating = false,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    await onToggleComplete(task.id);
  };

  const handleEdit = async (data: TaskUpdate) => {
    await onEdit(task.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <TaskForm
          mode="edit"
          initialValues={{
            title: task.title,
            description: task.description || "",
          }}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save Changes"
        />
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white/5 backdrop-blur-sm border rounded-xl p-4
        transition-all duration-200 hover:bg-white/10
        ${task.is_complete ? "border-green-500/30" : "border-white/10"}
        ${isUpdating ? "opacity-70" : ""}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={`
            mt-0.5 w-6 h-6 rounded-lg border-2 flex-shrink-0
            flex items-center justify-center
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50
            ${
              task.is_complete
                ? "bg-green-500 border-green-500 text-black"
                : "border-white/30 hover:border-cyan-500/50"
            }
          `}
          aria-label={task.is_complete ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.is_complete && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-white font-medium truncate
              ${task.is_complete ? "line-through text-gray-400" : ""}
            `}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`
                mt-1 text-sm line-clamp-2
                ${task.is_complete ? "text-gray-500" : "text-gray-400"}
              `}
            >
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                ${
                  task.is_complete
                    ? "bg-green-500/20 text-green-400"
                    : "bg-cyan-500/20 text-cyan-400"
                }
              `}
            >
              {task.is_complete ? "Complete" : "In Progress"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isUpdating}
            aria-label="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            loading={isDeleting}
            aria-label="Delete task"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
