// src/components/notifications/ConfigurationPanel.tsx
import React, { useEffect, useState } from "react";
import { useNotifications, useNotifyActions } from "r2-notify-react";
import { FingerPrintIcon } from "@heroicons/react/24/outline";

interface Configuration { [key: string]: any; }

const Toggle: React.FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${checked ? "bg-emerald-500" : "bg-gray-200 dark:bg-white/10"}`}
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
  </button>
);

const ConfigurationPanel: React.FC = () => {
  const { listConfigurations: configuration } = useNotifications();
  const { setNotificationStatus } = useNotifyActions();
  const [isEnabled, setIsEnabled] = useState<boolean>(configuration?.enableNotification ?? false);

  const configList = configuration ? (configuration as Configuration) : {};
  const configEntries = Object.entries(configList);

  const handleEnableChange = (newValue: boolean) => {
    setIsEnabled(newValue);
    if (configuration) setNotificationStatus(newValue);
  };

  useEffect(() => {
    if (configuration?.enableNotification !== undefined) setIsEnabled(configuration.enableNotification);
  }, [configuration?.enableNotification]);

  if (configEntries.length === 0) return null;

  return (
    <div className="border-b border-gray-100 dark:border-white/8 bg-gray-50/60 dark:bg-white/3 px-4 py-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 w-36 shrink-0">
          <FingerPrintIcon className="w-3.5 h-3.5 text-gray-300 dark:text-white/20" />
          <span className="text-xs font-medium text-gray-400 dark:text-white/30">Client ID</span>
        </div>
        <input
          id="config_user_id_field"
          type="text"
          value={configuration?.userId || ""}
          placeholder="Unique user identifier"
          readOnly
          className="flex-1 text-xs text-gray-600 dark:text-white/50 bg-transparent border-b border-gray-200 dark:border-white/10 py-0.5 focus:outline-none truncate"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 dark:text-white/30">Enable Notifications</span>
        <Toggle checked={isEnabled} onChange={handleEnableChange} />
      </div>
      <p className="text-[10px] text-gray-300 dark:text-white/15 text-right">Powered by r2-notify</p>
    </div>
  );
};

export default ConfigurationPanel;
