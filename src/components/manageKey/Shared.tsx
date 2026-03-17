import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const Spinner: React.FC = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}> = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 px-4 py-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 ${accent}`} />
      <span className="text-xs font-medium text-gray-400 dark:text-white/40">{label}</span>
    </div>
    <p className="text-sm font-semibold text-gray-800 dark:text-white/85">{value}</p>
  </div>
);

export const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, onKeyDown, disabled, placeholder, className }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20 hover:text-gray-500 dark:hover:text-white/50 transition-colors"
      >
        {show ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
      </button>
    </div>
  );
};

export const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-white/80 placeholder-gray-300 dark:placeholder-white/20 bg-white dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

export function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
