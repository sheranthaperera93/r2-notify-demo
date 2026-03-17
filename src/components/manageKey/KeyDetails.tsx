import React from "react";
import {
  ShieldCheckIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { StatCard, formatDate } from "./Shared";

export interface KeyInfo {
  keyId: string;
  maskedKey: string;
  createdAt: string;
  lastUsedAt: string | null;
  totalVerifications: number;
}

interface Props {
  details: KeyInfo;
}

export const KeyDetails: React.FC<Props> = ({ details }) => (
  <div className="rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-white/8">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/15 ring-1 ring-violet-200 dark:ring-violet-500/25">
        <ShieldCheckIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
      </div>
      <span className="text-sm font-semibold text-gray-800 dark:text-white/90">Key Details</span>
      <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    </div>

    <div className="px-5 py-4">
      {/* Masked key */}
      <div className="flex items-center gap-2 rounded-lg bg-gray-950 border border-gray-800 px-4 py-3 mb-4">
        <code className="flex-1 text-xs text-gray-400 font-mono truncate">
          {details.maskedKey}
        </code>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={CalendarDaysIcon}
          label="Created"
          value={formatDate(details.createdAt)}
          accent="text-violet-400"
        />
        <StatCard
          icon={ClockIcon}
          label="Last used"
          value={formatDate(details.lastUsedAt)}
          accent="text-blue-400"
        />
        <StatCard
          icon={ChartBarIcon}
          label="Total verifications"
          value={details.totalVerifications.toLocaleString()}
          accent="text-emerald-400"
        />
      </div>
    </div>
  </div>
);
