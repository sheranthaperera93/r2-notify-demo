import React from "react";
import { useAuth } from "../context/AuthContext";
import { LoginGate } from "./manageKey/LoginGate";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <LoginGate />;
};
