"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Protected dashboard page.
 * Per User Story 2 scenario 3.
 *
 * Shows user email and accessible only when authenticated.
 */
export default function DashboardPage() {
  const { session, isLoading, clearSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin if not authenticated (client-side check)
    if (!isLoading && !session.token) {
      router.push("/signin");
    }
  }, [isLoading, session.token, router]);

  const handleSignOut = () => {
    clearSession();
    router.push("/signin");
  };

  if (isLoading) {
    return <main><p>Loading...</p></main>;
  }

  if (!session.user) {
    return <main><p>Redirecting to sign in...</p></main>;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.email}!</p>
      <p>You are authenticated.</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </main>
  );
}
