"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface Edge {
  source: string
  target: string
  weight: number
}

interface SortedEdgesViewerProps {
  edges: Edge[]
  currentEdgeIndex?: number
  selectedEdgesIndices?: Set<number>
  rejectedEdgesIndices?: Set<number>
}

export default function SortedEdgesViewer({
  edges,
  currentEdgeIndex,
  selectedEdgesIndices = new Set(),
  rejectedEdgesIndices = new Set(),
}: SortedEdgesViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div
        className="p-4 cursor-pointer hover:bg-slate-700/20 transition-colors flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-white">Danh Sách Cạnh Sắp Xếp | Sorted Edges</h3>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-slate-700">
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {sortedEdges.length === 0 ? (
              <p className="text-slate-400 text-sm">Chưa có cạnh nào | No edges yet</p>
            ) : (
              sortedEdges.map((edge, idx) => {
                const isSelected = selectedEdgesIndices.has(idx)
                const isRejected = rejectedEdgesIndices.has(idx)
                const isCurrent = currentEdgeIndex === idx

                let bgColor = "bg-slate-900/30"
                let borderColor = "border-slate-600"
                let statusLabel = ""

                if (isCurrent) {
                  bgColor = "bg-yellow-400/20"
                  borderColor = "border-yellow-500"
                  statusLabel = "🔍"
                } else if (isSelected) {
                  bgColor = "bg-green-400/20"
                  borderColor = "border-green-500"
                  statusLabel = "✅"
                } else if (isRejected) {
                  bgColor = "bg-red-400/20"
                  borderColor = "border-red-500"
                  statusLabel = "❌"
                }

                return (
                  <div
                    key={`${edge.source}-${edge.target}-${edge.weight}`}
                    className={`p-3 rounded-lg border ${bgColor} ${borderColor} transition-all duration-200 ${
                      isCurrent ? "ring-2 ring-yellow-400/50 scale-105" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">{statusLabel}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-blue-500/30 border border-blue-500/50 rounded text-blue-200 font-mono font-semibold flex-shrink-0">
                              {edge.source}
                            </span>
                            <span className="text-slate-400 flex-shrink-0">→</span>
                            <span className="px-2 py-1 bg-cyan-500/30 border border-cyan-500/50 rounded text-cyan-200 font-mono font-semibold flex-shrink-0">
                              {edge.target}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-mono font-bold text-lg">
                          {isSelected && <span className="text-green-400">{edge.weight}</span>}
                          {!isSelected && isCurrent && <span className="text-yellow-400">{edge.weight}</span>}
                          {!isSelected && !isCurrent && isRejected && <span className="text-red-400">{edge.weight}</span>}
                          {!isSelected && !isCurrent && !isRejected && (
                            <span className="text-slate-400">{edge.weight}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">trọng số</p>
                      </div>
                    </div>

                    {/* Edge status label */}
                    {(isSelected || isRejected || isCurrent) && (
                      <div className="mt-2 text-xs">
                        {isCurrent && <p className="text-yellow-400">Đang kiểm tra | Examining</p>}
                        {isSelected && !isCurrent && <p className="text-green-400">Được thêm vào MST | Added to MST</p>}
                        {isRejected && <p className="text-red-400">Tạo chu trình | Creates cycle</p>}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Statistics */}
          <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-slate-400">Tổng Cạnh | Total</p>
              <p className="text-lg font-bold text-slate-300">{sortedEdges.length}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Được Chọn | Selected</p>
              <p className="text-lg font-bold text-green-400">{selectedEdgesIndices.size}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Bị Loại | Rejected</p>
              <p className="text-lg font-bold text-red-400">{rejectedEdgesIndices.size}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
