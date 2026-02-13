"use client";

import { ReactNode } from "react";

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function GlassCard({
  children,
  className = "",
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-md
        border border-white/10
        rounded-xl
        shadow-lg shadow-black/20
        ${paddingStyles[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
