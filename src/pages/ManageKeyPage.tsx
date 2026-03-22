import React from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { KeyDashboard } from "../components/manageKey/KeyDashboard";
 
export const ManageKeyPage: React.FC = () => (
  <ProtectedRoute>
    <KeyDashboard />
  </ProtectedRoute>
);