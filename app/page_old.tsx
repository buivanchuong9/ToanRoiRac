"use client"

import { useState } from "react"
import FileUploader from "@/components/file-uploader"
import GraphVisualization from "@/components/graph-visualization"
import KruskalControls from "@/components/kruskal-controls"
import AnimationLogPanel from "@/components/animation-log-panel"
import SpeedControl from "@/components/speed-control"
import StatisticsSidebar from "@/components/statistics-sidebar"
import CompletionReportModal from "@/components/completion-report-modal"
import StepExplanationPanel from "@/components/step-explanation-panel"
import SortedEdgesViewer from "@/components/sorted-edges-viewer"
import ManualInputPanel from "@/components/manual-input-panel"

interface LogEntry {
  id: string
  timestamp: number
  message: string
  type: "examining" | "selected" | "rejected" | "info"
}

export default function Home() {
  const [edges, setEdges] = useState<Array<{ source: string; target: string; weight: number }>>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string>("")
  const [speed, setSpeed] = useState(1)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stepInfo, setStepInfo] = useState({
    currentStep: 0,
    totalSteps: 0,
    currentEdge: undefined as { source: string; target: string; weight: number } | undefined,
    currentStatus: undefined as "examining" | "selected" | "rejected" | undefined,
    totalCost: 0,
    edgesSelected: 0,
    connectedComponents: 0,
  })
  const [selectedEdgesIndices, setSelectedEdgesIndices] = useState<Set<number>>(new Set())
  const [rejectedEdgesIndices, setRejectedEdgesIndices] = useState<Set<number>>(new Set())
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState({
    totalCost: 0,
    edgesSelected: 0,
    stepsCount: 0,
  })

  const handleStepChange = (step: any) => {
    setStepInfo(step)
    
    // Track selected and rejected edges by their index in sorted edges
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)
    if (step.currentEdge) {
      const currentIndex = sortedEdges.findIndex(
        (e) => e.source === step.currentEdge.source &&
               e.target === step.currentEdge.target &&
               e.weight === step.currentEdge.weight
      )
      
      if (currentIndex !== -1) {
        if (step.currentStatus === "selected") {
          setSelectedEdgesIndices((prev) => new Set(prev).add(currentIndex))
        } else if (step.currentStatus === "rejected") {
          setRejectedEdgesIndices((prev) => new Set(prev).add(currentIndex))
        }
      }
    }
  }

  const handleFileUpload = (uploadedEdges: Array<{ source: string; target: string; weight: number }>) => {
    setEdges(uploadedEdges)
    setError("")
    setIsRunning(false)
    setLogs([])
    setSpeed(1)
    setShowReport(false)
  }

  const handleError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handleLogEntry = (entry: { message: string; type: "examining" | "selected" | "rejected" | "info" }) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: prev.length,
        message: entry.message,
        type: entry.type,
      },
    ])
  }

  const handleComplete = (totalCost: number, edgesSelected: number) => {
    handleLogEntry({
      message: `Thuật toán hoàn thành! Chi phí MST: ${totalCost}, Cạnh: ${edgesSelected} | Algorithm complete! MST cost: ${totalCost}, Edges: ${edgesSelected}`,
      type: "info",
    })
    setReportData({
      totalCost,
      edgesSelected,
      stepsCount: logs.length,
    })
    setShowReport(true)
  }

  const getNodeCount = (edgeList: Array<{ source: string; target: string; weight: number }>) => {
    const nodes = new Set<string>()
    edgeList.forEach((edge) => {
      nodes.add(edge.source)
      nodes.add(edge.target)
    })
    return nodes.size
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Kruskal Algorithm Visualizer
              </h1>
              <p className="text-lg text-slate-300 mt-1 font-medium">
                🎓 Bùi Văn Chương - Toán Rời Rạc Chủ Đề 7
              </p>
              <p className="text-sm text-slate-400 mt-1">
                ⚡ Powered by Python FastAPI Backend + Next.js Frontend
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-slate-300 text-base">
              🌳 <span className="font-semibold text-blue-300">Thuật toán Kruskal</span> - Tìm cây khung nhỏ nhất (Minimum Spanning Tree) 
              bằng cách sắp xếp các cạnh theo trọng số và chọn cạnh không tạo chu trình
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Input & Controls */}
          <div className="xl:col-span-3 space-y-6"
>
            {/* Manual Input */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <ManualInputPanel onEdgesChange={handleFileUpload} isRunning={isRunning} />
            </div>

            {/* File Upload */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Hoặc Upload File</h2>
              </div>
              <FileUploader onUpload={handleFileUpload} onError={handleError} />
            </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}

              {edges.length > 0 && <KruskalControls edges={edges} isRunning={isRunning} onRunningChange={setIsRunning} />}

              {edges.length > 0 && <SpeedControl speed={speed} onSpeedChange={setSpeed} isRunning={isRunning} />}
            </div>

            {/* Middle+Right Panel - Graph Visualization */}
            <div className="lg:col-span-3">
              {edges.length > 0 ? (
                <GraphVisualization
                  edges={edges}
                  isRunning={isRunning}
                  speed={speed}
                  onStepChange={handleStepChange}
                  onLogEntry={handleLogEntry}
                  onComplete={handleComplete}
                />
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 h-96 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold mb-2">Nhập hoặc tải dữ liệu để bắt đầu</p>
                    <p className="text-slate-400 text-sm">Sử dụng panel bên trái để nhập dữ liệu hoặc upload file Excel</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Second Row: Step Explanation and Animation Log */}
          {edges.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StepExplanationPanel
                currentEdge={stepInfo.currentEdge}
                currentStatus={stepInfo.currentStatus}
                currentStep={stepInfo.currentStep}
                totalSteps={stepInfo.totalSteps}
                totalCost={stepInfo.totalCost}
                edgesSelected={stepInfo.edgesSelected}
                connectedComponents={stepInfo.connectedComponents}
              />
              <AnimationLogPanel logs={logs} isRunning={isRunning} />
            </div>
          )}

          {/* Third Row: Sorted Edges Viewer and Statistics */}
          {edges.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SortedEdgesViewer
                  edges={edges}
                  currentEdgeIndex={stepInfo.currentStep}
                  selectedEdgesIndices={selectedEdgesIndices}
                  rejectedEdgesIndices={rejectedEdgesIndices}
                />
              </div>
              <div>
                <StatisticsSidebar
                  edgesSelected={stepInfo.edgesSelected}
                  totalCost={stepInfo.totalCost}
                  connectedComponents={stepInfo.connectedComponents}
                  totalNodes={getNodeCount(edges)}
                  totalEdges={edges.length}
                  isRunning={isRunning}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <CompletionReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        totalCost={reportData.totalCost}
        edgesSelected={reportData.edgesSelected}
        totalEdges={edges.length}
        totalNodes={getNodeCount(edges)}
        connectedComponents={stepInfo.connectedComponents}
        stepsCount={reportData.stepsCount}
      />
    </div>
  )
}
