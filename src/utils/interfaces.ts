export type KeyBasic = {
  created: number;
   enabled: boolean;
  key_id: string;
  name: string;
  start: string;
}

export type KeyDetail = {
  created: number;
  updated: number;
  enabled: boolean;
  key_id: string;
  last_used: number | null;
  name: string;
  start: string;
  requests_remaining: number;
}

export type KeyStage = "loading" | "exists" | "none" | "revealed" | "dismissed";

export type ConfirmAction = "revoke" | "regenerate" | "toggle-status" | null;

export type Status = "verifying" | "success" | "error" | "missing";