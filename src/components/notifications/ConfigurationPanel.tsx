import React, { useEffect, useState } from "react";
import { useNotifications, useNotifyActions } from "r2-notify-react";

interface Configuration {
  [key: string]: any;
}

const ConfigurationPanel: React.FC = () => {
  const { listConfigurations: configuration } = useNotifications();
  const { setNotificationStatus } = useNotifyActions();
  const [isEnabled, setIsEnabled] = useState<boolean>(
    configuration?.enableNotification ?? false,
  );

  const configList = configuration ? (configuration as Configuration) : {};
  const configEntries = Object.entries(configList);

  const handleEnableConfigChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.checked;
    setIsEnabled(newValue);
    if (configuration) {
      setNotificationStatus(newValue);
    }
  };

  useEffect(() => {
    if (configuration?.enableNotification !== undefined) {
      setIsEnabled(configuration.enableNotification);
    }
  }, [configuration?.enableNotification]);

  return (
    <div className="p-4">
      {configEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <label className="min-w-[150px] text-sm font-medium text-gray-700">
              Client ID
            </label>
            <input
              id="config_user_id_field"
              type="text"
              className="flex-1 border-b border-gray-300 focus:border-blue-600 outline-none px-0 py-1 text-sm text-gray-900 transition-colors"
              value={configuration?.userId || ""}
              placeholder="Unique user identifier"
              readOnly
            />
          </div>
          <div className="flex items-center gap-4 mt-4 mb-4">
            <label className="min-w-[140px] text-sm font-medium text-gray-700">
              Enable Notifications
            </label>
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleEnableConfigChange}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${isEnabled ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <div
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? "translate-x-4" : "translate-x-0"}`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      )}
      <div className="flex justify-end items-center">
        <p className="text-xs text-gray-500">Powered by r2-notify</p>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
