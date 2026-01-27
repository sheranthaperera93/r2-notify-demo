import React, { useState } from "react";
import { R2NotifyProvider, useNotifications } from "r2-notify-react";
import "./App.css";
import ConnectionForm from "./components/ConnectionForm";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import NotificationPanel from "./components/notifications/NotificationPanel";
import { env } from "./config/env";

interface AppContentProps {
  wsUrl: string;
  setWsUrl: (url: string) => void;
  clientId: string;
  setClientId: (id: string) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  wsUrl,
  setWsUrl,
  clientId,
  setClientId,
}) => {
  const { lastError } = useNotifications();

  return (
    <div className="min-h-screen flex flex-col">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="success">
          <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              R2 Notify Test App
            </Typography>
            <NotificationPanel />
          </Toolbar>
        </AppBar>
      </Box>
      <Typography
        variant="h5"
        marginTop="10px"
        marginLeft="20px"
        marginRight="20px"
      >
        Test the r2-notify-react notification system
      </Typography>

      {lastError && (
        <Typography variant="h5" className="error-message" marginTop="15px">
          <strong>Error:</strong> {lastError ? lastError.message : "Unknown"}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "16px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Box>
          {/* Connection Form */}
          <ConnectionForm
            clientId={clientId}
            setClientId={setClientId}
            setWsUrl={setWsUrl}
            wsUrl={wsUrl}
          />
        </Box>
      </Box>
    </div>
  );
};

const App: React.FC = () => {
  const [wsUrl, setWsUrl] = useState(env.wsUrl);
  const [clientId, setClientId] = useState(env.clientId);

  return (
    <R2NotifyProvider
      url={env.wsUrl}
      clientId={env.clientId}
      autoConnect={env.wsAutoConnect}
      debug={env.wsDebug}
    >
      <AppContent
        wsUrl={wsUrl}
        clientId={clientId}
        setWsUrl={setWsUrl}
        setClientId={setClientId}
      />
    </R2NotifyProvider>
  );
};

export default App;
