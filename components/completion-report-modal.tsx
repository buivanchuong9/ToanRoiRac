"use client"

import { useEffect } from "react"

interface CompletionReportModalProps {
  isOpen: boolean
  onClose: () => void
  totalCost: number
  edgesSelected: number
  totalEdges: number
  totalNodes: number
  connectedComponents: number
  stepsCount: number
}

export default function CompletionReportModal({
  isOpen,
  onClose,
  totalCost,
  edgesSelected,
  totalEdges,
  totalNodes,
  connectedComponents,
  stepsCount,
}: CompletionReportModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Báo Cáo Kết Quả | Completion Report</h2>
              <p className="text-blue-100 text-sm mt-1">Thuật toán Kruskal đã hoàn thành thành công</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Result */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-lg p-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Chi Phí Cây Khung Nhỏ Nhất</p>
              <p className="text-5xl font-bold text-green-400">{totalCost}</p>
              <p className="text-slate-400 text-sm mt-2">Minimum Spanning Tree Cost</p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Edges Selected */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Cạnh Được Chọn</p>
              <p className="text-3xl font-bold text-blue-400">{edgesSelected}</p>
              <p className="text-slate-500 text-xs mt-1">Edges Selected</p>
            </div>

            {/* Total Edges */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Tổng Cạnh</p>
              <p className="text-3xl font-bold text-cyan-400">{totalEdges}</p>
              <p className="text-slate-500 text-xs mt-1">Total Edges</p>
            </div>

            {/* Total Nodes */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Tổng Đỉnh</p>
              <p className="text-3xl font-bold text-purple-400">{totalNodes}</p>
              <p className="text-slate-500 text-xs mt-1">Total Nodes</p>
            </div>

            {/* Connected Components */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Thành Phần Liên Thông</p>
              <p className="text-3xl font-bold text-orange-400">{connectedComponents}</p>
              <p className="text-slate-500 text-xs mt-1">Connected Components</p>
            </div>
          </div>

          {/* Algorithm Details */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Chi Tiết Thuật Toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tổng bước xử lý:</span>
                <span className="text-white font-semibold">{stepsCount} bước</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cạnh được chấp nhận:</span>
                <span className="text-green-400 font-semibold">{edgesSelected} cạnh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cạnh bị loại:</span>
                <span className="text-red-400 font-semibold">{totalEdges - edgesSelected} cạnh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tỷ lệ chấp nhận:</span>
                <span className="text-blue-400 font-semibold">{((edgesSelected / totalEdges) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="font-semibold text-blue-400">Kết luận:</span> Thuật toán Kruskal đã tìm được cây khung
              nhỏ nhất với <span className="font-bold text-green-400">{edgesSelected} cạnh</span> và chi phí tổng cộng
              là <span className="font-bold text-green-400">{totalCost}</span>. Đồ thị được chia thành{" "}
              <span className="font-bold text-orange-400">{connectedComponents}</span> thành phần liên thông.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/50 border-t border-slate-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
          >
            Đóng | Close
          </button>
        </div>
      </div>
    </div>
  )
}
