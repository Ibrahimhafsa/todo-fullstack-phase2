"use client";

import { FormEvent, useState } from "react";
import { TaskCreate, TaskUpdate } from "@/lib/types/task";
import { Button } from "@/components/ui/Button";

export interface TaskFormProps {
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;
  onCancel?: () => void;
  initialValues?: {
    title: string;
    description: string;
  };
  mode: "create" | "edit";
  submitLabel?: string;
}

export function TaskForm({
  onSubmit,
  onCancel,
  initialValues,
  mode,
  submitLabel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (mode === "create") {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel = submitLabel || (mode === "create" ? "Add Task" : "Save");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`
            w-full px-4 py-2.5
            bg-white/5 border rounded-xl
            text-white placeholder-gray-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
            ${error && !title.trim() ? "border-red-500/50" : "border-white/10 hover:border-white/20"}
          `}
        />
      </div>

      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Description <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Add some details..."
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 hover:border-white/20 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {buttonLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
