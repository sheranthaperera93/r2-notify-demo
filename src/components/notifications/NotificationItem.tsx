// components/notifications/NotificationItem.tsx
import { useState, useRef, useEffect } from "react";
import {
  CheckIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import NotificationStatusBorder from "./NotificationStatusBorder";
import { formatDate } from "./utils";
import { NotificationMessage } from "r2-notify-client";

type Props = {
  item: NotificationMessage;
  onMarkRead: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
};

export default function NotificationItem({ item, onMarkRead, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <NotificationStatusBorder
      status={item.status}
      className={`ml-4 my-0.5 ${!item.readStatus ? "bg-gray-50/70" : ""}`}
    >
      <div
        className="flex items-start gap-2 py-2 pr-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Unread dot */}
        <div className="mt-1.5 shrink-0">
          {!item.readStatus && (
            <span className="block w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${item.readStatus ? "text-gray-400" : "text-gray-700"}`}>
            {item.message}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {formatDate(item.createdAt)}
          </p>
        </div>

        {/* Context menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen((p) => !p); }}
            className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>

          {open && (
            <div className="absolute right-0 top-6 z-50 w-44 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
              <button
                onClick={(e) => { onMarkRead(e, item.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                Mark as Read
              </button>
              <button
                onClick={(e) => { onDelete(e, item.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </NotificationStatusBorder>
  );
}