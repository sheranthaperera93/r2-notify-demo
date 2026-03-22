// src/api/authClient.ts
import axios, { AxiosRequestConfig } from "axios";
import { env } from "../config/env";

const STORAGE_KEY = "r2-notify-auth-session";

const authClient = axios.create({
  baseURL: `${env.r2AuthSvrUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Refresh lock ---
// Prevents multiple concurrent 401s from each triggering their own refresh call.
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processPendingQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = "/api-keys";
};

// --- Request interceptor: attach access token ---
authClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    }
  } catch {
    // malformed storage — ignore
  }
  return config;
});

// --- Response interceptor: handle 401 with token refresh ---
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh for auth endpoints — a 401 on login/refresh itself means
    // bad credentials or expired refresh token, not an expired access token.
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");
    if (
      error.response?.status !== 401 ||
      isAuthEndpoint ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request to retry
    // once the refresh completes.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return authClient(originalRequest);
        })
        .catch(() => Promise.reject(error));
    }

    // Mark this request so it doesn't retry infinitely.
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) throw new Error("No session");

      const session = JSON.parse(stored);
      if (!session?.refreshToken) throw new Error("No refresh token");

      // Call refresh endpoint directly with axios (not authClient,
      // to avoid triggering this interceptor again).
      const { data } = await axios.post(
        `${env.r2AuthSvrUrl}/api/v1/auth/refresh`,
        { refresh_token: session.refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      const newAccessToken: string = data.access_token;

      // Persist the new access token — keep everything else in session.
      const updatedSession = { ...session, token: newAccessToken };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));

      // Unblock all queued requests with the new token.
      processPendingQueue(null, newAccessToken);

      // Retry the original request with the new token.
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      return authClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — session is dead, send to login.
      processPendingQueue(refreshError, null);
      clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default authClient;
