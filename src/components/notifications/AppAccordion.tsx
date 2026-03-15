// src/components/notifications/AppAccordion.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon, TrashIcon, EllipsisVerticalIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import GroupAccordion from "./GroupAccordion";
import { NotificationApp } from "r2-notify-client";

type Props = {
  app: NotificationApp;
  onAppMarkRead: (e: React.MouseEvent, appId: string) => void;
  onAppDelete: (e: React.MouseEvent, appId: string) => void;
  onGroupMarkRead: (e: React.MouseEvent, appId: string, groupKey: string) => void;
  onGroupDelete: (e: React.MouseEvent, appId: string, groupKey: string) => void;
  onItemRead: (e: React.MouseEvent, id: string) => void;
  onItemDelete: (e: React.MouseEvent, id: string) => void;
};

export default function AppAccordion({ app, onAppMarkRead, onAppDelete, onGroupMarkRead, onGroupDelete, onItemRead, onItemDelete }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="border-b border-gray-100 dark:border-white/6 last:border-b-0">
      <div className="flex items-center px-3 py-2.5 hover:bg-gray-50/60 dark:hover:bg-white/4 transition-colors group">
        <button onClick={() => setExpanded((p) => !p)} className="flex items-center gap-2 flex-1 min-w-0 text-left focus:outline-none">
          <ChevronDownIcon className={`w-3.5 h-3.5 text-gray-400 dark:text-white/25 shrink-0 transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`} />
          <div className="flex items-center justify-center w-5 h-5 rounded bg-gray-100 dark:bg-white/8 shrink-0">
            <Squares2X2Icon className="w-3 h-3 text-gray-400 dark:text-white/30" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-white/70 truncate tracking-wide uppercase">{app.appId}</span>
          {app.unread > 0 && (
            <span className="ml-1 shrink-0 px-1.5 py-px rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/25">
              {app.unread} unread
            </span>
          )}
        </button>
        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }} className="p-1 rounded-md text-gray-300 dark:text-white/20 hover:text-gray-500 dark:hover:text-white/50 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors focus:outline-none">
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-50 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden">
              <button onClick={(e) => { onAppMarkRead(e, app.appId); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/8 transition-colors">
                <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> Mark App as Read
              </button>
              <button onClick={(e) => { onAppDelete(e, app.appId); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <TrashIcon className="w-3.5 h-3.5" /> Delete App
              </button>
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <div className="pb-1">
          {app.groups.map((group) => (
            <GroupAccordion key={`group-${app.appId}-${group.groupKey}`} appId={app.appId} group={group} onMarkRead={onGroupMarkRead} onDelete={onGroupDelete} onItemRead={onItemRead} onItemDelete={onItemDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
