"use client"

import { useMemo } from "react"

interface TeacherGuideProps {
  totalNodes: number
  totalEdges: number
  mstEdges: number
  rejectedEdges: number
  totalCost: number
  isRunning: boolean
}

export default function TeacherGuide({
  totalNodes,
  totalEdges,
  mstEdges,
  rejectedEdges,
  totalCost,
  isRunning,
}: TeacherGuideProps) {
  const progress = useMemo(() => {
    const expected = totalNodes > 0 ? totalNodes - 1 : 0
    return expected > 0 ? (mstEdges / expected) * 100 : 0
  }, [totalNodes, mstEdges])

  const status = useMemo(() => {
    const expected = totalNodes > 0 ? totalNodes - 1 : 0
    if (mstEdges === expected && mstEdges > 0) return "complete"
    if (mstEdges > 0) return "inprogress"
    return "notstarted"
  }, [totalNodes, mstEdges])

  return (
    <div className="bg-linear-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/40 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">🎓</span>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-linear-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Hướng Dẫn Học Tập
          </h3>
          <p className="text-xs text-slate-400">Hiểu rõ - Học nhanh - Ứng dụng tốt</p>
        </div>
      </div>

      {/* Status Card */}
      <div
        className={`rounded-xl p-5 mb-5 border-2 transition-all duration-300 ${
          status === "complete"
            ? "bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/20"
            : status === "inprogress"
            ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20"
            : "bg-slate-500/10 border-slate-500/50"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-white">
            {status === "complete" ? "✅ Hoàn Thành!" : status === "inprogress" ? "⏳ Đang Chạy..." : "🎯 Sẵn Sàng"}
          </span>
          <span
            className={`text-3xl font-bold ${
              status === "complete" ? "text-green-400" : status === "inprogress" ? "text-blue-400" : "text-slate-400"
            }`}
          >
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              status === "complete"
                ? "bg-linear-to-r from-green-500 to-emerald-500"
                : "bg-linear-to-r from-blue-500 to-cyan-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {mstEdges} / {totalNodes > 0 ? totalNodes - 1 : 0} cạnh đã chọn cho cây khung
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🟢</span>
            <span className="text-xs text-slate-400 uppercase">Được Chọn</span>
          </div>
          <p className="text-3xl font-bold text-green-400">{mstEdges}</p>
          <p className="text-xs text-slate-500 mt-1">cạnh trong MST</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔴</span>
            <span className="text-xs text-slate-400 uppercase">Bị Loại</span>
          </div>
          <p className="text-3xl font-bold text-red-400">{rejectedEdges}</p>
          <p className="text-xs text-slate-500 mt-1">cạnh tạo chu trình</p>
        </div>
      </div>

      {/* Explanation Panels */}
      <div className="space-y-3">
        {/* What is MST */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
            <span>📚</span>
            Cây Khung Nhỏ Nhất (MST) là gì?
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            Là cây con của đồ thị có:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Kết nối TẤT CẢ các đỉnh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>KHÔNG CÓ chu trình (vòng lặp)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Tổng trọng số NHỎ NHẤT có thể</span>
            </li>
          </ul>
        </div>

        {/* How Kruskal Works */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
            <span>⚙️</span>
            Các Bước Thuật Toán Kruskal
          </h4>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="font-bold text-purple-400 min-w-[24px]">1.</span>
              <span><strong>Sắp xếp</strong> các cạnh tăng dần theo trọng số</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-purple-400 min-w-[24px]">2.</span>
              <span>Khởi tạo rừng (mỗi đỉnh là 1 cây riêng)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-purple-400 min-w-[24px]">3.</span>
              <span><strong className="text-green-400">Chọn cạnh nhỏ nhất</strong> chưa xét</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-purple-400 min-w-[24px]">4.</span>
              <span>Kiểm tra: Nếu <strong className="text-red-400">TẠO CHU TRÌNH</strong> → Loại bỏ</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-purple-400 min-w-[24px]">5.</span>
              <span>Lặp lại đến khi có đủ <strong>{totalNodes > 0 ? totalNodes - 1 : 0} cạnh</strong></span>
            </div>
          </div>
        </div>

        {/* Current Result */}
        {totalCost > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4">
            <h4 className="font-bold text-amber-300 mb-3 flex items-center gap-2">
              <span>💰</span>
              Kết Quả Hiện Tại
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Tổng Chi Phí MST:</p>
                <p className="text-2xl font-bold text-amber-400">{totalCost}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Số Cạnh Đã Chọn:</p>
                <p className="text-2xl font-bold text-green-400">{mstEdges}</p>
              </div>
            </div>
          </div>
        )}

        {/* Learning Tips */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
            <span>💡</span>
            Gợi Ý Học Tập
          </h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">▸</span>
              <span>Bắt đầu với <strong>"✨ Demo"</strong> (9 cạnh) để hiểu cơ bản</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">▸</span>
              <span>Chạy <strong>CHẬM</strong> lần đầu để quan sát kỹ từng bước</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">▸</span>
              <span>Chú ý cạnh <strong className="text-red-400">ĐỎ</strong> có chữ <strong>"⚠️ TẠO CHU TRÌNH"</strong> - đó là lý do bị loại</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">▸</span>
              <span>Thử <strong>"📊 Chủ Đề 7"</strong> (100 cạnh) sau khi đã hiểu</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">▸</span>
              <span>Tự tạo đồ thị riêng để kiểm tra hiểu biết</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
