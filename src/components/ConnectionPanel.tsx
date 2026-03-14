import React, { useEffect } from "react";
import { useNotifications, useNotifyClient } from "r2-notify-react";
import {
  LinkIcon,
  SignalIcon,
  SignalSlashIcon,
  BugAntIcon,
} from "@heroicons/react/24/outline";

interface ConnectionPanelProps {
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
  debug: boolean;
  setDebug: (debug: boolean) => void;
}

interface ToggleProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (val: boolean) => void;
  name: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, disabled, onChange, name }) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    name={name}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed ${
      checked ? "bg-emerald-500" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-[18px]" : "translate-x-[3px]"
      }`}
    />
  </button>
);

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  autoConnect,
  setAutoConnect,
  debug,
  setDebug,
}) => {
  const { isConnected, lastError } = useNotifications();
  const client = useNotifyClient();

  const handleDebugToggle = (value: boolean) => {
    setDebug(value);
    if (autoConnect) setAutoConnect(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("autoConnect") === "true") setAutoConnect(true);
    if (urlParams.get("debug") === "true") setDebug(true);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    autoConnect ? url.searchParams.set("autoConnect", "true") : url.searchParams.delete("autoConnect");
    debug ? url.searchParams.set("debug", "true") : url.searchParams.delete("debug");
    window.history.replaceState({}, "", url);
  }, [autoConnect, debug]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
            <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800 tracking-tight">
            Connection Settings
          </span>
        </div>

        {/* Status pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-all duration-500 ${
            isConnected
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-gray-50 text-gray-400 ring-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {/* Error banner */}
      {lastError?.message && (
        <div className="mx-5 mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-600">
          <span className="mt-px shrink-0">⚠</span>
          <span>{lastError.message}</span>
        </div>
      )}

      {/* Controls */}
      <div className="px-5 py-5 flex flex-col gap-4">

        {/* Auto Connect */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SignalIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Auto Connect</p>
              <p className="text-xs text-gray-400 mt-0.5">Reconnect automatically on mount</p>
            </div>
          </div>
          <Toggle
            name="autoConnect"
            checked={autoConnect}
            disabled={isConnected && !autoConnect}
            onChange={setAutoConnect}
          />
        </div>

        <div className="h-px bg-gray-100" />

        {/* Debug Logs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BugAntIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Debug Logs</p>
              <p className="text-xs text-gray-400 mt-0.5">Print WebSocket activity to console</p>
            </div>
          </div>
          <Toggle
            name="enableDebug"
            checked={debug}
            onChange={handleDebugToggle}
          />
        </div>
      </div>

      {/* Connect / Disconnect button */}
      {!autoConnect && (
        <div className="px-5 pb-5">
          {isConnected ? (
            <button
              onClick={() => client?.close()}
              title="Disconnect from R2 Notify"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 ring-1 ring-red-200 hover:bg-red-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <SignalSlashIcon className="w-4 h-4" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => client?.connect()}
              title="Connect to R2 Notify"
              disabled={isConnected}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SignalIcon className="w-4 h-4" />
              Connect
            </button>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="mx-5 mb-5 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Notes</p>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-500 leading-relaxed">
          <li>
            The WebSocket connection is established automatically when the provider is mounted with{" "}
            <code className="text-emerald-600 text-[11px]">autoConnect=true</code>. Uncheck to manually control the session lifecycle.
          </li>
          <li>
            Debug logs toggle WebSocket activity output in the browser console for the R2-Notify connection.
          </li>
        </ol>
      </div>
    </div>
  );
};