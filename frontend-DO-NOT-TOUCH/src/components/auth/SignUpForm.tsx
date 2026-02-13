"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * SignUpForm component for user registration.
 * Per User Story 1 acceptance scenarios 1-4.
 */
export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setSession } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Generic error per FR-009 - no email enumeration
        if (response.status === 409) {
          setError("Registration failed");
        } else if (response.status === 400) {
          // Validation error
          setError(data.detail?.[0]?.msg || "Invalid email or password format");
        } else {
          setError("Registration failed");
        }
        return;
      }

      // Success - update session and redirect
      setSession({ user: data.user, token: data.token });
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
        />
        <small>Minimum 8 characters</small>
      </div>
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
