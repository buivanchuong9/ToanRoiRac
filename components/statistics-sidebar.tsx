"use client"

interface StatisticsSidebarProps {
  edgesSelected: number
  totalCost: number
  connectedComponents: number
  totalNodes: number
  totalEdges: number
  isRunning: boolean
}

export default function StatisticsSidebar({
  edgesSelected,
  totalCost,
  connectedComponents,
  totalNodes,
  totalEdges,
  isRunning,
}: StatisticsSidebarProps) {
  const progress = totalEdges > 0 ? (edgesSelected / (totalNodes - 1)) * 100 : 0

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-6">Thống Kê Thời Gian Thực</h3>

      <div className="space-y-6">
        {/* Edges Selected */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-300">Cạnh Được Chọn</label>
            <span className="text-2xl font-bold text-blue-400">{edgesSelected}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (edgesSelected / (totalNodes - 1)) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-1">{totalNodes - 1} cạnh cần thiết cho MST</p>
        </div>

        {/* Total Cost */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/30 rounded-lg p-4">
          <p className="text-xs font-semibold text-green-300 uppercase tracking-wide mb-1">Chi Phí MST</p>
          <p className="text-4xl font-bold text-green-400">{totalCost}</p>
          <p className="text-xs text-slate-400 mt-2">Tổng trọng số của cây khung nhỏ nhất</p>
        </div>

        {/* Connected Components */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-slate-300">Thành Phần Liên Thông</label>
            <span className="text-2xl font-bold text-cyan-400">{connectedComponents}</span>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400">
              {connectedComponents === 1
                ? "Tất cả đỉnh đã được kết nối"
                : `${connectedComponents} thành phần riêng biệt`}
            </p>
          </div>
        </div>

        {/* Graph Info */}
        <div className="border-t border-slate-700 pt-6">
          <h4 className="text-sm font-semibold text-white mb-4">Thông Tin Đồ Thị</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-slate-400">Tổng Đỉnh:</span>
              <span className="font-semibold text-slate-200">{totalNodes}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-slate-400">Tổng Cạnh:</span>
              <span className="font-semibold text-slate-200">{totalEdges}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-slate-400">Cạnh MST:</span>
              <span className="font-semibold text-slate-200">{totalNodes - 1}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-yellow-400 animate-pulse" : "bg-slate-500"}`}></div>
          <span className="text-sm text-slate-300">{isRunning ? "Đang chạy..." : "Sẵn sàng"}</span>
        </div>
      </div>
    </div>
  )
}
