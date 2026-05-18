import React from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { KeyDetailContent } from "../components/manageKey/KeyDetailContent";
 
export const KeyDetailPage: React.FC = () => (
  <ProtectedRoute>
    <KeyDetailContent />
  </ProtectedRoute>
);