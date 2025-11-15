"use client"

import { useMemo } from "react"

interface GraphTheoryInspectorProps {
  totalNodes: number
  totalEdges: number
  connectedComponents: number
  mstEdges: number
  currentEdge?: { source: string; target: string; weight: number }
  currentStatus?: "selected" | "rejected"
}

export default function GraphTheoryInspector({
  totalNodes,
  totalEdges,
  connectedComponents,
  mstEdges,
  currentEdge,
  currentStatus,
}: GraphTheoryInspectorProps) {
  const graphProperties = useMemo(() => {
    const V = totalNodes
    const E = totalEdges
    
    // Số cạnh tối đa trong đồ thị vô hướng
    const maxEdges = V > 1 ? (V * (V - 1)) / 2 : 0
    const density = maxEdges > 0 ? (E / maxEdges) * 100 : 0
    
    // Số cạnh trong cây khung (MST)
    const expectedMSTEdges = V > 0 ? V - 1 : 0
    const mstProgress = expectedMSTEdges > 0 ? (mstEdges / expectedMSTEdges) * 100 : 0
    
    // Phân loại đồ thị
    const graphType = density < 20 ? "Sparse (Thưa)" : density < 60 ? "Medium (Trung bình)" : "Dense (Dày đặc)"
    
    // Kiểm tra tính liên thông
    const isConnected = connectedComponents === 1
    const canFormMST = isConnected && E >= V - 1
    
    // Chu trình
    const hasCycle = E > V - 1
    const minCycles = E - (V - 1)
    
    return {
      maxEdges,
      density,
      expectedMSTEdges,
      mstProgress,
      graphType,
      isConnected,
      canFormMST,
      hasCycle,
      minCycles,
    }
  }, [totalNodes, totalEdges, connectedComponents, mstEdges])

  const cycleDetectionStatus = useMemo(() => {
    if (!currentEdge || !currentStatus) return null
    
    if (currentStatus === "rejected") {
      return {
        detected: true,
        message: `Edge ${currentEdge.source}→${currentEdge.target} TẠO CHU TRÌNH`,
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/50",
        icon: "🔴",
      }
    } else {
      return {
        detected: false,
        message: `Edge ${currentEdge.source}→${currentEdge.target} an toàn (không tạo chu trình)`,
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/50",
        icon: "🟢",
      }
    }
  }, [currentEdge, currentStatus])

  return (
    <div className="bg-linear-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">🔬</span>
        </div>
        <h3 className="text-lg font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Phân Tích Lý Thuyết Đồ Thị
        </h3>
      </div>

      <div className="space-y-4">
        {/* Cycle Detection Live */}
        {cycleDetectionStatus && (
          <div className={`${cycleDetectionStatus.bgColor} border ${cycleDetectionStatus.borderColor} rounded-lg p-4 animate-pulse`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{cycleDetectionStatus.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">Phát Hiện Chu Trình</h4>
                <p className={`text-sm ${cycleDetectionStatus.color} font-semibold`}>
                  {cycleDetectionStatus.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Graph Classification */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <span>📊</span>
            Phân Loại Đồ Thị
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Loại:</span>
              <span className="font-bold text-white bg-cyan-500/20 px-2 py-1 rounded">
                {graphProperties.graphType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Mật độ:</span>
              <span className="text-cyan-400 font-bold">{graphProperties.density.toFixed(2)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${graphProperties.density}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-400">
              {totalEdges} / {graphProperties.maxEdges} possible edges
            </div>
          </div>
        </div>

        {/* Connectivity Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
            <span>🔗</span>
            Phân Tích Kết Nối
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Các Thành Phần Liên Thông:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{connectedComponents}</span>
                {graphProperties.isConnected ? (
                  <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">✓ Liên thông</span>
                ) : (
                  <span className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-1 rounded">⚠ Không liên thông</span>
                )}
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400 text-xs">Tiến Độ MST:</span>
                <span className="text-white font-bold">{mstEdges} / {graphProperties.expectedMSTEdges}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${graphProperties.mstProgress}%` }}
                ></div>
              </div>
            </div>

            {!graphProperties.canFormMST && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                <p className="text-yellow-400 text-xs flex items-start gap-2">
                  <span>⚠️</span>
                  <span>
                    {!graphProperties.isConnected
                      ? "Đồ thị không liên thông - MST không tồn tại!"
                      : "Không đủ cạnh để tạo MST!"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cycle Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
            <span>♻️</span>
            Phân Tích Chu Trình
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Có Chu Trình:</span>
              <span className={`font-bold ${graphProperties.hasCycle ? "text-red-400" : "text-green-400"}`}>
                {graphProperties.hasCycle ? "CÓ" : "KHÔNG"}
              </span>
            </div>
            {graphProperties.hasCycle && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Số Chu Trình Tối Thiểu:</span>
                  <span className="text-purple-400 font-bold">≥ {graphProperties.minCycles}</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                  <p className="text-purple-300 text-xs">
                    💡 E - (V-1) = {totalEdges} - {totalNodes - 1} = {graphProperties.minCycles} cycles
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Graph Properties Summary */}
        <div className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <span>📐</span>
            Các Thuộc Tính Toán Học
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-slate-400">Đỉnh (V)</p>
              <p className="text-white font-bold text-lg">{totalNodes}</p>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-slate-400">Cạnh (E)</p>
              <p className="text-white font-bold text-lg">{totalEdges}</p>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-slate-400">Max Edges</p>
              <p className="text-cyan-400 font-bold">{graphProperties.maxEdges}</p>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <p className="text-slate-400">MST Edges</p>
              <p className="text-green-400 font-bold">{graphProperties.expectedMSTEdges}</p>
            </div>
          </div>
        </div>

        {/* Euler & Hamilton Check */}
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">🎓 Advanced Theory</h4>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">▸</span>
              <span>
                <strong>Euler Path:</strong> Cần tất cả đỉnh bậc chẵn (hoặc 2 đỉnh bậc lẻ)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">▸</span>
              <span>
                <strong>Hamilton Cycle:</strong> NP-Complete problem
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">▸</span>
              <span>
                <strong>Tree:</strong> V - 1 = E và không có chu trình
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
