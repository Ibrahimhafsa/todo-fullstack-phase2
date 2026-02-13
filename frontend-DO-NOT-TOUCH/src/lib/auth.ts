import { betterAuth } from "better-auth";

/**
 * Better Auth server configuration with JWT session strategy.
 * Per research.md Section 1 and FR-003, FR-005.
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (per FR-005)
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
});
