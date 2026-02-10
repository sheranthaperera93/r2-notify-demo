import { useNotifications } from "r2-notify-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NotificationCenter } from "../components/notifications/NotificationCenter";
import { NotificationApp, NotificationMessage } from "r2-notify-client";
import { deDuplicateAndSort, groupNotifications } from "./notifications/utils";

export const Header: React.FC = () => {
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  // Track processed notification IDs to prevent duplicates
  const processedNewNotificationsRef = useRef<Set<string>>(new Set());

  const { listNotifications, newNotification, isConnected } =
    useNotifications();

  // Memoize toggle function
  const toggleCenter = useCallback(() => setIsCenterOpen((prev) => !prev), []);

  // Handle initial list and bulk updates from listNotifications
  useEffect(() => {
    if (!Array.isArray(listNotifications)) return;
    setNotifications(listNotifications);
  }, [listNotifications]);

  // Handle new real-time notifications
  useEffect(() => {
    if (!newNotification) return;

    const n = newNotification as NotificationMessage;

    // Only add if we haven't seen this specific newNotification event
    if (!processedNewNotificationsRef.current.has(n.id)) {
      processedNewNotificationsRef.current.add(n.id);
      setNotifications((curr) => [n, ...curr]);
    }
  }, [newNotification]);

  // Handle disconnect - reset everything
  useEffect(() => {
    if (!isConnected) {
      setNotifications([]);
      processedNewNotificationsRef.current.clear();
    }
  }, [isConnected]);

  // Deduplicate, sort, and group notifications
  const groupedNotifications = useMemo<NotificationApp[]>(() => {
    return groupNotifications(deDuplicateAndSort(notifications));
  }, [notifications]);

  // Calculate count from deduplicated notifications
  const notificationCount = useMemo(() => {
    return deDuplicateAndSort(notifications).length;
  }, [notifications]);

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
            R2 Notify Playground
          </span>
        </div>

        {isConnected && (
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
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#1b5e20]">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>
        )}
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
            <NotificationCenter
              notifications={groupedNotifications}
              onClose={() => setIsCenterOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};
