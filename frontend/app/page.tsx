"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg
              className="w-12 h-12 text-black"
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
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Task<span className="text-cyan-400">Flow</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-md mb-8">
          A modern task management app with a beautiful, responsive interface.
          Stay organized and boost your productivity.
        </p>

        {/* CTA Buttons */}
        {session?.user ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <p className="text-gray-300 mb-2 sm:mb-0 sm:mr-4 flex items-center">
              Welcome back, <span className="text-cyan-400 ml-1">{session.user.email}</span>
            </p>
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
            <Link href="/signin" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Fast & Responsive"
            description="Lightning-fast interface that works beautifully on any device"
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Secure"
            description="Your data is protected with industry-standard JWT authentication"
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            }
            title="Simple & Clean"
            description="Focus on what matters with an intuitive, distraction-free design"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/10">
        <p className="text-center text-gray-500 text-sm">
          Built with Next.js, TypeScript & Tailwind CSS
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-200">
      <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
