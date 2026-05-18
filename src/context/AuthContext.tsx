// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import authClient from "../api/authClient";

interface AuthUser {
  username: string;
  userId: string;
  token: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = "r2-notify-auth-session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Step 1 — get access + refresh tokens
      const { data: loginData } = await authClient.post("/auth/login", {
        username,
        password,
      });

      const accessToken: string = loginData.access_token;
      const refreshToken: string = loginData.refresh_token;

      // Step 2 — fetch profile for username + userId
      const { data: meData } = await authClient.get("/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const session: AuthUser = {
        username: meData.username,
        userId: meData.id,
        token: accessToken,
        refreshToken,
      };

      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Login failed";
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
