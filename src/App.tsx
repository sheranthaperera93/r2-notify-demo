import React, { useState } from "react";
import { Header } from "./components/Header";
import { R2NotifyProvider } from "r2-notify-react";
import { env } from "./config/env";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlaygroundPage from "./pages/PlaygroundPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import { LandingPage } from "./pages/LandingPage";

const App: React.FC = () => {
  const [autoConnect, setAutoConnect] = useState(env.wsAutoConnect);
  const [debug, setDebug] = useState(env.wsDebug);
  const apiKey = env.playGroundApiKey;

  return (
    <BrowserRouter>
      <R2NotifyProvider
        url={env.wsUrl}
        apiKey={apiKey}
        autoConnect={autoConnect}
        debug={debug}
      >
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/playground"
                element={
                  <PlaygroundPage
                    autoConnect={autoConnect}
                    setAutoConnect={setAutoConnect}
                    debug={debug}
                    setDebug={setDebug}
                    apiKey={apiKey}
                  />
                }
              />
              <Route path="/get-started" element={<GetStartedPage />} />
            </Routes>
          </main>

          <footer className="py-4 border-t border-gray-100 text-center text-xs text-gray-300">
            &copy; {new Date().getFullYear()} R2 Notify. All rights reserved.
          </footer>
        </div>
      </R2NotifyProvider>
    </BrowserRouter>
  );
};

export default App;
