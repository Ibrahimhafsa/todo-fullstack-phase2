"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantStyles = {
  primary:
    "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] active:bg-cyan-600",
  secondary:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30",
  danger:
    "bg-red-500/80 hover:bg-red-500 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  ghost:
    "bg-transparent hover:bg-white/10 text-cyan-400 hover:text-cyan-300",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
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
      {children}
    </button>
  );
}
