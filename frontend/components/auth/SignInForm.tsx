"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const truncatedPassword = password.substring(0, 72);

      console.log("[SignInForm] Starting signin...");
      console.log("[SignInForm] Email:", email);
      console.log("[SignInForm] Calling signIn() function");

      // Step 1: Call signIn - this should save token to localStorage
      const result = await signIn(email.trim(), truncatedPassword);
      console.log("[SignInForm] signIn() completed successfully");
      console.log("[SignInForm] Result from signIn():", result);

      // Step 2: VERIFY token was actually saved
      const token = localStorage.getItem("auth_token");
      console.log("[SignInForm] Token in localStorage:", token ? `✅ YES (${token.substring(0, 30)}...)` : "❌ NO");

      if (!token) {
        console.error("[SignInForm] ERROR: signIn() completed but token is NOT in localStorage!");
        throw new Error("Token not found in localStorage after signin");
      }

      console.log("[SignInForm] ✅ Token verified in localStorage");
      console.log("[SignInForm] Redirecting to dashboard...");

      // Step 3: Redirect
      router.push("/dashboard");

    } catch (err) {
      console.error("[SignInForm] ERROR in handleSubmit:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[SignInForm] Error message:", errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 hover:border-white/20"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 hover:border-white/20"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

