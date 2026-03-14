import React, { useState } from "react";
import {
  KeyIcon,
  UserCircleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { env } from "../config/env";

type Stage = "form" | "loading" | "revealed" | "dismissed";

const GetStartedPage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!userId.trim()) return;
    setError(null);
    setStage("loading");

    try {
      const response = await fetch(`${env.r2NotifySvrUrl}/api/key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message ?? `Request failed (${response.status})`);
      }

      const data = await response.json();
      setApiKey(data.key ?? data.apiKey ?? data.token);
      setStage("revealed");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setStage("form");
    }
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
  };

  const handleDismiss = () => {
    setApiKey(null);
    setUserId("");
    setCopied(false);
    setStage("dismissed");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page heading */}
      <div className="space-y-1 pb-2">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          Get API Key
        </h1>
        <p className="text-sm text-gray-400">
          Generate a personal API key to authenticate with R2 Notify.
        </p>
      </div>

      {/* Steps card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 ring-1 ring-amber-200">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              How it works
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          <ol className="space-y-3">
            {[
              {
                step: "1",
                text: "Enter a unique User ID that identifies you - this is used to scope the key to your account.",
              },
              {
                step: "2",
                text: "Click Generate. Your User ID is sent to the server which creates an API key.",
              },
              {
                step: "3",
                text: "Copy your key immediately. It will only be shown once and cannot be retrieved again.",
              },
              {
                step: "4",
                text: 'Paste it as the API key in the R2 Notify in your application to authenticate and start sending notifications!',
              },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[11px] font-bold text-gray-500 shrink-0 mt-px">
                  {step}
                </span>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Form / Reveal card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 ring-1 ring-violet-200">
              <KeyIcon className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              Generate API Key
            </span>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* ── DISMISSED state ── */}
          {stage === "dismissed" && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Key secured
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your key has been dismissed. Generate a new one if needed.
                </p>
              </div>
              <button
                onClick={() => setStage("form")}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-700 bg-violet-50 ring-1 ring-violet-200 hover:bg-violet-100 transition-colors focus:outline-none"
              >
                Generate another
              </button>
            </div>
          )}

          {/* ── FORM state ── */}
          {(stage === "form" || stage === "loading") && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <UserCircleIcon className="w-3.5 h-3.5" />
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  disabled={stage === "loading"}
                  placeholder="e.g. user_abc123"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">
                  Choose something unique and memorable - you'll use this to
                  identify your key.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-600">
                  <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!userId.trim() || stage === "loading"}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-violet-700 bg-violet-50 ring-1 ring-violet-200 hover:bg-violet-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {stage === "loading" ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin text-violet-500"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <KeyIcon className="ml-2 w-4 h-4" />
                    Generate API Key
                    <ArrowRightIcon className="mr-2 w-3.5 h-3.5 ml-auto" />
                  </>
                )}
              </button>
            </>
          )}

          {/* ── REVEALED state ── */}
          {stage === "revealed" && apiKey && (
            <div className="space-y-4">
              {/* Warning banner */}
              <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-3">
                <EyeSlashIcon className="w-4 h-4 text-amber-500 shrink-0 mt-px" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    Copy this key now
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                    This is the only time your API key will be shown. Once
                    dismissed, it cannot be recovered.
                  </p>
                </div>
              </div>

              {/* Key display */}
              <div className="flex items-center gap-2 rounded-lg bg-gray-950 border border-gray-800 px-4 py-3">
                <code className="flex-1 text-xs text-emerald-400 font-mono truncate select-all">
                  {apiKey}
                </code>
                <button
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all focus:outline-none ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-white/8 text-gray-400 hover:text-white hover:bg-white/15 ring-1 ring-white/10"
                  }`}
                >
                  {copied ? (
                    <ClipboardDocumentCheckIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Dismiss */}
              <button
                onClick={handleDismiss}
                disabled={!copied}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-35 disabled:cursor-not-allowed text-red-600 bg-red-50 ring-1 ring-red-200 hover:bg-red-100"
              >
                <EyeSlashIcon className="w-4 h-4" />
                I've copied it - dismiss key
              </button>

              {!copied && (
                <p className="text-center text-[11px] text-gray-400">
                  Copy the key first before dismissing.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;