// components/notifications/NotificationCenter.tsx
import { NotificationApp } from "r2-notify-client";
import { useNotifyActions } from "r2-notify-react";
import React, { useState } from "react";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  XMarkIcon,
  BellSlashIcon,
} from "@heroicons/react/24/outline";
import AppAccordion from "./AppAccordion";
import ConfigurationPanel from "./ConfigurationPanel";

interface NotificationCenterProps {
  onClose: () => void;
  notifications: NotificationApp[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onClose,
  notifications,
}) => {
  const [visibleSettings, setVisibleSettings] = useState(false);
  const actions = useNotifyActions();

  const handleRefresh = () => actions?.reloadNotifications?.();

  const handleAppMarkAsRead = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    actions?.markAppAsRead?.(appId);
  };

  const handleAppDelete = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    actions?.deleteAppNotifications?.(appId);
  };

  const handleGroupMarkAsRead = (e: React.MouseEvent, appId: string, groupKey: string) => {
    e.stopPropagation();
    actions?.markGroupAsRead?.(appId, groupKey);
  };

  const handleGroupDelete = (e: React.MouseEvent, appId: string, groupKey: string) => {
    e.stopPropagation();
    actions?.deleteGroupNotifications?.(appId, groupKey);
  };

  const handleMarkNotificationAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    actions?.markNotificationAsRead?.(id);
  };

  const handleNotificationDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    actions?.deleteNotification?.(id);
  };

  const totalUnread = notifications.reduce((sum, app) => sum + app.unread, 0);

  return (
    <div className="w-[360px] sm:w-[400px] bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col max-h-[80vh] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800 tracking-tight">
            Notifications
          </span>
          {totalUnread > 0 && (
            <span className="px-1.5 py-px rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              {totalUnread}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            title="Reload notifications"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVisibleSettings((p) => !p)}
            title="Settings"
            className={`p-1.5 rounded-md transition-colors focus:outline-none ${
              visibleSettings
                ? "text-gray-600 bg-gray-100"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {visibleSettings && <ConfigurationPanel />}

      {/* Notification list */}
      {!visibleSettings && (
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-3">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 ring-1 ring-gray-100">
                <BellSlashIcon className="w-7 h-7 text-gray-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">All caught up</p>
                <p className="text-xs text-gray-400 mt-0.5">No new notifications at the moment.</p>
              </div>
            </div>
          ) : (
            <div>
              {notifications.map((app) => (
                <AppAccordion
                  key={`notification-app-${app.appId}`}
                  app={app}
                  onAppMarkRead={handleAppMarkAsRead}
                  onAppDelete={handleAppDelete}
                  onGroupMarkRead={handleGroupMarkAsRead}
                  onGroupDelete={handleGroupDelete}
                  onItemRead={handleMarkNotificationAsRead}
                  onItemDelete={handleNotificationDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {!visibleSettings && notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 shrink-0">
          <span className="text-[11px] text-gray-300 font-medium">
            {notifications.reduce((s, a) => s + a.total, 0)} notifications
          </span>
        </div>
      )}
    </div>
  );
};