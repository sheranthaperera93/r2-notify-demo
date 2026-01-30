import React, { useState } from "react";
import { Header } from "./components//Header";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { R2NotifyProvider } from "r2-notify-react";
import { env } from "./config/env";
import DebugLogPanel from "./components/DebugLogPanel";

const App: React.FC = () => {
  const [clientId, setClientId] = useState("client-1768563100345");
  const [autoConnect, setAutoConnect] = useState(env.wsAutoConnect);
  const [debug, setDebug] = useState(env.wsDebug);

  return (
    <R2NotifyProvider
      url={env.wsUrl}
      clientId={clientId}
      autoConnect={autoConnect}
      debug={debug}
    >
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-800">
                Test the R2 Notify notification system
              </h1>
              <p className="text-gray-500">
                Configure your connection settings below to start receiving
                real-time alerts.
              </p>
            </div>

            <div className="relative mb-8 space-y-6">
              <ConnectionPanel
                wsUrl={env.wsUrl}
                clientId={clientId}
                setClientId={(value) => setClientId(value)}
                autoConnect={autoConnect}
                setAutoConnect={() => {
                  setAutoConnect((prev) => !prev);
                }}
                debug={debug}
                setDebug={() => {
                  setDebug((prev) => !prev);
                }}
              />
              {debug && <DebugLogPanel />}
            </div>
          </div>
        </main>

        <footer className="py-4 border-t text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} R2 Notify Test Suite. All rights
          reserved.
        </footer>
      </div>
    </R2NotifyProvider>
  );
};

export default App;
