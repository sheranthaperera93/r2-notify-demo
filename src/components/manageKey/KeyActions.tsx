import React, { useState } from "react";
import {
  ArrowPathIcon,
  TrashIcon,
  ExclamationCircleIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { ConfirmAction } from "../../utils/interfaces";

interface Props {
  onRegenerate: () => Promise<void>;
  onRevoke: () => Promise<void>;
  onStatusToggle: () => Promise<void>;
  actionError: string | null;
  keyStatus: boolean;
}

export const KeyActions: React.FC<Props> = ({
  onRegenerate,
  onRevoke,
  onStatusToggle,
  actionError,
  keyStatus,
}) => {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      await onRegenerate();
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleRevoke = async () => {
    setLoading(true);
    try {
      await onRevoke();
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleKeyStatusToggle = async () => {
    setLoading(true);
    try {
      await onStatusToggle();
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Actions
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Error banner */}
        {actionError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Regenerate */}
        {confirmAction === "regenerate" ? (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3 space-y-3">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              This will revoke your current key and generate a new one. Your
              existing integrations will stop working immediately.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors focus:outline-none disabled:opacity-40"
              >
                {loading ? "Regenerating…" : "Yes, regenerate"}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-white/75">
                Regenerate key
              </p>
              <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
                Revoke current key and generate a new one
              </p>
            </div>
            <button
              onClick={() => setConfirmAction("regenerate")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-200 dark:ring-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors focus:outline-none"
            >
              <ArrowPathIcon className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>
        )}

        <div className="h-px bg-gray-100 dark:bg-white/6" />

        {/* Revoke */}
        {confirmAction === "revoke" ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 space-y-3">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              This will permanently revoke your API key. This action cannot be
              undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRevoke}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none disabled:opacity-40"
              >
                {loading ? "Revoking…" : "Yes, revoke key"}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-white/75">
                Revoke key
              </p>
              <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
                Permanently delete this key - cannot be undone
              </p>
            </div>
            <button
              onClick={() => setConfirmAction("revoke")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 ring-1 ring-red-200 dark:ring-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors focus:outline-none"
            >
              <TrashIcon className="w-3.5 h-3.5" /> Revoke
            </button>
          </div>
        )}

        <div className="h-px bg-gray-100 dark:bg-white/6" />

        {/* Toggle Key Status */}
        {confirmAction === "toggle-status" ? (
          <div
            className={`rounded-lg px-4 py-3 space-y-3 border ${
              keyStatus
                ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
            }`}
          >
            <p
              className={`text-xs font-medium ${
                keyStatus
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {keyStatus
                ? "This will disable the key and prevent any verification requests from being processed. You can re-enable the key at any time."
                : "This will re-enable the key and allow verification requests to be processed again."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleKeyStatusToggle}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors focus:outline-none disabled:opacity-40 ${
                  keyStatus
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {loading
                  ? keyStatus
                    ? "Disabling…"
                    : "Enabling…"
                  : keyStatus
                    ? "Yes, disable key"
                    : "Yes, enable key"}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-white/75">
                Key status
              </p>
              <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
                Enable/Disable the key without revoking it. Can be re-enabled at
                any time.
              </p>
            </div>
            <button
              onClick={() => setConfirmAction("toggle-status")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ring-1 transition-colors focus:outline-none ${
                keyStatus
                  ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 ring-red-200 dark:ring-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20"
                  : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 ring-emerald-200 dark:ring-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
              }`}
            >
              <SwatchIcon className="w-3.5 h-3.5" />{" "}
              {keyStatus ? "Disable" : "Enable"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
