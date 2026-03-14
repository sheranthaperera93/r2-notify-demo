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
    active: "bg-emerald-50 ring-emerald-300 text-emerald-700",
    idle: "bg-white ring-gray-200 text-gray-500 hover:ring-gray-300",
  },
  {
    value: "info" as const,
    label: "Info",
    icon: InformationCircleIcon,
    active: "bg-blue-50 ring-blue-300 text-blue-700",
    idle: "bg-white ring-gray-200 text-gray-500 hover:ring-gray-300",
  },
  {
    value: "error" as const,
    label: "Error",
    icon: ExclamationCircleIcon,
    active: "bg-red-50 ring-red-300 text-red-700",
    idle: "bg-white ring-gray-200 text-gray-500 hover:ring-gray-300",
  },
];

export const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  apiKey,
}) => {
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
          "X-App-ID": appKey,
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({ groupKey, message, status }),
      });

      if (response.ok) {
        setSent(true);
        setMessage("");
        setTimeout(() => setSent(false), 2000);
      } else {
        console.error("Notification failed to send");
      }
    } finally {
      setSending(false);
    }
  };

  const canSend = isConnected && !!message && !!groupKey && !!appKey && !sending;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 ring-1 ring-violet-200">
            <PaperAirplaneIcon className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800 tracking-tight">
            Send Notification
          </span>
        </div>

        {!isConnected && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 ring-1 ring-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Connect first
          </span>
        )}
      </div>

      {/* Form fields */}
      <div className="px-5 py-5 flex flex-col gap-4">

        {/* App Key + Group Key */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <KeyIcon className="w-3.5 h-3.5" />
              App Key
            </label>
            <input
              type="text"
              value={appKey}
              title="Application Key"
              onChange={(e) => setAppKey(e.target.value)}
              disabled={!isConnected}
              placeholder="e.g., my-app"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <TagIcon className="w-3.5 h-3.5" />
              Group Key
            </label>
            <input
              type="text"
              value={groupKey}
              title="Group Key"
              onChange={(e) => setGroupKey(e.target.value)}
              disabled={!isConnected}
              placeholder="e.g., notifications"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" />
            Message
          </label>
          <textarea
            value={message}
            title="Notification Message"
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
            rows={3}
            placeholder="Enter your notification message..."
            required
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>

        {/* Notification Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500">
            Notification Type
          </label>
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
                  title={`${type.label} Notification`}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ring-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive ? type.active : type.idle
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          title="Send Notification"
          disabled={!canSend}
          onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-40 disabled:cursor-not-allowed ${
            sent
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-violet-600 text-white hover:bg-violet-700"
          }`}
        >
          {sent ? (
            <>
              <CheckCircleIcon className="w-4 h-4" />
              Sent!
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-4 h-4" />
              {sending ? "Sending…" : "Send Notification"}
            </>
          )}
        </button>
      </div>

      {/* Tip */}
      <div className="mx-5 mb-5 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 flex gap-2.5">
        <LightBulbIcon className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Open this playground in another browser tab with the same Client ID to see real-time notifications. You can also send notifications to different Client IDs for testing multi-user scenarios.
        </p>
      </div>
    </div>
  );
};