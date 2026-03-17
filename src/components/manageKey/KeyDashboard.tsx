import React, { useState, useEffect } from "react";
import { KeyIcon, ArrowRightOnRectangleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "./Shared";
import { KeyDetails, KeyInfo } from "./KeyDetails";
import { KeyRevealed } from "./KeyRevealed";
import { KeyActions } from "./KeyActions";

type KeyStage = "loading" | "exists" | "none" | "revealed" | "dismissed";

export const KeyDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [keyStage, setKeyStage] = useState<KeyStage>("loading");
  const [keyDetails, setKeyDetails] = useState<KeyInfo | null>(null);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => { fetchKeyDetails(); }, []);

  const fetchKeyDetails = async () => {
    setKeyStage("loading");
    try {
      // TODO: replace with real endpoint
      // const res = await fetch(`${env.r2NotifySvrUrl}/api/key/details`, {
      //   headers: { Authorization: `Bearer ${user!.token}` },
      // });
      // if (res.status === 404) { setKeyStage("none"); return; }
      // if (!res.ok) throw new Error("Failed to load key details");
      // const data = await res.json();
      // setKeyDetails(data); setKeyStage("exists");

      // --- STUBBED ---
      await new Promise((r) => setTimeout(r, 600));
      setKeyDetails({
        keyId: "key_abc123xyz",
        maskedKey: "r2_••••••••••••••••••••••••••••••••abc1",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        totalVerifications: 142,
      });
      setKeyStage("exists");
      // ---------------
    } catch { setKeyStage("none"); }
  };

  const handleGenerate = async () => {
    setGenerateLoading(true);
    setGenerateError(null);
    try {
      // TODO: replace with real endpoint
      // const res = await fetch(`${env.r2NotifySvrUrl}/api/key`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${user!.token}` },
      //   body: JSON.stringify({ userId: user!.userId }),
      // });
      // if (!res.ok) throw new Error((await res.json()).message ?? "Failed to generate key");
      // setNewApiKey((await res.json()).apiKey);

      // --- STUBBED ---
      await new Promise((r) => setTimeout(r, 800));
      setNewApiKey(`r2_live_stubkey_${Date.now()}_abc123xyz`);
      // ---------------

      setKeyStage("revealed");
    } catch (err: any) {
      setGenerateError(err.message ?? "Something went wrong.");
    } finally { setGenerateLoading(false); }
  };

  const handleRevoke = async () => {
    setActionError(null);
    // TODO: replace with real endpoint
    // await fetch(`${env.r2NotifySvrUrl}/api/key`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${user!.token}` },
    // });

    // --- STUBBED ---
    await new Promise((r) => setTimeout(r, 600));
    // ---------------

    setKeyDetails(null);
    setKeyStage("none");
  };

  const handleRegenerate = async () => {
    setActionError(null);
    // TODO: replace with real endpoint
    // const res = await fetch(`${env.r2NotifySvrUrl}/api/key/regenerate`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${user!.token}` },
    // });
    // if (!res.ok) throw new Error((await res.json()).message ?? "Failed to regenerate");
    // setNewApiKey((await res.json()).apiKey);

    // --- STUBBED ---
    await new Promise((r) => setTimeout(r, 800));
    setNewApiKey(`r2_live_regenerated_${Date.now()}_xyz789`);
    // ---------------

    setKeyStage("revealed");
  };

  const handleDismiss = () => {
    setNewApiKey(null);
    setKeyStage("dismissed");
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
            <span className="font-medium text-gray-600 dark:text-white/60">{user?.username}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/8 ring-1 ring-gray-200 dark:ring-white/10 transition-colors focus:outline-none"
        >
          <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>

      {/* Loading */}
      {keyStage === "loading" && (
        <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm px-5 py-12 flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-gray-400 dark:text-white/30">Loading your key details…</p>
        </div>
      )}

      {/* No key */}
      {keyStage === "none" && (
        <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm px-5 py-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 ring-1 ring-gray-200 dark:ring-white/10">
            <KeyIcon className="w-6 h-6 text-gray-300 dark:text-white/20" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-white/70">No API key yet</p>
            <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">Generate one to start using R2 Notify.</p>
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
            actionError={actionError}
          />
        </>
      )}
    </div>
  );
};
