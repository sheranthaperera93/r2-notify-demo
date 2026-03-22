import React, { useState } from "react";
import { KeyIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { Spinner, PasswordInput, inputClass } from "./Shared";

interface Props {
  onSwitchToRegister: () => void;
}

export const SignInForm: React.FC<Props> = ({ onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    setError(null);
    try {
      await login(username.trim(), password);
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-0.5">
          Welcome back
        </h3>
        <p className="text-xs text-gray-400 dark:text-white/35">
          Enter your credentials to continue.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-white/40">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          disabled={isLoading}
          placeholder="your-username"
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-white/40">
          Password
        </label>
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          disabled={isLoading}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
          {error}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={!username.trim() || !password.trim() || isLoading}
        className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Spinner /> Signing in…
          </>
        ) : (
          <>
            <KeyIcon className="w-4 h-4" /> Sign In
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-white/25 mt-1">
        No account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
        >
          Register here
        </button>
      </p>
    </div>
  );
};
