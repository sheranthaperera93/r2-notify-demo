import { NotificationApp } from "r2-notify-client";
import { useNotifyActions } from "r2-notify-react";
import React, { useState } from "react";
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

  /**
   * Handles the event to mark all notifications for a specific app as read.
   * @param {React.MouseEvent} e - The event object.
   * @param {string} appId - The ID of the app to mark as read.
   */
  const handleAppMarkAsRead = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    actions?.markAppAsRead?.(appId);
  };

  /**
   * Handles the event to delete all notifications for a specific app.
   * @param {React.MouseEvent} e - The event object.
   * @param {string} appId - The ID of the app to delete notifications for.
   */
  const handleAppDelete = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    actions?.deleteAppNotifications?.(appId);
  };

  /**
   * Handles the event to mark all notifications for a specific app and group key as read.
   * @param {React.MouseEvent} e - The event object.
   * @param {string} appId - The ID of the app to mark as read.
   * @param {string} groupKey - The key of the group to mark as read.
   */
  const handleGroupMarkAsRead = (
    e: React.MouseEvent,
    appId: string,
    groupKey: string,
  ) => {
    e.stopPropagation();
    actions?.markGroupAsRead?.(appId, groupKey);
  };

  /**
   * Handles the event to delete all notifications for a specific app and group key.
   * @param {React.MouseEvent} e - The event object.
   * @param {string} appId - The ID of the app to delete notifications for.
   * @param {string} groupKey - The key of the group to delete notifications for.
   */
  const handleGroupDelete = (
    e: React.MouseEvent,
    appId: string,
    groupKey: string,
  ) => {
    e.stopPropagation();
    actions?.deleteGroupNotifications?.(appId, groupKey);
  };
  /**
   * Handles the event to mark a notification as read.
   * @param {React.MouseEvent} e - The event object.
   * @param {string} id - The ID of the notification to mark as read.
   */
  const handleMarkNotificationAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    actions?.markNotificationAsRead?.(id);
  };

  /**
   * Handles the event to delete a specific notification.
   * @param {React.MouseEvent} e - The event object.
   * @param {string} id - The ID of the notification to delete.
   */
  const handleNotificationDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    actions?.deleteNotification?.(id);
  };

  return (
    <div className="w-[380px] sm:w-[420px] bg-white rounded-xl overflow-hidden notification-shadow border border-gray-100 flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            RELOAD
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setVisibleSettings((prev) => !prev)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {visibleSettings && <ConfigurationPanel />}

      {/* Content */}
      {!visibleSettings && (
        <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-slate-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-slate-900 font-bold text-lg">All caught up!</p>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                No new notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
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

      {/* Footer Actions */}
      {!visibleSettings && notifications.length > 0 && (
        <div className="px-4 py-3 bg-white border-t border-gray-100 flex">
          <span className="text-[10px] text-gray-400 font-medium">
            {notifications.length} Total Notifications
          </span>
        </div>
      )}
    </div>
  );
};
