import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance for use in React components.
 * Per FR-003, FR-011.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
