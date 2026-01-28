/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL: string;
  readonly VITE_WS_DEBUG: string;
  readonly VITE_WS_AUTO_CONNECT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
