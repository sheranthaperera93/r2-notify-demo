import { useNotifications } from "r2-notify-react";
import React, { useEffect, useState } from "react";
import { NotificationCenter } from "../components/notifications/NotificationCenter";

export const Header: React.FC = () => {
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const toggleCenter = () => setIsCenterOpen(!isCenterOpen);

  const { listNotifications, newNotification, isConnected } =
    useNotifications();

  useEffect(() => {
    const base = Array.isArray(listNotifications) ? listNotifications : [];
    setNotificationCount(base.length);
  }, [listNotifications]);

  useEffect(() => {
    if (!newNotification) return;
    setNotificationCount((curr) => curr + 1);
  }, [newNotification]);

  useEffect(() => {
    if (!isConnected) setNotificationCount(0);
  }, [isConnected]);

  return (
    <header className="bg-[#1b5e20] text-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight">
            R2 Notify Test App
          </span>
        </div>

        <button
          onClick={toggleCenter}
          className="relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {isConnected && notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#1b5e20]">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
      </div>

      {isCenterOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsCenterOpen(false)}
        >
          <div
            className="absolute top-16 right-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationCenter onClose={() => setIsCenterOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};
