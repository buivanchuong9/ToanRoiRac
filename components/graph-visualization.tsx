"use client"

import { useEffect, useRef, useState } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { KruskalWebSocket, type KruskalStep as APIKruskalStep } from "@/lib/api-client"

interface Edge {
  source: string
  target: string
  weight: number
}

interface EdgeState {
  edge: Edge
  status: "normal" | "selected" | "rejected"
}

interface KruskalStep {
  edgeIndex: number
  status: "selected" | "rejected"
  totalCost: number
}

interface GraphVisualizationProps {
  edges: Edge[]
  isRunning: boolean
  speed: number
  onStepChange?: (step: {
    currentStep: number
    totalSteps: number
    currentEdge?: Edge
    currentStatus?: "selected" | "rejected"
    totalCost: number
    edgesSelected: number
    connectedComponents: number
  }) => void
  onLogEntry?: (entry: { message: string; type: "selected" | "rejected" | "info" }) => void
  onComplete?: (totalCost: number, edgesSelected: number) => void
}

const COMPONENT_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#6366f1",
  "#14b8a6",
]

export default function GraphVisualization({
  edges,
  isRunning,
  speed,
  onStepChange,
  onLogEntry,
  onComplete,
}: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [edgeStates, setEdgeStates] = useState<Map<string, EdgeState>>(new Map())
  const [totalCost, setTotalCost] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [edgesSelected, setEdgesSelected] = useState(0)
  const [connectedComponents, setConnectedComponents] = useState(0)
  const [componentColors, setComponentColors] = useState<Map<string, string>>(new Map())
  const [isComplete, setIsComplete] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set())
  const [visibleEdges, setVisibleEdges] = useState<Set<string>>(new Set())
  const [currentEdgeKey, setCurrentEdgeKey] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState<Map<string, string>>(new Map())
  const [totalStepsCount, setTotalStepsCount] = useState(0)

  const wsRef = useRef<KruskalWebSocket | null>(null)
  const stepsRef = useRef<KruskalStep[]>([])
  const stepIndexRef = useRef(0)
  const sortedEdgesRef = useRef<Edge[]>([])
  const edgesRef = useRef<Edge[]>([])

  const calculateForceDirectedLayout = (
    nodes: Set<string>,
    edges: Edge[],
    width: number,
    height: number,
    iterations: number = 100
  ): Map<string, { x: number; y: number }> => {
    const nodeCount = nodes.size
    // Điều chỉnh iterations dựa trên số nodes
    const actualIterations = Math.min(iterations, Math.max(30, 200 - nodeCount))
    const nodeArray = Array.from(nodes)
    const positions = new Map<string, { x: number; y: number; vx: number; vy: number }>()

    // Initialize positions in circle to avoid overlaps
    const radius = Math.min(width, height) * 0.35
    const centerX = width / 2
    const centerY = height / 2
    nodeArray.forEach((node, idx) => {
      const angle = (idx / nodeArray.length) * Math.PI * 2
      positions.set(node, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      })
    })

    // Tuning parameters for better layout
    const k = Math.sqrt((width * height) / nodeArray.length) * 2.0 // Larger optimal distance
    const c = 0.05 // Lower damping for better convergence
    const repulsion = 15000 // Strong repulsion to keep nodes apart
    const attraction = 0.04 // Weaker attraction to prevent pulling together

    // Simulate forces with multiple iterations
    for (let iter = 0; iter < actualIterations; iter++) {
      // Reset forces
      nodeArray.forEach((node) => {
        const pos = positions.get(node)!
        pos.vx = 0
        pos.vy = 0
      })

      // Repulsive forces between ALL nodes - very strong
      for (let i = 0; i < nodeArray.length; i++) {
        for (let j = i + 1; j < nodeArray.length; j++) {
          const pos1 = positions.get(nodeArray[i])!
          const pos2 = positions.get(nodeArray[j])!
          const dx = pos2.x - pos1.x
          const dy = pos2.y - pos1.y
          const distSq = dx * dx + dy * dy
          const dist = Math.sqrt(distSq) + 0.1
          const force = repulsion / distSq
          const forceX = (force * dx) / dist
          const forceY = (force * dy) / dist
          pos1.vx -= forceX
          pos1.vy -= forceY
          pos2.vx += forceX
          pos2.vy += forceY
        }
      }

      // Attractive forces only along edges
      edges.forEach((edge) => {
        const pos1 = positions.get(edge.source)!
        const pos2 = positions.get(edge.target)!
        const dx = pos2.x - pos1.x
        const dy = pos2.y - pos1.y
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1
        const force = attraction * Math.max(0, dist - k)
        const forceX = (force * dx) / dist
        const forceY = (force * dy) / dist
        pos1.vx += forceX
        pos1.vy += forceY
        pos2.vx -= forceX
        pos2.vy -= forceY
      })

      // Apply gravity toward center to prevent flying away
      const gravityStrength = 0.01
      nodeArray.forEach((node) => {
        const pos = positions.get(node)!
        const dx = centerX - pos.x
        const dy = centerY - pos.y
        pos.vx += dx * gravityStrength
        pos.vy += dy * gravityStrength
      })

      // Update positions with damping and boundary constraints
      nodeArray.forEach((node) => {
        const pos = positions.get(node)!
        const speed = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy)
        if (speed > 0) {
          const maxDelta = 5 // Limit max movement per iteration
          const scale = Math.min(1, maxDelta / speed)
          pos.x += pos.vx * scale * c
          pos.y += pos.vy * scale * c
        }

        // Keep nodes within bounds with padding
        const padding = 60
        pos.x = Math.max(padding, Math.min(width - padding, pos.x))
        pos.y = Math.max(padding, Math.min(height - padding, pos.y))
      })
    }

    const result = new Map<string, { x: number; y: number }>()
    nodeArray.forEach((node) => {
      const pos = positions.get(node)!
      result.set(node, { x: pos.x, y: pos.y })
    })
    return result
  }

  useEffect(() => {
    edgesRef.current = edges

    const newStates = new Map<string, EdgeState>()
    edges.forEach((edge) => {
      const key = `${edge.source}-${edge.target}`
      newStates.set(key, { edge, status: "normal" })
    })
    setEdgeStates(newStates)
    setEdgesSelected(0)
    setTotalCost(0)
    setCurrentStep(0)
    setIsComplete(false)
    stepIndexRef.current = 0
    stepsRef.current = []
    setVisibleNodes(new Set())
    setVisibleEdges(new Set())
    sortedEdgesRef.current = [...edges].sort((a, b) => a.weight - b.weight)

    const nodes = new Set<string>()
    edges.forEach((e) => {
      nodes.add(e.source)
      nodes.add(e.target)
    })
    setConnectedComponents(nodes.size)

    const colors = new Map<string, string>()
    Array.from(nodes).forEach((node, index) => {
      colors.set(node, COMPONENT_COLORS[index % COMPONENT_COLORS.length])
    })
    setComponentColors(colors)
  }, [edges])

  useEffect(() => {
    if (!isRunning) {
      // Disconnect WebSocket khi dừng
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      return
    }

    // Đóng connection cũ nếu có (trước khi tạo mới)
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    // Kết nối WebSocket và bắt đầu stream thuật toán từ Python backend
    wsRef.current = new KruskalWebSocket()
    
    wsRef.current.connect(edges, speed, {
      onStep: (step: APIKruskalStep) => {
        // Process step from Python backend
        const edge = step.edge
        const key = `${edge.source}-${edge.target}`

        // Highlight edge hiện tại
        setCurrentEdgeKey(key)
        
        // Lưu lý do reject nếu bị từ chối
        if (step.status === 'rejected') {
          setRejectionReason((prev) => {
            const newReasons = new Map(prev)
            newReasons.set(key, '⚠️ TẠO CHU TRÌNH')
            return newReasons
          })
        }

        // Update edge state
        setEdgeStates((prev) => {
          const newStates = new Map(prev)
          newStates.set(key, { edge, status: step.status })
          return newStates
        })

        // Update visible nodes and edges
        setVisibleNodes((prev) => {
          const newVisible = new Set(prev)
          newVisible.add(edge.source)
          newVisible.add(edge.target)
          return newVisible
        })

        setVisibleEdges((prev) => {
          const newVisible = new Set(prev)
          newVisible.add(key)
          return newVisible
        })

        // Update statistics
        setTotalCost(step.total_cost)
        setEdgesSelected(step.edges_selected)
        setConnectedComponents(step.connected_components)
        setCurrentStep(step.step_number)

        // Update component colors based on component_map from Python
        setComponentColors((prev) => {
          const newColors = new Map(prev)
          Object.entries(step.component_map).forEach(([node, componentId]) => {
            newColors.set(node, COMPONENT_COLORS[componentId % COMPONENT_COLORS.length])
          })
          return newColors
        })

        // Log entry
        if (onLogEntry) {
          onLogEntry({
            message: step.message,
            type: step.status
          })
        }

        // Update step info
        if (onStepChange) {
          onStepChange({
            currentStep: step.step_number - 1, // 0-indexed cho UI
            totalSteps: totalStepsCount || edges.length, // Tổng số edges sẽ xem xét
            currentEdge: edge,
            currentStatus: step.status,
            totalCost: step.total_cost,
            edgesSelected: step.edges_selected,
            connectedComponents: step.connected_components,
          })
        }
      },

      onComplete: (result) => {
        setIsComplete(true)
        setCurrentEdgeKey(null)
        setTotalStepsCount(currentStep) // Lưu tổng steps thực tế
        
        if (onComplete) {
          onComplete(result.total_cost, result.mst_edges.length)
        }

        if (onLogEntry) {
          onLogEntry({
            message: `✨ Hoàn thành! MST có ${result.mst_edges.length} cạnh với tổng chi phí: ${result.total_cost}`,
            type: "info"
          })
        }
      },

      onError: (error) => {
        console.error('WebSocket error:', error)
        if (onLogEntry) {
          onLogEntry({
            message: `❌ Lỗi: ${error}`,
            type: "info"
          })
        }
      }
    })

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [isRunning]) // Chỉ chạy lại khi isRunning thay đổi

  // Canvas rendering effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const nodes = new Set<string>()
    edgesRef.current.forEach((e) => {
      nodes.add(e.source)
      nodes.add(e.target)
    })

    const nodePositions = calculateForceDirectedLayout(nodes, edgesRef.current, canvas.width, canvas.height, 50)

    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    edgesRef.current.forEach((edge) => {
      const key = `${edge.source}-${edge.target}`

      if (!visibleEdges.has(key)) return

      const state = edgeStates.get(key)
      const pos1 = nodePositions.get(edge.source)
      const pos2 = nodePositions.get(edge.target)

      if (!pos1 || !pos2) return

      let edgeColor = "#64748b"
      let lineWidth = 3
      let opacity = 1
      let isCurrentEdge = key === currentEdgeKey

      if (state?.status === "selected") {
        edgeColor = "#22c55e"
        lineWidth = 5
      } else if (state?.status === "rejected") {
        edgeColor = "#ef4444"
        lineWidth = 4
        opacity = isComplete ? 0.6 : 0.9
      } else if (isCurrentEdge) {
        edgeColor = "#fbbf24"
        lineWidth = 6
      }

      // Glow effect cho edge đang xét
      if (isCurrentEdge && !isComplete) {
        ctx.shadowColor = edgeColor
        ctx.shadowBlur = 15
      }

      ctx.strokeStyle = edgeColor
      ctx.globalAlpha = opacity
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(pos1.x, pos1.y)
      ctx.lineTo(pos2.x, pos2.y)
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      const midX = (pos1.x + pos2.x) / 2
      const midY = (pos1.y + pos2.y) / 2

      // Weight label với gradient background
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const text = edge.weight.toString()
      const metrics = ctx.measureText(text)
      const padding = 8
      const bgWidth = metrics.width + padding * 2
      const bgHeight = 24
      
      // Gradient background cho weight
      const gradient = ctx.createLinearGradient(
        midX - bgWidth/2, midY - bgHeight/2,
        midX + bgWidth/2, midY + bgHeight/2
      )
      if (state?.status === "selected") {
        gradient.addColorStop(0, "#059669")
        gradient.addColorStop(1, "#10b981")
      } else if (state?.status === "rejected") {
        gradient.addColorStop(0, "#dc2626")
        gradient.addColorStop(1, "#ef4444")
      } else if (isCurrentEdge) {
        gradient.addColorStop(0, "#d97706")
        gradient.addColorStop(1, "#f59e0b")
      } else {
        gradient.addColorStop(0, "#1e293b")
        gradient.addColorStop(1, "#334155")
      }
      
      ctx.fillStyle = gradient
      ctx.fillRect(midX - bgWidth/2, midY - bgHeight/2, bgWidth, bgHeight)
      
      // Border cho weight label
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1.5
      ctx.strokeRect(midX - bgWidth/2, midY - bgHeight/2, bgWidth, bgHeight)

      ctx.fillStyle = "#ffffff"
      ctx.fillText(text, midX, midY)
      
      // Hiển thị lý do reject với style nổi bật
      if (state?.status === "rejected" && rejectionReason.has(key)) {
        ctx.font = "bold 14px sans-serif"
        const reason = rejectionReason.get(key)!
        const reasonMetrics = ctx.measureText(reason)
        const reasonBgWidth = reasonMetrics.width + 12
        const reasonBgHeight = 22
        
        // Shadow cho text rejection
        ctx.shadowColor = "rgba(239, 68, 68, 0.8)"
        ctx.shadowBlur = 10
        
        // Background đỏ nổi bật
        ctx.fillStyle = "rgba(220, 38, 38, 0.95)"
        ctx.fillRect(midX - reasonBgWidth/2, midY + 20, reasonBgWidth, reasonBgHeight)
        
        // Border trắng
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.strokeRect(midX - reasonBgWidth/2, midY + 20, reasonBgWidth, reasonBgHeight)
        
        ctx.shadowBlur = 0
        ctx.fillStyle = "#ffffff"
        ctx.fillText(reason, midX, midY + 31)
      }
    })

    const nodeArray = Array.from(nodes)
    nodeArray.forEach((node) => {
      if (!visibleNodes.has(node)) return

      const pos = nodePositions.get(node)
      if (!pos) return

      const nodeColor = componentColors.get(node) || "#3b82f6"
      // Node sizing động dựa trên số lượng nodes
      const totalNodes = nodes.size
      const baseSize = totalNodes > 50 ? 45 : totalNodes > 20 ? 55 : 70
      const nodeWidth = baseSize
      const nodeHeight = baseSize * 0.75
      
      // Highlight nodes của edge đang xét
      const isPartOfCurrentEdge = currentEdgeKey && 
        (currentEdgeKey.startsWith(node + '-') || currentEdgeKey.endsWith('-' + node) ||
         currentEdgeKey.includes('-' + node + '-'))

      // Draw rounded rectangle (using arcs for compatibility)
      const x = pos.x - nodeWidth / 2
      const y = pos.y - nodeHeight / 2
      const radius = 8
      
      // Glow effect cho nodes của edge đang xét
      if (isPartOfCurrentEdge && !isComplete) {
        ctx.shadowColor = "#fbbf24"
        ctx.shadowBlur = 20
      }

      ctx.fillStyle = nodeColor
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + nodeWidth - radius, y)
      ctx.quadraticCurveTo(x + nodeWidth, y, x + nodeWidth, y + radius)
      ctx.lineTo(x + nodeWidth, y + nodeHeight - radius)
      ctx.quadraticCurveTo(x + nodeWidth, y + nodeHeight, x + nodeWidth - radius, y + nodeHeight)
      ctx.lineTo(x + radius, y + nodeHeight)
      ctx.quadraticCurveTo(x, y + nodeHeight, x, y + nodeHeight - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()
      
      ctx.shadowBlur = 0

      // Draw border - thicker nếu là part of current edge
      ctx.strokeStyle = isPartOfCurrentEdge ? "#fbbf24" : "#ffffff"
      ctx.lineWidth = isPartOfCurrentEdge ? 4 : 2.5
      ctx.stroke()

      // Draw node label with better contrast - font size động
      ctx.fillStyle = "#ffffff"
      const fontSize = totalNodes > 50 ? 16 : totalNodes > 20 ? 18 : 22
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node, pos.x, pos.y)
    })
  }, [edgeStates, componentColors, isComplete, visibleNodes, visibleEdges, currentEdgeKey, rejectionReason])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Trực Quan Hóa Đồ Thị | Graph Visualization</h2>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Chi Phí MST | MST Cost</p>
            <p className={`text-3xl font-bold ${isComplete ? "text-green-400" : "text-blue-400"}`}>{totalCost}</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900/50 rounded px-3 py-2">
          {isComplete ? (
            <span className="text-green-400">
              ✓ Hoàn thành! MST có {edgesSelected} cạnh với chi phí {totalCost} | Complete! MST has {edgesSelected}{" "}
              edges with cost {totalCost}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>🔍 Cuộn chuột để <strong className="text-cyan-400">zoom</strong>, kéo để <strong className="text-cyan-400">di chuyển</strong></span>
              <span className="text-slate-600">|</span>
              <span>Scroll to <strong className="text-cyan-400">zoom</strong>, drag to <strong className="text-cyan-400">pan</strong></span>
            </span>
          )}
        </div>

        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          minScale={0.5}
          maxScale={3}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent>
            <canvas
              ref={canvasRef}
              className="w-full h-128 bg-linear-to-br from-slate-900 to-slate-950 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing"
            />
          </TransformComponent>
        </TransformWrapper>

        <div className="grid grid-cols-3 gap-3 text-sm pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Được Chọn | Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-400">Bị Loại | Rejected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <span className="text-slate-400">Bình Thường | Normal</span>
          </div>
        </div>

        {currentStep > 0 && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
              Bước | Step {currentStep}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / Math.max(currentStep + 1, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
