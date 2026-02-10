import React, { useState } from "react";
import { useNotifications } from "r2-notify-react";
import { env } from "../config/env";

interface SendNotificationFormProps {
  clientId: string;
}

export interface NotificationPayload {
  targetClientId: string;
  message: string;
  groupKey: string;
  appKey: string;
  status: "success" | "info" | "error";
}

export const SendNotificationForm: React.FC<SendNotificationFormProps> = ({
  clientId,
}) => {
  const [targetClientId, setTargetClientId] = useState(clientId);
  const [message, setMessage] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const [appKey, setAppKey] = useState("");
  const [status, setStatus] = useState<"success" | "info" | "error">("success");
  const { isConnected } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetClientId || !message || !groupKey || !appKey) {
      return;
    }

    const response = await fetch(`${env.r2NotifySvrUrl}/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": clientId,
        "X-App-ID": appKey,
      },
      body: JSON.stringify({
        groupKey,
        message,
        status,
      }),
    });

    if (response.ok) {
      console.log("Notification sent successfully!");
    } else {
      console.error("Notification failed to send");
    }

    // Optionally clear the form after sending
    setMessage("");
  };

  const handleSendToSelf = () => {
    setTargetClientId(clientId);
  };

  const statusTypes = [
    {
      value: "success" as const,
      label: "Success",
      activeClasses: "border-green-500 bg-green-50",
      textClasses: "text-green-700",
    },
    {
      value: "info" as const,
      label: "Info",
      activeClasses: "border-blue-500 bg-blue-50",
      textClasses: "text-blue-700",
    },
    {
      value: "error" as const,
      label: "Error",
      activeClasses: "border-red-500 bg-red-50",
      textClasses: "text-red-700",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Send Notification
          </h2>
        </div>
        {!isConnected && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Connect first
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target User ID (Client ID) */}
          <div className="relative md:col-span-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
              Target User ID (Client ID)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetClientId}
                onChange={(e) => setTargetClientId(e.target.value)}
                disabled={!isConnected}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-700 font-mono disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="client-xxxxxx"
                required
              />
              <button
                type="button"
                onClick={handleSendToSelf}
                disabled={!isConnected || !clientId}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                Send to Self
              </button>
            </div>
          </div>

          {/* Group Key */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
              Group Key
            </label>
            <input
              type="text"
              value={groupKey}
              onChange={(e) => setGroupKey(e.target.value)}
              disabled={!isConnected}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="e.g., notifications"
              required
            />
          </div>

          {/* App Key */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
              App Key
            </label>
            <input
              type="text"
              value={appKey}
              onChange={(e) => setAppKey(e.target.value)}
              disabled={!isConnected}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-700 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="e.g., my-app"
              required
            />
          </div>

          {/* Message */}
          <div className="relative md:col-span-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isConnected}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-700 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter your notification message..."
              required
            />
          </div>

          {/* Notification Status */}
          <div className="relative md:col-span-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
              Notification Type
            </label>
            <div className="flex gap-3 pt-3">
              {statusTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex-1 cursor-pointer ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={type.value}
                    checked={status === type.value}
                    onChange={(e) =>
                      setStatus(e.target.value as "success" | "info" | "error")
                    }
                    disabled={!isConnected}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      status === type.value
                        ? type.activeClasses
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        status === type.value
                          ? type.textClasses
                          : "text-gray-600"
                      }`}
                    >
                      {type.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={
              !isConnected ||
              !targetClientId ||
              !message ||
              !groupKey ||
              !appKey
            }
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-all focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Send Notification</span>
            </span>
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="mb-2">
          <span className="font-bold text-gray-700">Tip</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Open this playground in another browser tab with the same Client ID to
          see real-time notifications. You can also send notifications to
          different Client IDs for testing multi-user scenarios.
        </p>
      </div>
    </div>
  );
};
