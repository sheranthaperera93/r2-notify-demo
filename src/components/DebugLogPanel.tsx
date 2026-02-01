import { useEffect, useRef, useState } from "react";

export default function DebugLogPanel() {
  const [logs, setLogs] = useState<
    { id: number; level: string; message: string; timestamp: string }[]
  >([]);
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
            if (typeof m === "string") {
              return m;
            } else if (typeof m === "object" && m !== null) {
              return JSON.stringify(m, null, 2); // Pretty print objects
            } else {
              return String(m);
            }
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

  const getLevelStyles = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800 border-red-300";
      case "warn":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "debug":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return "✕";
      case "warn":
        return "⚠";
      case "info":
        return "ℹ";
      case "debug":
        return "⚙";
      default:
        return "○";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5m2-2h14M5 10l0 7m7-7l0 7m7-7H5M4 17v2a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Debug Console</h2>
        </div>
        <button
          onClick={() => setLogs([])}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        ref={scrollRef}
        className="bg-gray-950 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No logs yet...</div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <span className="text-gray-500 text-xs shrink-0 pt-0.5">
                  {log.timestamp}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 border ${getLevelStyles(log.level)}`}
                >
                  {getLevelIcon(log.level)} {log.level.toUpperCase()}
                </span>
                <pre className="text-gray-100 whitespace-pre-wrap break-words flex-1 leading-relaxed">
                  {log.message}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
