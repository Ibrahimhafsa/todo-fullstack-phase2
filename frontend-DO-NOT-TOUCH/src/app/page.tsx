"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Home page with auth navigation.
 * Per plan.md project structure.
 *
 * Shows links to signin/signup or dashboard based on auth state.
 */
export default function HomePage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main>
        <h1>Todo App</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Todo App</h1>
      <p>A simple todo application with JWT authentication.</p>

      {session.user ? (
        <nav>
          <p>Welcome back, {session.user.email}!</p>
          <Link href="/dashboard">Go to Dashboard</Link>
        </nav>
      ) : (
        <nav>
          <Link href="/signin">Sign In</Link>
          {" | "}
          <Link href="/signup">Sign Up</Link>
        </nav>
      )}
    </main>
  );
}
