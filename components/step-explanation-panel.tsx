"use client"

interface StepExplanationPanelProps {
  currentStep: number
  totalSteps: number
  currentEdge?: { source: string; target: string; weight: number }
  currentStatus?: "examining" | "selected" | "rejected"
  totalCost: number
  edgesSelected: number
  connectedComponents: number
}

export default function StepExplanationPanel({
  currentStep,
  totalSteps,
  currentEdge,
  currentStatus,
  totalCost,
  edgesSelected,
  connectedComponents,
}: StepExplanationPanelProps) {
  const getStatusText = () => {
    switch (currentStatus) {
      case "examining":
        return "Đang xét"
      case "selected":
        return "Được chọn ✅"
      case "rejected":
        return "Bị loại ❌"
      default:
        return ""
    }
  }

  const getStatusColor = () => {
    switch (currentStatus) {
      case "examining":
        return "text-yellow-400"
      case "selected":
        return "text-green-400"
      case "rejected":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Giải Thích Từng Bước</h3>

      {totalSteps === 0 ? (
        <div className="text-slate-400 text-sm">Tải file để bắt đầu mô phỏng</div>
      ) : (
        <div className="space-y-4">
          {/* Current Step Info */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Bước hiện tại</p>
                <p className="text-2xl font-bold text-blue-400">
                  {currentStep + 1} <span className="text-slate-400 text-lg">/ {totalSteps}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Tiến độ</p>
                <p className="text-lg font-semibold text-slate-300">
                  {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Edge Info */}
          {currentEdge && (
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Cạnh đang xét</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-300 font-semibold text-sm">
                    {currentEdge.source}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-300 font-semibold text-sm">
                    {currentEdge.target}
                  </span>
                </div>
                <span className="px-3 py-1 bg-slate-700 rounded text-slate-200 font-semibold text-sm">
                  Trọng số: {currentEdge.weight}
                </span>
              </div>

              {currentStatus && <div className={`text-sm font-semibold ${getStatusColor()}`}>{getStatusText()}</div>}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Chi phí MST</p>
              <p className="text-2xl font-bold text-green-400">{totalCost}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Cạnh chọn</p>
              <p className="text-2xl font-bold text-blue-400">{edgesSelected}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Thành phần</p>
              <p className="text-2xl font-bold text-cyan-400">{connectedComponents}</p>
            </div>
          </div>

          {/* Algorithm Explanation */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Giải thích Chi Tiết | Detailed Explanation</p>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {currentStatus === "examining" && currentEdge &&
                `🔍 Đang kiểm tra cạnh ${currentEdge.source} → ${currentEdge.target} (trọng số: ${currentEdge.weight}). Hệ thống sử dụng Union-Find để kiểm tra xem hai đỉnh đã được kết nối chưa.`}
              {currentStatus === "selected" && currentEdge &&
                `✅ Cạnh ${currentEdge.source} → ${currentEdge.target} được thêm vào MST! Chi phí tăng thêm ${currentEdge.weight}. Hai thành phần liên thông được ghép lại.`}
              {currentStatus === "rejected" && currentEdge &&
                `❌ Cạnh ${currentEdge.source} → ${currentEdge.target} bị loại vì nó tạo chu trình. Hai đỉnh đã được kết nối qua các cạnh khác.`}
              {!currentStatus && "Nhấn 'Chạy Kruskal' để bắt đầu mô phỏng. Thuật toán sẽ xét các cạnh theo thứ tự trọng số tăng dần."}
            </p>
            
            {/* Algorithm Notes */}
            <div className="bg-slate-800/50 rounded p-3 border border-slate-600 text-xs text-slate-300">
              <p className="font-semibold mb-2 text-slate-200">💡 Thuật Toán Kruskal:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Sắp xếp cạnh theo trọng số tăng dần</li>
                <li>Duyệt từng cạnh, thêm vào MST nếu không tạo chu trình</li>
                <li>Dùng Union-Find kiểm tra chu trình</li>
                <li>Kết thúc khi có n-1 cạnh (n = số đỉnh)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
