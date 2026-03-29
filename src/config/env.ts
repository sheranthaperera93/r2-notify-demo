interface EnvConfig {
  r2NotifySvrUrl: string;
  wsDebug: boolean;
  wsAutoConnect: boolean;
  playGroundApiKey: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvBool(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === "true" || value === "1";
}

export const env: EnvConfig = {
  r2NotifySvrUrl: getEnvVar("VITE_R2_NOTIFY_SVR"),
  wsDebug: getEnvBool("VITE_R2_NOTIF_DEBUG", false),
  wsAutoConnect: getEnvBool("VITE_R2_NOTIFY_AUTO_CONNECT", true),
  playGroundApiKey: getEnvVar("VITE_PLAYGROUND_API_KEY"),
};

if (env.wsDebug && import.meta.env.DEV) {
  console.log("WebSocket Configuration:", {
    r2NotifySvrUrl: env.r2NotifySvrUrl,
    wsDebug: env.wsDebug,
    wsAutoConnect: env.wsAutoConnect,
  });
}
