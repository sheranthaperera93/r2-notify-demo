import React, { useState } from "react";
import { Header } from "./components/Header";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { R2NotifyProvider } from "r2-notify-react";
import { env } from "./config/env";
import DebugLogPanel from "./components/DebugLogPanel";
import { SendNotificationForm } from "./components/SendNotificationsPanel";

const App: React.FC = () => {
  const [autoConnect, setAutoConnect] = useState(env.wsAutoConnect);
  const [debug, setDebug] = useState(env.wsDebug);
  const apiKey = env.playGroundApiKey;

  return (
    <R2NotifyProvider
      url={env.wsUrl}
      token={apiKey}
      autoConnect={autoConnect}
      debug={debug}
    >
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Page heading */}
            <div className="space-y-1 pb-2">
              <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
                Playground
              </h1>
              <p className="text-sm text-gray-400">
                Configure your connection and send real-time notifications.
              </p>
            </div>

            <ConnectionPanel
              autoConnect={autoConnect}
              setAutoConnect={() => setAutoConnect((prev) => !prev)}
              debug={debug}
              setDebug={() => setDebug((prev) => !prev)}
            />

            <SendNotificationForm apiKey={apiKey} />

            {debug && <DebugLogPanel />}
          </div>
        </main>

        <footer className="py-4 border-t border-gray-100 text-center text-xs text-gray-300">
          &copy; {new Date().getFullYear()} R2 Notify. All rights reserved.
        </footer>
      </div>
    </R2NotifyProvider>
  );
};

export default App;
