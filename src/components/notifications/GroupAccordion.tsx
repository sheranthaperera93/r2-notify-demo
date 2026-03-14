// components/notifications/GroupAccordion.tsx
import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  CheckIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import NotificationItem from "./NotificationItem";
import { NotificationGroup, NotificationMessage } from "r2-notify-client";

type Props = {
  appId: string;
  group: NotificationGroup;
  onMarkRead: (e: React.MouseEvent, appId: string, groupKey: string) => void;
  onDelete: (e: React.MouseEvent, appId: string, groupKey: string) => void;
  onItemRead: (e: React.MouseEvent, id: string) => void;
  onItemDelete: (e: React.MouseEvent, id: string) => void;
};

export default function GroupAccordion({
  appId,
  group,
  onMarkRead,
  onDelete,
  onItemRead,
  onItemDelete,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const unreadCount = group.items.filter((i) => !i.readStatus).length;

  return (
    <div>
      {/* Group header */}
      <div className="flex items-center pl-6 pr-2 py-1.5 hover:bg-gray-50/80 transition-colors group">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left focus:outline-none"
        >
          <ChevronDownIcon
            className={`w-3.5 h-3.5 text-gray-300 shrink-0 transition-transform duration-200 ${
              expanded ? "" : "-rotate-90"
            }`}
          />
          <span className="text-xs font-medium text-gray-500 truncate">
            {group.groupKey}
          </span>
          {unreadCount > 0 && (
            <span className="ml-1 shrink-0 px-1.5 py-px rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 ring-1 ring-blue-200">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Group context menu */}
        <div
          className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
            className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <EllipsisVerticalIcon className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-50 w-48 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
              <button
                onClick={(e) => { onMarkRead(e, appId, group.groupKey); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                Mark Group as Read
              </button>
              <button
                onClick={(e) => { onDelete(e, appId, group.groupKey); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      {expanded && (
        <div>
          {group.items.map((item: NotificationMessage) => (
            <NotificationItem
              key={`item-${appId}-${group.groupKey}-${item.id}`}
              item={item}
              onMarkRead={onItemRead}
              onDelete={onItemDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}