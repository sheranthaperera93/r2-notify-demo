export type KeyDetail = {
  created: number;
  enabled: boolean;
  key_id: string;
  last_user_at: number | null;
  name: string;
  start: string;
  totalVerifications: number;
}

export type KeyStage = "loading" | "exists" | "none" | "revealed" | "dismissed";

export type ConfirmAction = "revoke" | "regenerate" | "toggle-status" | null;