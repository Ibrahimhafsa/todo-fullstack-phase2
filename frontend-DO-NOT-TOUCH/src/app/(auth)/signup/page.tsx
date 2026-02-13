import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";

/**
 * Signup page at /signup.
 * Per User Story 1.
 */
export default function SignUpPage() {
  return (
    <main>
      <h1>Create Account</h1>
      <SignUpForm />
      <p>
        Already have an account? <Link href="/signin">Sign in</Link>
      </p>
    </main>
  );
}
