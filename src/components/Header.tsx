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
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { BeakerIcon, KeyIcon, HomeIcon } from "@heroicons/react/24/outline";

export const Header: React.FC = () => {
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const processedNewNotificationsRef = useRef<Set<string>>(new Set());

  const { listNotifications, newNotification, isConnected } = useNotifications();
  const toggleCenter = useCallback(() => setIsCenterOpen((prev) => !prev), []);

  useEffect(() => {
    if (!Array.isArray(listNotifications)) return;
    setNotifications(listNotifications);
  }, [listNotifications]);

  useEffect(() => {
    if (!newNotification) return;
    const n = newNotification as NotificationMessage;
    if (!processedNewNotificationsRef.current.has(n.id)) {
      processedNewNotificationsRef.current.add(n.id);
      setNotifications((curr) => [n, ...curr]);
    }
  }, [newNotification]);

  useEffect(() => {
    if (!isConnected) {
      setNotifications([]);
      processedNewNotificationsRef.current.clear();
    }
  }, [isConnected]);

  const groupedNotifications = useMemo<NotificationApp[]>(() => {
    return groupNotifications(deDuplicateAndSort(notifications));
  }, [notifications]);

  const notificationCount = useMemo(() => {
    return deDuplicateAndSort(notifications).length;
  }, [notifications]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
      isActive
        ? "bg-white/15 text-white ring-1 ring-white/20"
        : "text-white/50 hover:text-white/80 hover:bg-white/8"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1f10]/90 backdrop-blur-md">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30">
            <BellIconSolid className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-white">
              R2 Notify
            </span>
            <span className="hidden sm:block text-xs text-white/30 font-normal">
              Notification System
            </span>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            <HomeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
          <NavLink to="/playground" end className={navLinkClass}>
            <BeakerIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Playground</span>
          </NavLink>
          <NavLink to="/get-started" className={navLinkClass}>
            <KeyIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Started</span>
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-500 ${
              isConnected
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                : "bg-white/5 text-white/30 ring-1 ring-white/10"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? "bg-emerald-400 animate-pulse" : "bg-white/20"
              }`}
            />
            {isConnected ? "Live" : "Offline"}
          </div>

          {isConnected && (
            <button
              onClick={toggleCenter}
              title={isCenterOpen ? "Close notifications" : "Open notifications"}
              className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                isCenterOpen
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "text-white/50 hover:bg-white/8 hover:text-white/80"
              }`}
            >
              <BellIcon className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white leading-none">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {isCenterOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsCenterOpen(false)}>
          <div className="absolute top-14 right-4 z-50" onClick={(e) => e.stopPropagation()}>
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
