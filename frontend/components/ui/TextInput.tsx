"use client";

import { InputHTMLAttributes } from "react";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange: (value: string) => void;
}

export function TextInput({
  label,
  error,
  id,
  className = "",
  onChange,
  ...props
}: TextInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5
          bg-white/5 border rounded-xl
          text-white placeholder-gray-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50" : "border-white/10 hover:border-white/20"}
          ${className}
        `.trim()}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
