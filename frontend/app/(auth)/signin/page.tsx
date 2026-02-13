import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";
import { GlassCard } from "@/components/ui/GlassCard";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4">
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-1">Sign in to continue to TaskFlow</p>
        </div>

        {/* Form Card */}
        <GlassCard padding="lg">
          <SignInForm />
        </GlassCard>

        {/* Footer Link */}
        <p className="text-center mt-6 text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
