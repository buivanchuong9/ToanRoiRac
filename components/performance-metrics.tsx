"use client"

import { Card } from "@/components/ui/card"

interface PerformanceMetricsProps {
  totalNodes: number
  totalEdges: number
  mstEdges: number
  rejectedEdges: number
  executionTime?: number
}

export default function PerformanceMetrics({
  totalNodes,
  totalEdges,
  mstEdges,
  rejectedEdges,
  executionTime = 0
}: PerformanceMetricsProps) {
  // Tính complexity
  const sortingComplexity = `O(E log E) = O(${totalEdges} × log ${totalEdges}) ≈ ${Math.round(totalEdges * Math.log2(totalEdges))}`
  const unionFindComplexity = `O(E × α(V)) ≈ O(${totalEdges})`
  const totalComplexity = `O(E log E + E × α(V))`

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">📊 Performance Metrics</h3>
      
      <div className="space-y-4">
        {/* Graph Info */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Thông Tin Đồ Thị</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-400">Đỉnh (V):</span>
              <span className="ml-2 text-blue-400 font-bold">{totalNodes}</span>
            </div>
            <div>
              <span className="text-slate-400">Cạnh (E):</span>
              <span className="ml-2 text-cyan-400 font-bold">{totalEdges}</span>
            </div>
            <div>
              <span className="text-slate-400">MST:</span>
              <span className="ml-2 text-green-400 font-bold">{mstEdges} cạnh</span>
            </div>
            <div>
              <span className="text-slate-400">Rejected:</span>
              <span className="ml-2 text-red-400 font-bold">{rejectedEdges} cạnh</span>
            </div>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Độ Phức Tạp</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Sắp xếp edges:</span>
              <code className="text-orange-400 bg-slate-800 px-2 py-1 rounded text-xs">
                {sortingComplexity}
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Union-Find:</span>
              <code className="text-orange-400 bg-slate-800 px-2 py-1 rounded text-xs">
                {unionFindComplexity}
              </code>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-200 font-semibold">Tổng:</span>
                <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded text-xs font-bold">
                  {totalComplexity}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Execution Time */}
        {executionTime > 0 && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-green-300 font-semibold">⏱️ Thời gian thực thi:</span>
              <span className="text-green-400 text-lg font-bold">{executionTime.toFixed(2)}ms</span>
            </div>
          </div>
        )}

        {/* Efficiency Score */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Hiệu Quả</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Tỷ lệ MST:</span>
              <span className="text-blue-400 font-bold">
                {totalEdges > 0 ? ((mstEdges / totalEdges) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalEdges > 0 ? (mstEdges / totalEdges) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Algorithm Advantages */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-300 text-xs font-semibold mb-2">💡 Ưu Điểm Kruskal:</p>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>✓ Tối ưu cho đồ thị thưa (sparse graph)</li>
            <li>✓ Dễ hiểu và cài đặt</li>
            <li>✓ Hiệu quả với Union-Find</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
