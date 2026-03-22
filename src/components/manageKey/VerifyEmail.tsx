import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { env } from "../../config/env";

type Status = "verifying" | "success" | "error" | "missing";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState(5);
  const hasVerified = useRef(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }

    if (hasVerified.current) return; // ← blocks the second StrictMode call
    hasVerified.current = true;

    const verify = async () => {
      try {
        const res = await fetch(
          `${env.r2AuthSvrUrl}/api/v1/auth/verify-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.error || "Verification failed.");
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch {
        setErrorMessage("Could not reach the server. Please try again.");
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  // Auto-redirect to login after success
  useEffect(() => {
    if (status !== "success") return;
    if (countdown === 0) {
      navigate("/api-keys");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-950 border border-gray-100 dark:border-gray-800 p-10 flex flex-col items-center text-center gap-6">
          {/* Verifying */}
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Verifying your email
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Just a moment...
                </p>
              </div>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Email verified
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your account is ready. Redirecting to login in{" "}
                  <span className="font-medium text-emerald-500">
                    {countdown}s
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate("/api-keys")}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-medium transition-colors duration-150"
              >
                Go to login
              </button>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Verification failed
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {errorMessage}
                </p>
              </div>
              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={() => navigate("/resend-verification")}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-medium transition-colors duration-150"
                >
                  Resend verification email
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors duration-150"
                >
                  Back to home
                </button>
              </div>
            </>
          )}

          {/* Missing token */}
          {status === "missing" && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Invalid link
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This verification link is missing a token. Please use the link
                  from your email.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors duration-150"
              >
                Back to home
              </button>
            </>
          )}

          {/* Branding */}
          <p className="text-xs text-gray-400 dark:text-gray-600">
            R2-Notify · Email Verification
          </p>
        </div>
      </div>
    </div>
  );
}
