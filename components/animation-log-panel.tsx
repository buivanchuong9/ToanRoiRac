"use client"

import { useEffect, useRef } from "react"

interface LogEntry {
  id: string
  timestamp: number
  message: string
  type: "examining" | "selected" | "rejected" | "info"
}

interface AnimationLogPanelProps {
  logs: LogEntry[]
  isRunning: boolean
}

export default function AnimationLogPanel({ logs, isRunning }: AnimationLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLogColor = (type: string) => {
    switch (type) {
      case "examining":
        return "text-yellow-300 bg-yellow-400/10"
      case "selected":
        return "text-green-300 bg-green-400/10"
      case "rejected":
        return "text-red-300 bg-red-400/10"
      case "info":
        return "text-cyan-300 bg-cyan-400/10"
      default:
        return "text-slate-400 bg-slate-400/10"
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case "examining":
        return "🔍"
      case "selected":
        return "✅"
      case "rejected":
        return "❌"
      case "info":
        return "🎉"
      default:
        return "📝"
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 backdrop-blur-sm h-64 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-green-400 font-mono">$ kruskal_log</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-slate-600"}`}></div>
          <span className="text-xs text-slate-400">{logs.length} sự kiện | events</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-xs space-y-1 pr-2"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {logs.length === 0 ? (
          <div className="text-slate-500">
            <div className="text-green-400">$ kruskal --start</div>
            <div className="text-slate-500">Chờ đầu vào... | Waiting for input...</div>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 p-2 rounded hover:bg-slate-800/50 transition-colors">
              <span className="text-slate-600 flex-shrink-0">{String(log.timestamp).padStart(3, "0")}:</span>
              <span className="text-lg">{getLogIcon(log.type)}</span>
              <span className={`flex-1 ${getLogColor(log.type)} px-2 py-1 rounded font-semibold text-xs`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-700">
        Tự động cuộn | Auto-scroll enabled • {logs.length} tổng sự kiện | total events
      </div>
    </div>
  )
}
