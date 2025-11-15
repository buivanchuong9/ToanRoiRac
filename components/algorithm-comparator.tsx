"use client"

import { useMemo } from "react"

interface AlgorithmComparatorProps {
  totalNodes: number
  totalEdges: number
  mstEdges: number
  isRunning: boolean
}

export default function AlgorithmComparator({ totalNodes, totalEdges, mstEdges, isRunning }: AlgorithmComparatorProps) {
  const complexityData = useMemo(() => {
    const V = totalNodes
    const E = totalEdges
    
    // Tính toán các độ phức tạp
    const kruskalSort = E > 0 ? E * Math.log2(E) : 0
    const kruskalUnion = E * Math.log2(V > 0 ? V : 1)
    const kruskalTotal = kruskalSort + kruskalUnion
    
    const primDense = V * V
    const primHeap = (E + V) * Math.log2(V > 0 ? V : 1)
    
    const dijkstra = (E + V) * Math.log2(V > 0 ? V : 1)
    
    // So sánh hiệu suất
    const bestChoice = E < V * V / Math.log2(V > 1 ? V : 2) ? "Kruskal" : "Prim (Dense)"
    
    return {
      kruskal: {
        sort: kruskalSort,
        union: kruskalUnion,
        total: kruskalTotal,
        formula: "O(E log E + E α(V)) ≈ O(E log E)",
      },
      prim: {
        dense: primDense,
        heap: primHeap,
        formula: "O(V²) dense / O((E+V) log V) heap",
      },
      dijkstra: {
        total: dijkstra,
        formula: "O((E+V) log V)",
      },
      bestChoice,
      graphDensity: V > 0 ? (E / (V * (V - 1) / 2)) * 100 : 0,
    }
  }, [totalNodes, totalEdges])

  const getComplexityColor = (value: number, max: number) => {
    const ratio = value / max
    if (ratio < 0.3) return "text-green-400"
    if (ratio < 0.7) return "text-yellow-400"
    return "text-red-400"
  }

  const maxComplexity = Math.max(
    complexityData.kruskal.total,
    complexityData.prim.dense,
    complexityData.prim.heap,
    complexityData.dijkstra.total
  )

  return (
    <div className="bg-linear-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">⚡</span>
        </div>
        <h3 className="text-lg font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          So Sánh Độ Phức Tạp Thuật Toán
        </h3>
      </div>

      <div className="space-y-4">
        {/* Graph Info */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Số Đỉnh (V)</p>
            <p className="text-purple-400 font-bold text-xl">{totalNodes}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Số Cạnh (E)</p>
            <p className="text-pink-400 font-bold text-xl">{totalEdges}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs">Mật Độ</p>
            <p className="text-cyan-400 font-bold text-xl">{complexityData.graphDensity.toFixed(1)}%</p>
          </div>
        </div>

        {/* Kruskal Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-green-400 flex items-center gap-2">
              <span className="text-lg">🏆</span>
              Kruskal (Đang Dùng)
            </h4>
            <span className="text-xs text-slate-400">{complexityData.kruskal.formula}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Sắp xếp cạnh:</span>
              <span className={getComplexityColor(complexityData.kruskal.sort, maxComplexity)}>
                {complexityData.kruskal.sort.toFixed(0)} phép toán
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Union-Find:</span>
              <span className={getComplexityColor(complexityData.kruskal.union, maxComplexity)}>
                {complexityData.kruskal.union.toFixed(0)} phép toán
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${(complexityData.kruskal.total / maxComplexity) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-white">Tổng:</span>
              <span className="text-green-400">{complexityData.kruskal.total.toFixed(0)} phép toán</span>
            </div>
          </div>
        </div>

        {/* Prim Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-blue-400">Thuật Toán Prim</h4>
            <span className="text-xs text-slate-400">{complexityData.prim.formula}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Đồ thị dày (Mảng):</span>
              <span className={getComplexityColor(complexityData.prim.dense, maxComplexity)}>
                {complexityData.prim.dense.toFixed(0)} phép toán
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(complexityData.prim.dense / maxComplexity) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Đồ thị thưa (Heap):</span>
              <span className={getComplexityColor(complexityData.prim.heap, maxComplexity)}>
                {complexityData.prim.heap.toFixed(0)} phép toán
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(complexityData.prim.heap / maxComplexity) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dijkstra Comparison */}
        <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-yellow-400">Dijkstra (Tham Khảo)</h4>
            <span className="text-xs text-slate-400">{complexityData.dijkstra.formula}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Đường đi ngắn nhất 1 nguồn:</span>
              <span className={getComplexityColor(complexityData.dijkstra.total, maxComplexity)}>
                {complexityData.dijkstra.total.toFixed(0)} phép toán
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                style={{ width: `${(complexityData.dijkstra.total / maxComplexity) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Best Choice Recommendation */}
        <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-bold text-white mb-1">Gợi Ý Thông Minh</h4>
              <p className="text-slate-300 text-sm">
                Cho đồ thị này (V={totalNodes}, E={totalEdges}), thuật toán tối ưu nhất là{" "}
                <span className="font-bold text-purple-400">{complexityData.bestChoice}</span>
              </p>
              {complexityData.graphDensity < 50 ? (
                <p className="text-xs text-slate-400 mt-2">
                  📊 Đồ thị thưa ({complexityData.graphDensity.toFixed(1)}% mật độ) → Kruskal/Prim-Heap là tối ưu
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-2">
                  📊 Đồ thị dày đặc ({complexityData.graphDensity.toFixed(1)}% mật độ) → Prim-Mảng có thể nhanh hơn
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Why Kruskal? */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-green-500/20">
          <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
            <span>✨</span>
            Tại sao chọn Kruskal?
          </h4>
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">▸</span>
              <span>Edge-based: dễ implement với Disjoint Set Union</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">▸</span>
              <span>Tối ưu cho đồ thị thưa (sparse graph)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">▸</span>
              <span>Parallel-friendly: có thể sort song song</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">▸</span>
              <span>Trực quan: xét cạnh từ nhỏ đến lớn</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
