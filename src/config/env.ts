interface EnvConfig {
  wsUrl: string;
  r2NotifySvrUrl: string;
  r2AuthSvrUrl: string;
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
  wsUrl: getEnvVar("VITE_WS_URL"),
  r2NotifySvrUrl: getEnvVar("VITE_R2_NOTIFY_SVR"),
  r2AuthSvrUrl: getEnvVar("VITE_R2_AUTH_SVR"),
  wsDebug: getEnvBool("VITE_WS_DEBUG", false),
  wsAutoConnect: getEnvBool("VITE_WS_AUTO_CONNECT", true),
  playGroundApiKey: getEnvVar("VITE_PLAYGROUND_API_KEY"),
};

if (env.wsDebug && import.meta.env.DEV) {
  console.log("WebSocket Configuration:", {
    url: env.wsUrl,
    debug: env.wsDebug,
    reconnect: env.wsAutoConnect,
  });
}
