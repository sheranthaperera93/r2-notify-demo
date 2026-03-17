// src/pages/ManageKeyPage.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { LoginGate } from "../components/manageKey/LoginGate";
import { KeyDashboard } from "../components/manageKey/KeyDashboard";

export const ManageKeyPage: React.FC = () => {
  const { user } = useAuth();
  return user ? <KeyDashboard /> : <LoginGate />;
};
