"use client";

export interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function LoadingState({
  message = "Loading...",
  size = "md",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div
          className={`
            ${sizeStyles[size]}
            border-4 border-cyan-500/20
            border-t-cyan-500
            rounded-full
            animate-spin
          `}
        />
        <div
          className={`
            absolute inset-0
            ${sizeStyles[size]}
            border-4 border-transparent
            border-t-cyan-300/50
            rounded-full
            animate-spin
            animation-delay-150
          `}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      {message && (
        <p className="text-gray-400 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
}
