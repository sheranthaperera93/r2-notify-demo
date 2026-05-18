import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ClockIcon,
  TrashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "../../components/manageKey/Shared";
import authClient from "../../api/authClient";
import { formatDate, maskKeyValue } from "../../utils/utils";
import { KeyDetail } from "../../utils/interfaces";

// ---------- Stat Card ----------

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}> = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 px-4 py-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-4 h-4 ${accent}`} />
      <span className="text-xs font-medium text-gray-400 dark:text-white/40">
        {label}
      </span>
    </div>
    <p className="text-sm font-semibold text-gray-800 dark:text-white/85">
      {value}
    </p>
  </div>
);

// ---------- Key Detail Page ----------

export const KeyDetailContent: React.FC = () => {
  const { keyId } = useParams<{ keyId: string }>();
  const navigate = useNavigate();
  const [key, setKey] = useState<KeyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    if (keyId) fetchKeyDetail();
  }, [keyId]);

  const fetchKeyDetail = async () => {
    setLoading(true);
    try {
      const { data } = await authClient.get(`/keys/${keyId}`);
      setKey({
        key_id: data.key_id,
        name: data.name,
        start: data.start,
        enabled: data.enabled,
        created: data.created,
        updated: data.updated,
        last_used: data.last_used_at ?? null,
        requests_remaining: data.requests_remaining ?? "Unlimited",
      });
    } catch {
      setError("Failed to load key details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await authClient.delete(`/keys/${keyId}`);
      navigate("/api-keys");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to revoke key.");
      setConfirmRevoke(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!key) return;
    setActionLoading(true);
    setError(null);
    try {
      await authClient.patch(`/keys/${keyId}`, { enabled: !key.enabled });
      setKey((prev) => (prev ? { ...prev, enabled: !prev.enabled } : prev));
      setConfirmToggle(false);
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to update key.");
      setConfirmToggle(false);
    } finally {
      setActionLoading(false);
      fetchKeyDetail();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3 py-20">
        <Spinner />
        <p className="text-sm text-gray-400 dark:text-white/30">
          Loading key details…
        </p>
      </div>
    );
  }

  if (error && !key) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate("/api-keys")}
          className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to keys
        </button>
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-3 text-xs text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
          {error}
        </div>
      </div>
    );
  }

  if (!key) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back nav */}
      <button
        onClick={() => navigate("/api-keys")}
        className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to keys
      </button>

      {/* Key header card */}
      <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-white/8">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/15 ring-1 ring-violet-200 dark:ring-violet-500/25">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
            {key.name}
          </span>
          <span
            className={`ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${
              key.enabled
                ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-500/25"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-white/80 ring-gray-200 dark:ring-white/10"
            }`}
          >
            {key.enabled ? (
              <CheckCircleIcon className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <XCircleIcon className="w-3.5 h-3.5" />
            )}
            {key.enabled ? "Operational" : "Disabled"}
          </span>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Masked key */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-950 border border-gray-800 px-4 py-3">
            <code className="flex-1 text-xs text-gray-400 font-mono truncate">
              Key: {maskKeyValue(key.start)}
            </code>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              icon={CalendarDaysIcon}
              label="Created"
              value={formatDate(key.created)}
              accent="text-violet-400"
            />
            <StatCard
              icon={CalendarDaysIcon}
              label="Updated"
              value={formatDate(key.updated)}
              accent="text-violet-400"
            />
            <StatCard
              icon={ClockIcon}
              label="Last used"
              value={formatDate(key.last_used)}
              accent="text-blue-400"
            />
            <StatCard
              icon={ShieldCheckIcon}
              label="Remaining Requests"
              value={key.requests_remaining.toLocaleString()}
              accent="text-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-3 text-xs text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-px" />
          {error}
        </div>
      )}

      {/* Actions card */}
      <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/8">
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Actions
          </span>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Toggle status */}
          {confirmToggle ? (
            <div
              className={`rounded-lg px-4 py-3 space-y-3 border ${
                key.enabled
                  ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                  : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
              }`}
            >
              <p
                className={`text-xs font-medium ${
                  key.enabled
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-emerald-700 dark:text-emerald-400"
                }`}
              >
                {key.enabled
                  ? "This will disable the key and prevent any verification requests from being processed. You can re-enable it at any time."
                  : "This will re-enable the key and allow verification requests to be processed again."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleStatus}
                  disabled={actionLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors focus:outline-none disabled:opacity-40 ${
                    key.enabled
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {actionLoading
                    ? key.enabled
                      ? "Disabling…"
                      : "Enabling…"
                    : key.enabled
                      ? "Yes, disable"
                      : "Yes, enable"}
                </button>
                <button
                  onClick={() => setConfirmToggle(false)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
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
                  {key.enabled
                    ? "Key is active and processing requests."
                    : "Key is disabled and not processing requests."}
                </p>
              </div>
              <button
                onClick={() => setConfirmToggle(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ring-1 transition-colors focus:outline-none ${
                  key.enabled
                    ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 ring-amber-200 dark:ring-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                    : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 ring-emerald-200 dark:ring-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                }`}
              >
                {key.enabled ? "Disable" : "Enable"}
              </button>
            </div>
          )}

          <div className="h-px bg-gray-100 dark:bg-white/6" />

          {/* Revoke */}
          {confirmRevoke ? (
            <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 space-y-3">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                This will permanently revoke this key. All integrations using it
                will stop working immediately. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRevoke}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none disabled:opacity-40"
                >
                  {actionLoading ? "Revoking…" : "Yes, revoke key"}
                </button>
                <button
                  onClick={() => setConfirmRevoke(false)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
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
                  Permanently delete this key — cannot be undone
                </p>
              </div>
              <button
                onClick={() => setConfirmRevoke(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 ring-1 ring-red-200 dark:ring-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors focus:outline-none"
              >
                <TrashIcon className="w-3.5 h-3.5" /> Revoke
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
