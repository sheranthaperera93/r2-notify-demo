import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { SignInForm } from "./SignInForm";
import { RegisterForm } from "./RegisterForm";

type Tab = "signin" | "register";

export const LoginGate: React.FC = () => {
  const [tab, setTab] = useState<Tab>("signin");
  const [_prefillUsername, setPrefillUsername] = useState("");

  const switchTab = (t: Tab, username?: string) => {
    setTab(t);
    if (username) setPrefillUsername(username);
  };

  return (
    <div className="min-h-[calc(100vh-15rem)] flex items-center justify-center py-8">
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-gray-200 dark:border-white/8 shadow-xl flex flex-col sm:flex-row">

        {/* Left branded panel */}
        <div className="relative sm:w-2/5 bg-[#0f1f10] px-8 py-10 flex flex-col justify-between overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(to right, #4ade80 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(74,222,128,0.15),transparent)]" />

          <div className="relative">
            <div className="flex items-center gap-2.5 mb-10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30">
                <BellIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">R2 Notify</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug mb-3 tracking-tight">
              Manage your<br />API key
            </h2>
            <p className="text-xs text-white/40 leading-relaxed">
              Sign in to view usage, regenerate or revoke your key.
            </p>
          </div>

          <div className="relative mt-8 space-y-3">
            {[
              "View key details & usage stats",
              "Regenerate without losing history",
              "Revoke access instantly",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shrink-0" />
                <span className="text-xs text-white/35">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 bg-white dark:bg-gray-900 px-8 py-10 flex flex-col">
          {/* Tab toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/5 mb-8 self-start">
            {(["signin", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none ${
                  tab === t
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm ring-1 ring-gray-200 dark:ring-white/10"
                    : "text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60"
                }`}
              >
                {t === "signin" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "signin" && (
            <SignInForm onSwitchToRegister={() => switchTab("register")} />
          )}
          {tab === "register" && (
            <RegisterForm onSwitchToSignIn={(u) => switchTab("signin", u)} />
          )}
        </div>
      </div>
    </div>
  );
};
