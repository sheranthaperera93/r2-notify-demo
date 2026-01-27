import React from "react";
import { useNotifications } from "r2-notify-react";

interface ConnectionPanelProps {
  wsUrl: string;
  setWsUrl: (url: string) => void;
  clientId: string;
  setClientId: (clientId: string) => void;
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  wsUrl,
  setWsUrl,
  clientId,
  setClientId,
  autoConnect,
  setAutoConnect,
  onConnect,
  onDisconnect,
}) => {
  const { isConnected } = useNotifications();

  const statusColor = {
    true: "text-green-500 bg-green-500",
    false: "text-gray-400 bg-gray-400",
  }[isConnected + ""];

  const statusLabel = {
    true: "Connected",
    false: "Disconnected",
  }[isConnected + ""];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Connection Settings
        </h2>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <span
          className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`}
        ></span>
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
            WebSocket URL
          </label>
          <input
            type="text"
            name="url"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-700"
            placeholder="ws://localhost:8081/ws"
          />
        </div>

        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-gray-500">
            User ID (Client ID)
          </label>
          <input
            type="text"
            name="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-700 font-mono"
            placeholder="client-xxxxxx"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="autoConnect"
                checked={autoConnect}
                onChange={(e) => setAutoConnect(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${autoConnect ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoConnect ? "translate-x-4" : "translate-x-0"}`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Auto Connect
            </span>
          </label>

          <div className="flex space-x-3">
            {!autoConnect &&
              (isConnected ? (
                <button
                  onClick={onDisconnect}
                  className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors focus:ring-2 focus:ring-red-500 outline-none"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={onConnect}
                  disabled={!isConnected}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-all focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-bold text-gray-700">Note:</span> The WebSocket
          connection is established automatically when the provider is mounted
          with <code>autoConnect=true</code>. Uncheck "Auto Connect" to manually
          control session lifecycle.
        </p>
      </div>
    </div>
  );
};
