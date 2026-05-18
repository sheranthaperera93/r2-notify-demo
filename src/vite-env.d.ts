/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_R2_NOTIFY_SVR: string;
  readonly VITE_R2_NOTIF_DEBUG: string;
  readonly VITE_R2_NOTIFY_AUTO_CONNECT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
