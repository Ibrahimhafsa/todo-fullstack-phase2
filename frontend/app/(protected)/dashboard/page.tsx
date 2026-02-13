"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskCreate, TaskUpdate } from "@/lib/types/task";
import { Navbar } from "@/components/ui/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";

export default function DashboardPage() {
  const { session, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Log every state change
  console.log("[Dashboard] Current state:", {
    authLoading,
    sessionExists: !!session,
    userExists: !!session?.user,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    isRedirecting,
  });

  // Extract userId only if session.user exists
  const userId = session?.user?.id?.toString();

  // Initialize tasks hook ONLY when userId is available (not during loading or redirect)
  const {
    tasks,
    isLoading: tasksLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    retry,
  } = useTasks(userId && !isRedirecting ? userId : undefined);

  // Check authentication and handle redirects
  useEffect(() => {
    console.log("[Dashboard.useEffect] Auth check...", {
      authLoading,
      sessionExists: !!session,
      userExists: !!session?.user,
    });

    // Still loading auth - show loading state
    if (authLoading) {
      console.log("[Dashboard.useEffect] Still loading auth, showing loading state");
      return;
    }

    // Auth loading finished - check if user is authenticated
    if (!session || !session.user) {
      console.log("[Dashboard.useEffect] ❌ NOT AUTHENTICATED - redirecting to signin");
      setIsRedirecting(true);
      router.push("/signin");
      return;
    }

    // Authenticated - success
    console.log("[Dashboard.useEffect] ✅ AUTHENTICATED as:", session.user.email);
  }, [authLoading, session, router]);

  const handleSignOut = async () => {
    console.log("[Dashboard] Sign out clicked");
    signOut();
    router.push("/signin");
  };

  const handleCreateTask = async (data: TaskCreate | TaskUpdate) => {
    await createTask(data as TaskCreate);
    setShowForm(false);
  };

  const handleToggleComplete = async (taskId: number) => {
    await toggleComplete(taskId);
  };

  const handleEditTask = async (taskId: number, data: TaskUpdate) => {
    await updateTask(taskId, data);
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId);
  };

  // Show loading while auth is being checked
  if (authLoading) {
    console.log("[Dashboard] Rendering: AUTH LOADING STATE");
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading..." />
      </main>
    );
  }

  // Show loading while redirecting
  if (isRedirecting) {
    console.log("[Dashboard] Rendering: REDIRECTING STATE");
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingState message="Redirecting..." />
      </main>
    );
  }

  // Fallback: Not authenticated (safety check)
  if (!session || !session.user) {
    console.log("[Dashboard] Rendering: NOT AUTHENTICATED (fallback)");
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingState message="Redirecting to sign in..." />
      </main>
    );
  }

  // AUTHENTICATED - Render dashboard
  console.log("[Dashboard] Rendering: AUTHENTICATED DASHBOARD");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        title="TaskFlow"
        userEmail={session.user.email}
        onLogout={handleSignOut}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Tasks</h1>
            <p className="text-gray-400 mt-1">
              {tasks.length === 0
                ? "No tasks yet"
                : `${tasks.filter((t) => t.is_complete).length} of ${tasks.length} completed`}
            </p>
          </div>
          {!showForm && tasks.length > 0 && (
            <Button onClick={() => setShowForm(true)}>
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Task
            </Button>
          )}
        </div>

        {/* Create Task Form */}
        {showForm && (
          <GlassCard className="mb-6" padding="md">
            <h2 className="text-lg font-semibold text-white mb-4">Create New Task</h2>
            <TaskForm
              mode="create"
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </GlassCard>
        )}

        {/* Tasks Loading State */}
        {tasksLoading && (
          <LoadingState message="Loading your tasks..." />
        )}

        {/* Error State */}
        {!tasksLoading && error && (
          <GlassCard padding="lg" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Failed to load tasks</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={retry}>Try Again</Button>
          </GlassCard>
        )}

        {/* Empty State */}
        {!tasksLoading && !error && tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started organizing your work."
            actionLabel="Create Task"
            onAction={() => setShowForm(true)}
          />
        )}

        {/* Task List */}
        {!tasksLoading && !error && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
