// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
  username: string;
  userId: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore session from localStorage on mount
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
      // TODO: replace with real endpoint
      // const res = await fetch(`${env.r2NotifySvrUrl}/api/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ username, password }),
      // });
      // if (!res.ok) throw new Error((await res.json()).message ?? "Login failed");
      // const data = await res.json();
      // const session: AuthUser = { username: data.username, userId: data.userId, token: data.token };

      // --- STUBBED ---
      await new Promise((r) => setTimeout(r, 800));
      if (password.length < 3) throw new Error("Invalid credentials");
      const session: AuthUser = {
        username,
        userId: `user_${username.toLowerCase().replace(/\s+/g, "_")}`,
        token: `stub_token_${Date.now()}`,
      };
      // ---------------

      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
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