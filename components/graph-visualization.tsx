"use client"

import { useEffect, useRef, useState } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface Edge {
  source: string
  target: string
  weight: number
}

interface EdgeState {
  edge: Edge
  status: "normal" | "examining" | "selected" | "rejected"
}

interface KruskalStep {
  edgeIndex: number
  status: "examining" | "selected" | "rejected"
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
    currentStatus?: "examining" | "selected" | "rejected"
    totalCost: number
    edgesSelected: number
    connectedComponents: number
  }) => void
  onLogEntry?: (entry: { message: string; type: "examining" | "selected" | "rejected" | "info" }) => void
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

  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const stepsRef = useRef<KruskalStep[]>([])
  const stepIndexRef = useRef(0)
  const stepsGeneratedRef = useRef(false)
  const edgesSelectedRef = useRef(0)
  const sortedEdgesRef = useRef<Edge[]>([])
  const edgesRef = useRef<Edge[]>([])

  const calculateForceDirectedLayout = (
    nodes: Set<string>,
    edges: Edge[],
    width: number,
    height: number,
    iterations = 150,
  ) => {
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
    for (let iter = 0; iter < iterations; iter++) {
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
    stepsGeneratedRef.current = false
    stepsRef.current = []
    setVisibleNodes(new Set())
    setVisibleEdges(new Set())
    edgesSelectedRef.current = 0
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
      if (animationRef.current) clearTimeout(animationRef.current)
      return
    }

    // Generate Kruskal steps only once
    if (!stepsGeneratedRef.current) {
      const sortedEdges = sortedEdgesRef.current
      const parent = new Map<string, string>()
      const newSteps: KruskalStep[] = []
      let totalCostAccum = 0

      const nodes = new Set<string>()
      edgesRef.current.forEach((e) => {
        nodes.add(e.source)
        nodes.add(e.target)
      })
      nodes.forEach((node) => parent.set(node, node))

      function find(x: string): string {
        if (parent.get(x) !== x) {
          parent.set(x, find(parent.get(x)!))
        }
        return parent.get(x)!
      }

      function union(x: string, y: string): boolean {
        const px = find(x)
        const py = find(y)
        if (px === py) return false
        parent.set(px, py)
        return true
      }

      sortedEdges.forEach((edge) => {
        newSteps.push({ edgeIndex: sortedEdges.indexOf(edge), status: "examining", totalCost: totalCostAccum })

        if (union(edge.source, edge.target)) {
          totalCostAccum += edge.weight
          newSteps.push({
            edgeIndex: sortedEdges.indexOf(edge),
            status: "selected",
            totalCost: totalCostAccum,
          })
        } else {
          newSteps.push({
            edgeIndex: sortedEdges.indexOf(edge),
            status: "rejected",
            totalCost: totalCostAccum,
          })
        }
      })

      stepsRef.current = newSteps
      stepsGeneratedRef.current = true
      stepIndexRef.current = 0
    }

    let lastFrameTime = Date.now()
    let animationFrameId: number | null = null

    const animate = () => {
      const now = Date.now()
      const elapsed = now - lastFrameTime
      const baseDelay = 1000
      const delay = baseDelay / speed

      if (elapsed < delay) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      lastFrameTime = now

      if (stepIndexRef.current < stepsRef.current.length) {
        const step = stepsRef.current[stepIndexRef.current]
        const sortedEdges = sortedEdgesRef.current
        const edge = sortedEdges[step.edgeIndex]
        const key = `${edge.source}-${edge.target}`

        setEdgeStates((prev) => {
          const newStates = new Map(prev)
          newStates.set(key, { edge, status: step.status })
          return newStates
        })

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

        setTotalCost(step.totalCost)
        setCurrentStep(stepIndexRef.current)

        if (onLogEntry) {
          let logMessage = ""
          if (step.status === "examining") {
            logMessage = `Xét cạnh ${edge.source}-${edge.target} (trọng số: ${edge.weight})`
          } else if (step.status === "selected") {
            logMessage = `Chấp nhận cạnh ${edge.source}-${edge.target} (trọng số: ${edge.weight}) - Kết nối thành phần`
          } else {
            logMessage = `Bị loại cạnh ${edge.source}-${edge.target} - Tạo chu trình`
          }

          onLogEntry({ message: logMessage, type: step.status })
        }

        if (step.status === "selected") {
          edgesSelectedRef.current++
          setEdgesSelected(edgesSelectedRef.current)

          setComponentColors((prev) => {
            const newColors = new Map(prev)
            const nodes = new Set<string>()
            edgesRef.current.forEach((e) => {
              nodes.add(e.source)
              nodes.add(e.target)
            })

            const tempParent = new Map<string, string>()
            nodes.forEach((node) => tempParent.set(node, node))

            function tempFind(x: string): string {
              if (tempParent.get(x) !== x) {
                tempParent.set(x, tempFind(tempParent.get(x)!))
              }
              return tempParent.get(x)!
            }

            for (let i = 0; i <= stepIndexRef.current; i++) {
              if (stepsRef.current[i].status === "selected") {
                const e = sortedEdges[stepsRef.current[i].edgeIndex]
                const px = tempFind(e.source)
                const py = tempFind(e.target)
                if (px !== py) {
                  tempParent.set(px, py)
                }
              }
            }

            const componentMap = new Map<string, string>()
            nodes.forEach((node) => {
              const root = tempFind(node)
              if (!componentMap.has(root)) {
                componentMap.set(root, COMPONENT_COLORS[componentMap.size % COMPONENT_COLORS.length])
              }
              newColors.set(node, componentMap.get(root)!)
            })

            return newColors
          })
        }

        const nodes = new Set<string>()
        edgesRef.current.forEach((e) => {
          nodes.add(e.source)
          nodes.add(e.target)
        })

        const tempParent = new Map<string, string>()
        nodes.forEach((node) => tempParent.set(node, node))

        function tempFind(x: string): string {
          if (tempParent.get(x) !== x) {
            tempParent.set(x, tempFind(tempParent.get(x)!))
          }
          return tempParent.get(x)!
        }

        for (let i = 0; i <= stepIndexRef.current; i++) {
          if (stepsRef.current[i].status === "selected") {
            const e = sortedEdges[stepsRef.current[i].edgeIndex]
            const px = tempFind(e.source)
            const py = tempFind(e.target)
            if (px !== py) {
              tempParent.set(px, py)
            }
          }
        }

        const roots = new Set<string>()
        nodes.forEach((node) => {
          roots.add(tempFind(node))
        })
        setConnectedComponents(roots.size)

        if (onStepChange) {
          onStepChange({
            currentStep: stepIndexRef.current,
            totalSteps: stepsRef.current.length,
            currentEdge: edge,
            currentStatus: step.status,
            totalCost: step.totalCost,
            edgesSelected: edgesSelectedRef.current + (step.status === "selected" ? 1 : 0),
            connectedComponents: roots.size,
          })
        }

        stepIndexRef.current++

        if (stepIndexRef.current >= stepsRef.current.length) {
          setIsComplete(true)
          if (onComplete) {
            onComplete(step.totalCost, edgesSelectedRef.current + (step.status === "selected" ? 1 : 0))
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isRunning, speed, onStepChange, onLogEntry, onComplete])

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
      let lineWidth = 2
      let opacity = 1

      if (state?.status === "examining") {
        edgeColor = "#eab308"
        lineWidth = 3
      } else if (state?.status === "selected") {
        edgeColor = "#22c55e"
        lineWidth = 3
      } else if (state?.status === "rejected") {
        edgeColor = "#ef4444"
        lineWidth = 2
        opacity = isComplete ? 0.2 : 0.6
      }

      ctx.strokeStyle = edgeColor
      ctx.globalAlpha = opacity
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(pos1.x, pos1.y)
      ctx.lineTo(pos2.x, pos2.y)
      ctx.stroke()
      ctx.globalAlpha = 1

      const midX = (pos1.x + pos2.x) / 2
      const midY = (pos1.y + pos2.y) / 2

      ctx.fillStyle = "#e2e8f0"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const text = edge.weight.toString()
      const metrics = ctx.measureText(text)
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(midX - metrics.width / 2 - 4, midY - 8, metrics.width + 8, 16)

      ctx.fillStyle = "#e2e8f0"
      ctx.fillText(text, midX, midY)
    })

    const nodeArray = Array.from(nodes)
    nodeArray.forEach((node) => {
      if (!visibleNodes.has(node)) return

      const pos = nodePositions.get(node)
      if (!pos) return

      const nodeColor = componentColors.get(node) || "#3b82f6"
      const nodeWidth = 60
      const nodeHeight = 50

      // Draw rounded rectangle (using arcs for compatibility)
      const x = pos.x - nodeWidth / 2
      const y = pos.y - nodeHeight / 2
      const radius = 8

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

      // Draw border - thicker and more visible
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw node label with better contrast
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node, pos.x, pos.y)
    })
  }, [edgeStates, componentColors, isComplete, visibleNodes, visibleEdges])

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
            "Cuộn chuột để phóng to/thu nhỏ, kéo chuột để di chuyển | Scroll to zoom, drag to pan"
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
              className="w-full h-96 bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing"
            />
          </TransformComponent>
        </TransformWrapper>

        <div className="grid grid-cols-2 gap-3 text-sm pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-slate-400">Đang Xét | Examining</span>
          </div>
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

        {stepsRef.current.length > 0 && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
              Bước | Step {currentStep + 1} / {stepsRef.current.length}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / stepsRef.current.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
