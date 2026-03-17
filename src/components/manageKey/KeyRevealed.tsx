import React, { useState } from "react";
import {
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

interface Props {
  apiKey: string;
  onDismiss: () => void;
}

export const KeyRevealed: React.FC<Props> = ({ apiKey, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/15 ring-1 ring-amber-200 dark:ring-amber-500/25">
          <EyeSlashIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">Your new API key</span>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Warning banner */}
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3.5 py-3">
          <EyeSlashIcon className="w-4 h-4 text-amber-500 shrink-0 mt-px" />
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Copy this key now</p>
            <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-0.5 leading-relaxed">
              This is the only time your key will be shown. Once dismissed, it cannot be recovered.
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
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all focus:outline-none ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                : "bg-white/8 text-gray-400 hover:text-white hover:bg-white/15 ring-1 ring-white/10"
            }`}
          >
            {copied
              ? <ClipboardDocumentCheckIcon className="w-3.5 h-3.5" />
              : <ClipboardDocumentIcon className="w-3.5 h-3.5" />
            }
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          disabled={!copied}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 ring-1 ring-red-200 dark:ring-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors focus:outline-none disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <EyeSlashIcon className="w-4 h-4" />
          I've copied it — dismiss key
        </button>

        {!copied && (
          <p className="text-center text-[11px] text-gray-400 dark:text-white/30">
            Copy the key before dismissing.
          </p>
        )}
      </div>
    </div>
  );
};
