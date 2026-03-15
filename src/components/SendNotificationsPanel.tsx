// src/components/SendNotificationsPanel.tsx
import React, { useState } from "react";
import { useNotifications } from "r2-notify-react";
import { env } from "../config/env";
import {
  PaperAirplaneIcon,
  KeyIcon,
  TagIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface SendNotificationFormProps {
  apiKey: string;
}

export interface NotificationPayload {
  targetClientId: string;
  message: string;
  groupKey: string;
  appKey: string;
  status: "success" | "info" | "error";
}

const statusTypes = [
  {
    value: "success" as const,
    label: "Success",
    icon: CheckCircleIcon,
    active: "bg-emerald-50 dark:bg-emerald-500/15 ring-emerald-300 dark:ring-emerald-500/30 text-emerald-700 dark:text-emerald-400",
    idle: "bg-white dark:bg-gray-800 ring-gray-200 dark:ring-white/10 text-gray-500 dark:text-white/40 hover:ring-gray-300 dark:hover:ring-white/20",
  },
  {
    value: "info" as const,
    label: "Info",
    icon: InformationCircleIcon,
    active: "bg-blue-50 dark:bg-blue-500/15 ring-blue-300 dark:ring-blue-500/30 text-blue-700 dark:text-blue-400",
    idle: "bg-white dark:bg-gray-800 ring-gray-200 dark:ring-white/10 text-gray-500 dark:text-white/40 hover:ring-gray-300 dark:hover:ring-white/20",
  },
  {
    value: "error" as const,
    label: "Error",
    icon: ExclamationCircleIcon,
    active: "bg-red-50 dark:bg-red-500/15 ring-red-300 dark:ring-red-500/30 text-red-700 dark:text-red-400",
    idle: "bg-white dark:bg-gray-800 ring-gray-200 dark:ring-white/10 text-gray-500 dark:text-white/40 hover:ring-gray-300 dark:hover:ring-white/20",
  },
];

export const SendNotificationForm: React.FC<SendNotificationFormProps> = ({ apiKey }) => {
  const [message, setMessage] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const [appKey, setAppKey] = useState("");
  const [status, setStatus] = useState<"success" | "info" | "error">("success");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { isConnected } = useNotifications();

  const handleSubmit = async () => {
    if (!message || !groupKey || !appKey) return;
    setSending(true);
    try {
      const response = await fetch(`${env.r2NotifySvrUrl}/notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
          "X-App-ID": appKey,
        },
        body: JSON.stringify({ groupKey, message, status }),
      });
      if (response.ok) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 2000);
      }
    } finally {
      setSending(false);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-white/80 placeholder-gray-300 dark:placeholder-white/20 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-white/5 disabled:text-gray-400 dark:disabled:text-white/20 disabled:cursor-not-allowed`;

  const canSend = isConnected && !!message && !!groupKey && !!appKey && !sending;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/15 ring-1 ring-violet-200 dark:ring-violet-500/25">
            <PaperAirplaneIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90 tracking-tight">
            Send Notification
          </span>
        </div>
        {!isConnected && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Connect first
          </span>
        )}
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-white/40">
              <KeyIcon className="w-3.5 h-3.5" /> App Key
            </label>
            <input type="text" value={appKey} onChange={(e) => setAppKey(e.target.value)} disabled={!isConnected} placeholder="e.g., my-app" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-white/40">
              <TagIcon className="w-3.5 h-3.5" /> Group Key
            </label>
            <input type="text" value={groupKey} onChange={(e) => setGroupKey(e.target.value)} disabled={!isConnected} placeholder="e.g., notifications" required className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-white/40">
            <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" /> Message
          </label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} disabled={!isConnected} rows={3} placeholder="Enter your notification message..." required className={`${inputClass} resize-none`} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 dark:text-white/40">Notification Type</label>
          <div className="grid grid-cols-3 gap-2">
            {statusTypes.map((type) => {
              const Icon = type.icon;
              const isActive = status === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  disabled={!isConnected}
                  onClick={() => setStatus(type.value)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ring-1 transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${isActive ? type.active : type.idle}`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={!canSend}
          onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
            sent
              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/25"
              : "bg-violet-600 dark:bg-violet-500/20 text-white dark:text-violet-300 hover:bg-violet-700 dark:hover:bg-violet-500/30 ring-1 ring-transparent dark:ring-violet-500/25"
          }`}
        >
          {sent ? (
            <><CheckCircleIcon className="w-4 h-4" />Sent!</>
          ) : (
            <><PaperAirplaneIcon className="w-4 h-4" />{sending ? "Sending…" : "Send Notification"}</>
          )}
        </button>
      </div>

      <div className="mx-5 mb-5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-white/10 px-4 py-3 flex gap-2.5">
        <LightBulbIcon className="w-4 h-4 text-gray-300 dark:text-white/40 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400 dark:text-white/60 leading-relaxed">
          Open this playground in another browser tab with the same Client ID to see real-time notifications. You can also send notifications to different Client IDs for testing multi-user scenarios.
        </p>
      </div>
    </div>
  );
};
