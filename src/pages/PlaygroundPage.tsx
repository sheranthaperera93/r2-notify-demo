// src/pages/PlaygroundPage.tsx
import React from "react";
import { ConnectionPanel } from "../components/playground/ConnectionPanel";
import DebugLogPanel from "../components/playground/DebugLogPanel";
import { SendNotificationForm } from "../components/playground/SendNotificationsPanel";

const PlaygroundPage: React.FC<{
  autoConnect: boolean;
  setAutoConnect: (v: boolean) => void;
  debug: boolean;
  setDebug: (v: boolean) => void;
  apiKey: string;
}> = ({ autoConnect, setAutoConnect, debug, setDebug, apiKey }) => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="space-y-1 pb-2">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90 tracking-tight">
        Playground
      </h1>
      <p className="text-sm text-gray-400 dark:text-white/40">
        Configure your connection and send real-time notifications.
      </p>
    </div>
    <ConnectionPanel
      autoConnect={autoConnect}
      setAutoConnect={() => setAutoConnect(!autoConnect)}
      debug={debug}
      setDebug={() => setDebug(!debug)}
    />
    <SendNotificationForm apiKey={apiKey} />
    {debug && <DebugLogPanel />}
  </div>
);

export default PlaygroundPage;
