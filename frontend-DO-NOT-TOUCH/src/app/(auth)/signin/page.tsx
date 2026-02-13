import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";

/**
 * Signin page at /signin.
 * Per User Story 2.
 */
export default function SignInPage() {
  return (
    <main>
      <h1>Sign In</h1>
      <SignInForm />
      <p>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
