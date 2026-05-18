import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyIcon,
  PlusIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "./Shared";
import authClient from "../../api/authClient";
import { KeyBasic } from "../../utils/interfaces";
import { formatDate, maskKeyValue } from "../../utils/utils";

const MAX_KEYS = 5;

// ---------- Revealed Key Banner ----------

interface RevealedBannerProps {
  apiKey: string;
  onDismiss: () => void;
}

const RevealedBanner: React.FC<RevealedBannerProps> = ({
  apiKey,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-amber-200 dark:border-amber-500/20">
        <div className="flex items-center gap-2">
          <ExclamationCircleIcon className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Copy your new key now
          </span>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-1 leading-relaxed">
          This is the only time your key will be shown. Once dismissed, it
          cannot be recovered.
        </p>
      </div>

      <div className="px-5 py-4 space-y-3">
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
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-3.5 h-3.5" />
            ) : (
              <ClipboardDocumentIcon className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <button
          onClick={onDismiss}
          disabled={!copied}
          className="w-full py-2 rounded-lg text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15 hover:bg-amber-200 dark:hover:bg-amber-500/25 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied
            ? "I've saved it — dismiss"
            : "Copy the key before dismissing"}
        </button>
      </div>
    </div>
  );
};

// ---------- Create Key Section ----------

interface CreateKeySectionProps {
  onCreated: (key: string) => void;
  disabled: boolean;
}

const CreateKeySection: React.FC<CreateKeySectionProps> = ({
  onCreated,
  disabled,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await authClient.post("/keys", { name: name.trim() });
      setName("");
      onCreated(data.key);
    } catch (err: any) {
      setError(
        err.response?.data?.error ?? err.message ?? "Failed to create key",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Create new key
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {disabled ? (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3.5 py-3 text-xs text-amber-600 dark:text-amber-400">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
            <span>
              You've reached the maximum of {MAX_KEYS} keys. Revoke an existing
              key to create a new one.
            </span>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                disabled={loading}
                placeholder="e.g. production-app, staging-server"
                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-white/80 placeholder-gray-300 dark:placeholder-white/20 bg-white dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                onClick={handleCreate}
                disabled={!name.trim() || loading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <Spinner /> : <PlusIcon className="w-4 h-4" />}
                {loading ? "Creating…" : "Create"}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-white/25">
              Give it a descriptive name so you can identify it later.
            </p>
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
                <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ---------- Key List Page ----------

export const KeyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<KeyBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchKeys();
  }, [user]);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const { data } = await authClient.get("/keys");
      const raw: KeyBasic[] = data.keys ?? [];
      setKeys(
        raw.map((k) => ({
          key_id: k.key_id,
          name: k.name,
          start: maskKeyValue(k.start),
          enabled: k.enabled,
          created: k.created,
        })),
      );
    } catch {
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = (newKey: string) => {
    setRevealedKey(newKey);
  };

  const handleDismiss = () => {
    setRevealedKey(null);
    hasFetched.current = false;
    fetchKeys();
  };

  const atLimit = keys.length >= MAX_KEYS;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90 tracking-tight">
            API Keys
          </h1>
          <p className="text-sm text-gray-400 dark:text-white/40">
            Signed in as{" "}
            <span className="font-medium text-gray-600 dark:text-white/60">
              {user?.username}
            </span>
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 ring-1 ring-gray-200 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none"
        >
          <ArrowRightStartOnRectangleIcon className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>

      {/* Revealed key banner */}
      {revealedKey && (
        <RevealedBanner apiKey={revealedKey} onDismiss={handleDismiss} />
      )}

      {/* Create key section */}
      {!loading && (
        <CreateKeySection onCreated={handleCreated} disabled={atLimit} />
      )}

      {/* Key list */}
      <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Your keys
          </span>
          <span className="text-xs text-gray-400 dark:text-white/30">
            {loading ? "—" : keys.length} / {MAX_KEYS}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Spinner />
            <p className="text-sm text-gray-400 dark:text-white/30">
              Loading keys…
            </p>
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center px-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 ring-1 ring-gray-200 dark:ring-white/10">
              <KeyIcon className="w-6 h-6 text-gray-300 dark:text-white/20" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-white/70">
                No API keys yet
              </p>
              <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
                Create your first key to start using R2 Notify.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/6">
            {keys.map((k) => (
              <button
                key={k.key_id}
                onClick={() => navigate(`/api-keys/${k.key_id}`)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left focus:outline-none"
              >
                {/* Status dot */}
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    k.enabled
                      ? "bg-emerald-500 dark:bg-emerald-400 w-2.5 h-2.5 animate-pulse"
                      : "bg-gray-300 dark:bg-white/20"
                  }`}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-800 dark:text-white/85 truncate">
                      {k.name}
                    </span>
                    <span
                      className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        k.enabled
                          ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-white/30"
                      }`}
                    >
                      {k.enabled ? "Operational" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-white/30">
                    <code className="font-mono">{k.start}</code>
                    <span>·</span>
                    <span>Created {formatDate(k.created)}</span>
                  </div>
                </div>

                <ChevronRightIcon className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
