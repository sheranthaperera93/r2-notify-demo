// src/components/notifications/NotificationStatusBorder.tsx
const STATUS_BORDER_MAP: Record<string, string> = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

export default function NotificationStatusBorder({
  status,
  children,
  className = "",
}: {
  status: string;
  children: React.ReactNode;
  className?: string;
}) {
  const borderColor = STATUS_BORDER_MAP[status] ?? "border-l-gray-300 dark:border-l-white/20";
  return (
    <div className={`border-l-2 pl-3 ${borderColor} ${className}`}>
      {children}
    </div>
  );
}
