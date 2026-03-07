import { createContext, useContext, useState, ReactNode } from "react";
import {env} from "../config/env";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (googleIdToken: string) => Promise<void>;
  signOut: () => void;
}

enum StorageKeys {
  User = "r2_notify_user",
  Token = "r2_notify_token",
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(StorageKeys.User);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(StorageKeys.Token);
  });
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (googleIdToken: string) => {
    setIsLoading(true);
    try {
      const baseUrl = env.r2NotifySvrUrl;
      const res = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleIdToken }),
      });

      if (!res.ok) throw new Error("Auth failed");

      const data = await res.json(); // { jwt, user: { id, name, email, avatar } }

      setUser(data.user);
      setToken(data.jwt);
      localStorage.setItem(StorageKeys.User, JSON.stringify(data.user));
      localStorage.setItem(StorageKeys.Token, data.jwt);
    } catch (err) {
      console.error("Sign in failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(StorageKeys.User);
    localStorage.removeItem(StorageKeys.Token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
