"use client";

import { Button } from "./Button";

export interface NavbarProps {
  title?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function Navbar({
  title = "TaskFlow",
  userEmail,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="w-full bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-black"
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
            <span className="text-xl font-bold text-white">{title}</span>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-gray-400 hidden sm:block">
                {userEmail}
              </span>
            )}
            {onLogout && (
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
