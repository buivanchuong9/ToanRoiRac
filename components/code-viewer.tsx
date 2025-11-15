"use client"

import { useMemo } from "react"

interface CodeViewerProps {
  currentStep: number
  totalSteps: number
  currentEdge?: { source: string; target: string; weight: number }
  currentStatus?: "selected" | "rejected"
}

export default function CodeViewer({ currentStep, totalSteps, currentEdge, currentStatus }: CodeViewerProps) {
  const codeLines = [
    { line: 1, code: "def kruskal(edges, nodes):", highlight: false, section: "init" },
    { line: 2, code: "    # Sắp xếp edges theo trọng số", highlight: false, section: "sort" },
    { line: 3, code: "    sorted_edges = sort(edges, key=weight)", highlight: currentStep === 0, section: "sort" },
    { line: 4, code: "", highlight: false, section: "sort" },
    { line: 5, code: "    # Khởi tạo Union-Find", highlight: false, section: "init" },
    { line: 6, code: "    uf = UnionFind(nodes)", highlight: currentStep === 0, section: "init" },
    { line: 7, code: "    mst = []", highlight: false, section: "init" },
    { line: 8, code: "", highlight: false, section: "init" },
    { line: 9, code: "    for edge in sorted_edges:", highlight: currentStep > 0, section: "loop" },
    { line: 10, code: "        u, v, w = edge", highlight: currentStep > 0, section: "loop" },
    { line: 11, code: "", highlight: false, section: "loop" },
    { line: 12, code: "        # Kiểm tra chu trình", highlight: false, section: "check" },
    { line: 13, code: "        if uf.find(u) != uf.find(v):", highlight: currentStatus === "selected", section: "check" },
    { line: 14, code: "            uf.union(u, v)  # Hợp nhất", highlight: currentStatus === "selected", section: "union" },
    { line: 15, code: "            mst.append(edge)  # Chấp nhận", highlight: currentStatus === "selected", section: "accept" },
    { line: 16, code: "        else:", highlight: currentStatus === "rejected", section: "reject" },
    { line: 17, code: "            # Tạo chu trình - bỏ qua", highlight: currentStatus === "rejected", section: "reject" },
    { line: 18, code: "            pass", highlight: currentStatus === "rejected", section: "reject" },
    { line: 19, code: "", highlight: false, section: "end" },
    { line: 20, code: "    return mst", highlight: currentStep === totalSteps, section: "end" },
  ]

  const getCurrentSection = useMemo(() => {
    if (currentStep === 0) return "Khởi Tạo & Sắp Xếp"
    if (currentStatus === "selected") return "Chấp Nhận Cạnh (Không Tạo Chu Trình)"
    if (currentStatus === "rejected") return "Loại Bỏ Cạnh (Tạo Chu Trình)"
    if (currentStep === totalSteps) return "Hoàn Thành - Trả Về MST"
    return "Đang Xử Lý Các Cạnh"
  }, [currentStep, currentStatus, totalSteps])

  return (
    <div className="bg-linear-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{"</>"}</span>
        </div>
        <h3 className="text-lg font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Thực Thi Code Trực Tiếp
        </h3>
      </div>

      {/* Current Section Indicator */}
      <div className="mb-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-xs text-slate-400 uppercase tracking-wide">Phần Hiện Tại:</span>
          <span className="text-indigo-300 font-bold">{getCurrentSection}</span>
        </div>
        {currentEdge && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-slate-400">Đang Xử Lý:</span>
            <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">
              {currentEdge.source} → {currentEdge.target} (w: {currentEdge.weight})
            </span>
            {currentStatus && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  currentStatus === "selected" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {currentStatus === "selected" ? "✓ ACCEPTED" : "✗ REJECTED"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Code Display */}
      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700/30 font-mono text-sm overflow-x-auto">
        <div className="space-y-0.5">
          {codeLines.map((item) => (
            <div
              key={item.line}
              className={`flex items-center gap-3 px-2 py-1 rounded transition-all duration-300 ${
                item.highlight
                  ? "bg-indigo-500/20 border-l-4 border-indigo-400 shadow-lg shadow-indigo-500/20"
                  : "hover:bg-slate-800/30"
              }`}
            >
              <span className={`text-xs w-8 text-right ${item.highlight ? "text-indigo-400 font-bold" : "text-slate-600"}`}>
                {item.line}
              </span>
              <span
                className={`flex-1 ${
                  item.highlight
                    ? "text-white font-semibold"
                    : item.code.includes("#")
                    ? "text-slate-500 italic"
                    : item.code.includes("def ") || item.code.includes("for ") || item.code.includes("if ") || item.code.includes("else")
                    ? "text-purple-400"
                    : item.code.includes("return")
                    ? "text-pink-400"
                    : "text-slate-300"
                }`}
              >
                {item.code || "\u00A0"}
              </span>
              {item.highlight && (
                <span className="text-indigo-400 text-xs animate-pulse">◀ Executing</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Execution Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Step Progress</p>
          <p className="text-white font-bold">
            {currentStep} / {totalSteps}
          </p>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Completion</p>
          <p className="text-white font-bold">{totalSteps > 0 ? ((currentStep / totalSteps) * 100).toFixed(1) : 0}%</p>
          <div className="mt-2 flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < (currentStep / totalSteps) * 10 ? "bg-purple-500" : "bg-slate-700"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-4 bg-slate-800/30 border border-slate-700/30 rounded-lg p-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">💡 How It Works</h4>
        <ul className="space-y-1 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-purple-400">1.</span>
            <span>Sort tất cả edges theo trọng số tăng dần</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">2.</span>
            <span>Duyệt từng edge, check xem 2 đỉnh có cùng component không (dùng find)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">3.</span>
            <span>Nếu khác component → union và thêm vào MST</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">4.</span>
            <span>Nếu cùng component → bỏ qua (tạo chu trình)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
