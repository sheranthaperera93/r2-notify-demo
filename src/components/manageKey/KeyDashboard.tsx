import React, { useState, useEffect, useRef } from "react";
import {
  KeyIcon,
  ExclamationCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "./Shared";
import { KeyDetails } from "./KeyDetails";
import { KeyRevealed } from "./KeyRevealed";
import { KeyActions } from "./KeyActions";
import authClient from "../../api/authClient";
import { KeyDetail, KeyStage } from "../../utils/interfaces";

export const KeyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [keyStage, setKeyStage] = useState<KeyStage>("loading");
  const [keyDetails, setKeyDetails] = useState<KeyDetail | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchKeyDetails();
  }, [user]);

  const fetchKeyDetails = async () => {
    setKeyStage("loading");
    try {
      const { data } = await authClient.get("/keys");
      const keys: KeyDetail[] = data.keys ?? [];

      if (keys.length === 0) {
        setKeyStage("none");
        return;
      }

      const k = keys[0];
      setKeyDetails({
        key_id: k.key_id,
        start: k.start + "•••••••" + k.key_id.slice(-7),
        enabled: k.enabled,
        name: k.name,
        created: new Date(k.created).getTime(), // convert to ms
        last_user_at: k.last_user_at
          ? new Date(k.last_user_at).getTime()
          : null, // convert to ms
        totalVerifications: 0,
      });
      setKeyStage("exists");
    } catch {
      setKeyStage("none");
    }
  };

  const handleGenerate = async () => {
    setGenerateLoading(true);
    setGenerateError(null);
    try {
      const { data } = await authClient.post("/keys", {
        name: `${user?.username}-key`,
      });
      setNewApiKey(data.key);
      setKeyStage("revealed");
    } catch (err: any) {
      setGenerateError(
        err.response?.data?.error ?? err.message ?? "Something went wrong.",
      );
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleRevoke = async () => {
    setActionError(null);
    if (!keyDetails) return;
    try {
      await authClient.delete(`/keys/${keyDetails.key_id}`);
      setKeyDetails(null);
      setKeyStage("none");
    } catch (err: any) {
      setActionError(
        err.response?.data?.error ?? err.message ?? "Failed to revoke key.",
      );
    }
  };

  const handleRegenerate = async () => {
    setActionError(null);
    if (!keyDetails) return;
    try {
      await authClient.delete(`/keys/${keyDetails.key_id}`);

      const { data } = await authClient.post("/keys", {
        name: `${user?.username}-key`,
      });
      setNewApiKey(data.key);
      setKeyStage("revealed");
    } catch (err: any) {
      setActionError(
        err.response?.data?.error ?? err.message ?? "Failed to regenerate key.",
      );
    }
  };

  const handleKeyStatusToggle = async () => {
    setActionError(null);
    if (!keyDetails) return;
    try {
      await authClient.patch(`/keys/${keyDetails.key_id}`, {
        enabled: !keyDetails.enabled,
      });
      // Update local state to reflect change immediately
      setKeyDetails({ ...keyDetails, enabled: !keyDetails.enabled });
    } catch (err: any) {
      setActionError(
        err.response?.data?.error ?? err.message ?? "Failed to update key status.",
      );
    }
  }

  const handleDismiss = () => {
    setNewApiKey(null);
    setKeyStage("dismissed");
    hasFetched.current = false; // allow re-fetch after dismiss
    fetchKeyDetails();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90 tracking-tight">
            API Key
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-800 dark:hover:bg-white/8 ring-1 ring-gray-200 dark:ring-white/10 transition-colors focus:outline-none"
        >
          <ArrowRightStartOnRectangleIcon className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>

      {/* Loading */}
      {keyStage === "loading" && (
        <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm px-5 py-12 flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-gray-400 dark:text-white/30">
            Loading your key details…
          </p>
        </div>
      )}

      {/* No key */}
      {keyStage === "none" && (
        <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm px-5 py-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 ring-1 ring-gray-200 dark:ring-white/10">
            <KeyIcon className="w-6 h-6 text-gray-300 dark:text-white/20" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-white/70">
              No API key yet
            </p>
            <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
              Generate one to start using R2 Notify.
            </p>
          </div>
          {generateError && (
            <div className="flex items-start gap-2 w-full rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400">
              <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
              <span>{generateError}</span>
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={generateLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generateLoading ? <Spinner /> : <KeyIcon className="w-4 h-4" />}
            {generateLoading ? "Generating…" : "Generate API Key"}
          </button>
        </div>
      )}

      {/* One-time key reveal */}
      {keyStage === "revealed" && newApiKey && (
        <KeyRevealed apiKey={newApiKey} onDismiss={handleDismiss} />
      )}

      {/* Key exists — details + actions */}
      {(keyStage === "exists" || keyStage === "dismissed") && keyDetails && (
        <>
          <KeyDetails details={keyDetails} />
          <KeyActions
            onRegenerate={handleRegenerate}
            onRevoke={handleRevoke}
            onStatusToggle={handleKeyStatusToggle}
            actionError={actionError}
            keyStatus={keyDetails.enabled}
          />
        </>
      )}
    </div>
  );
};
