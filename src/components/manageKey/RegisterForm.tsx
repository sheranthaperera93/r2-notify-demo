import React, { useState } from "react";
import {
  UserCircleIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Spinner, PasswordInput, inputClass } from "./Shared";

interface Props {
  onSwitchToSignIn: (prefillUsername?: string) => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitchToSignIn }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password || !confirm) return;
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setError(null);
    setLoading(true);
    try {
      // TODO: replace with real endpoint
      // const res = await fetch(`${env.r2NotifySvrUrl}/api/auth/register`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      // });
      // if (!res.ok) throw new Error((await res.json()).message ?? "Registration failed");

      // --- STUBBED ---
      await new Promise((r) => setTimeout(r, 800));
      if (username.toLowerCase() === "taken") throw new Error("Username already taken.");
      // ---------------

      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 flex-1 text-center py-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/15 ring-1 ring-emerald-200 dark:ring-emerald-500/25">
          <CheckCircleIcon className="w-7 h-7 text-emerald-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800 dark:text-white/85">Account created!</p>
          <p className="text-xs text-gray-400 dark:text-white/35 mt-1">
            You can now sign in with your credentials.
          </p>
        </div>
        <button
          onClick={() => onSwitchToSignIn(username)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors focus:outline-none"
        >
          <KeyIcon className="w-4 h-4" /> Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-0.5">
          Create an account
        </h3>
        <p className="text-xs text-gray-400 dark:text-white/35">
          Fill in the details below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-white/40">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            disabled={loading}
            placeholder="choose a username"
            className={inputClass}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-white/40">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            disabled={loading}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-white/40">Password</label>
          <PasswordInput
            value={password}
            onChange={(v) => { setPassword(v); setError(null); }}
            disabled={loading}
            placeholder="min. 6 characters"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-white/40">Confirm Password</label>
          <PasswordInput
            value={confirm}
            onChange={(v) => { setConfirm(v); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            disabled={loading}
            placeholder="repeat password"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
          {error}
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={!username.trim() || !email.trim() || !password || !confirm || loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading
          ? <><Spinner /> Creating account…</>
          : <><UserCircleIcon className="w-4 h-4" /> Create Account</>
        }
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-white/25">
        Already have an account?{" "}
        <button
          onClick={() => onSwitchToSignIn()}
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
