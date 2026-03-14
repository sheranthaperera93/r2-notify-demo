import { useEffect, useRef, useState } from "react";
import {
  CommandLineIcon,
  TrashIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

interface LogEntry {
  id: number;
  level: string;
  message: string;
  timestamp: string;
}

export default function DebugLogPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logHandler = (message: any[], level: string) => {
      if (
        message.some(
          (m) =>
            m.toString().includes("[r2 client]") ||
            m.toString().includes("[r2-react]"),
        )
      ) {
        const id = new Date().getTime();
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;

        // Format the message properly - serialize objects and concatenate strings
        const formattedMessage = message
          .map((m) => {
            if (typeof m === "string") return m;
            else if (typeof m === "object" && m !== null)
              return JSON.stringify(m, null, 2);
            else return String(m);
          })
          .join(" ");

        setLogs((prevLogs) => [
          ...prevLogs,
          { id, level, message: formattedMessage, timestamp },
        ]);
      }
    };

    const oldConsole = console;
    console = {
      ...oldConsole,
      debug: (...args: any[]) => logHandler(args, "debug"),
      log: (...args: any[]) => logHandler(args, "log"),
      info: (...args: any[]) => logHandler(args, "info"),
      warn: (...args: any[]) => logHandler(args, "warn"),
      error: (...args: any[]) => logHandler(args, "error"),
    };

    return () => {
      console = oldConsole;
    };
  }, []);

  // Auto-scroll when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const levelConfig: Record<
    string,
    { icon: React.ElementType; badge: string; text: string; row: string }
  > = {
    error: {
      icon: XCircleIcon,
      badge: "bg-red-50 text-red-600 ring-red-200",
      text: "text-red-400",
      row: "bg-red-950/20",
    },
    warn: {
      icon: ExclamationTriangleIcon,
      badge: "bg-amber-50 text-amber-600 ring-amber-200",
      text: "text-amber-400",
      row: "bg-amber-950/10",
    },
    info: {
      icon: InformationCircleIcon,
      badge: "bg-blue-50 text-blue-600 ring-blue-200",
      text: "text-blue-400",
      row: "",
    },
    debug: {
      icon: WrenchScrewdriverIcon,
      badge: "bg-violet-50 text-violet-600 ring-violet-200",
      text: "text-violet-400",
      row: "",
    },
    log: {
      icon: CircleStackIcon,
      badge: "bg-gray-100 text-gray-500 ring-gray-200",
      text: "text-gray-500",
      row: "",
    },
  };

  const getConfig = (level: string) => levelConfig[level] ?? levelConfig["log"];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-900 ring-1 ring-gray-700">
            <CommandLineIcon className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <span className="text-sm font-semibold text-gray-800 tracking-tight">
            Debug Console
          </span>
          {logs.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 ring-1 ring-gray-200">
              {logs.length}
            </span>
          )}
        </div>

        <button
          onClick={() => setLogs([])}
          disabled={logs.length === 0}
          title="Clear logs"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Log output */}
      <div
        ref={scrollRef}
        className="bg-gray-950 h-96 overflow-y-auto font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <CommandLineIcon className="w-8 h-8 text-gray-700" />
            <span className="text-gray-600">No logs yet…</span>
          </div>
        ) : (
          <div className="divide-y divide-white/4">
            {logs.map((log) => {
              const config = getConfig(log.level);
              const Icon = config.icon;
              return (
                <div
                  key={log.id}
                  className={`flex gap-3 items-start px-4 py-2.5 ${config.row}`}
                >
                  {/* Timestamp */}
                  <span className="text-gray-600 shrink-0 pt-px tabular-nums">
                    {log.timestamp}
                  </span>

                  {/* Level badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ring-1 shrink-0 font-semibold uppercase tracking-wide text-[10px] ${config.badge}`}
                  >
                    <Icon className="w-3 h-3" />
                    {log.level}
                  </span>

                  {/* Message */}
                  <pre
                    className={`whitespace-pre-wrap break-words flex-1 leading-relaxed ${config.text || "text-gray-300"}`}
                  >
                    {log.message}
                  </pre>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
