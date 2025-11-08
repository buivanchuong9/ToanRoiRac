"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Zap } from "lucide-react"

interface ManualInputPanelProps {
  onEdgesChange: (edges: Array<{ source: string; target: string; weight: number }>) => void
  isRunning: boolean
}

export default function ManualInputPanel({ onEdgesChange, isRunning }: ManualInputPanelProps) {
  const [edges, setEdges] = useState<Array<{ source: string; target: string; weight: number }>>([])
  const [smartInput, setSmartInput] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [startPoint, setStartPoint] = useState("")
  const [endPoint, setEndPoint] = useState("")

  // Smart parser - nhận bất kỳ format nào
  const parseSmartInput = (input: string): { source: string; target: string; weight: number } | null => {
    const trimmed = input.trim()
    if (!trimmed) return null

    // Try different separators: space, comma, tab, dash
    let parts: string[] = []

    if (trimmed.includes(",")) {
      // Format: "A,B,5"
      parts = trimmed.split(",").map((p) => p.trim())
    } else if (trimmed.includes("\t")) {
      // Format: "A\tB\t5" (tab separated)
      parts = trimmed.split("\t").map((p) => p.trim())
    } else if (trimmed.includes("-")) {
      // Format: "A-B-5"
      parts = trimmed.split("-").map((p) => p.trim())
    } else if (trimmed.includes("|")) {
      // Format: "A|B|5"
      parts = trimmed.split("|").map((p) => p.trim())
    } else {
      // Format: "A B 5" (space separated, handle multiple spaces)
      parts = trimmed.split(/\s+/).filter((p) => p.length > 0)
    }

    // Should have at least 3 parts
    if (parts.length < 3) return null

    const src = parts[0].toUpperCase()
    const tgt = parts[1].toUpperCase()
    const w = parseFloat(parts[2])

    // Validation
    if (!src || !tgt || isNaN(w) || w <= 0 || src === tgt) {
      return null
    }

    return {
      source: src,
      target: tgt,
      weight: w,
    }
  }

  const addEdgeFromSmartInput = () => {
    setErrorMsg("")

    if (!smartInput.trim()) {
      setErrorMsg("Vui lòng nhập dữ liệu")
      return
    }

    const parsed = parseSmartInput(smartInput)

    if (!parsed) {
      setErrorMsg("Format không hợp lệ. Ví dụ: A B 5, A,B,5, A-B-5")
      return
    }

    // Check duplicate (undirected)
    const edgeExists = edges.some(
      (e) =>
        (e.source === parsed.source && e.target === parsed.target) ||
        (e.source === parsed.target && e.target === parsed.source)
    )

    if (edgeExists) {
      setErrorMsg(`Cạnh ${parsed.source}-${parsed.target} đã tồn tại`)
      return
    }

    const newEdges = [...edges, parsed]
    setEdges(newEdges)
    onEdgesChange(newEdges)
    setSmartInput("")
  }

  // Parse paste data (multiple lines)
  const pasteBulkData = () => {
    setErrorMsg("")

    const lines = smartInput.trim().split("\n").filter((line) => line.trim())

    if (lines.length === 0) {
      setErrorMsg("Vui lòng nhập dữ liệu")
      return
    }

    const newEdges: Array<{ source: string; target: string; weight: number }> = []
    let errorCount = 0

    lines.forEach((line) => {
      const parsed = parseSmartInput(line)

      if (parsed) {
        // Check duplicate
        const isDuplicate =
          newEdges.some(
            (e) =>
              (e.source === parsed.source && e.target === parsed.target) ||
              (e.source === parsed.target && e.target === parsed.source)
          ) ||
          edges.some(
            (e) =>
              (e.source === parsed.source && e.target === parsed.target) ||
              (e.source === parsed.target && e.target === parsed.source)
          )

        if (!isDuplicate) {
          newEdges.push(parsed)
        }
      } else {
        errorCount++
      }
    })

    if (newEdges.length === 0) {
      setErrorMsg("Không có cạnh hợp lệ được tìm thấy")
      return
    }

    const allEdges = [...edges, ...newEdges]
    setEdges(allEdges)
    onEdgesChange(allEdges)
    setSmartInput("")

    if (errorCount > 0) {
      setErrorMsg(`✅ Import ${newEdges.length} cạnh. ⚠️ Bỏ qua ${errorCount} dòng`)
    }
  }

  const deleteEdge = (index: number) => {
    const newEdges = edges.filter((_, i) => i !== index)
    setEdges(newEdges)
    onEdgesChange(newEdges)
  }

  const addSampleData = () => {
    const sampleEdges = [
      { source: "A", target: "B", weight: 4 },
      { source: "B", target: "C", weight: 1 },
      { source: "C", target: "D", weight: 8 },
      { source: "D", target: "E", weight: 2 },
      { source: "E", target: "F", weight: 3 },
      { source: "F", target: "A", weight: 6 },
      { source: "A", target: "D", weight: 5 },
    ]
    setEdges(sampleEdges)
    onEdgesChange(sampleEdges)
    setErrorMsg("")
    setSmartInput("")
  }

  const vertices = new Set(edges.flatMap((e) => [e.source, e.target]))
  const totalWeight = edges.reduce((sum, e) => sum + e.weight, 0)

  return (
    <div className="space-y-4">
      {/* Main Input Card */}
      <Card className="p-5 bg-gradient-to-br from-slate-800 via-slate-800/80 to-slate-900 border border-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 shadow-2xl">
        <div className="space-y-4">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Nhập Dữ Liệu
            </h3>
          </div>

          {/* Start & End Points */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">🟢 Điểm Bắt Đầu</label>
              <Input
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value.toUpperCase())}
                placeholder="Ví dụ: A"
                disabled={isRunning}
                maxLength={3}
                className="bg-slate-900 border-slate-600 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">🔴 Điểm Kết Thúc</label>
              <Input
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value.toUpperCase())}
                placeholder="Ví dụ: F"
                disabled={isRunning}
                maxLength={3}
                className="bg-slate-900 border-slate-600 text-white text-sm"
              />
            </div>
          </div>

          {/* Input Field */}
          <div className="relative">
            <Input
              value={smartInput}
              onChange={(e) => {
                setSmartInput(e.target.value)
                setErrorMsg("")
              }}
              placeholder="A B 5  |  A,B,5  |  A-B-5  |  A|B|5  (Ấn Enter hoặc click Paste)"
              disabled={isRunning}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (smartInput.includes("\n")) {
                    pasteBulkData()
                  } else {
                    addEdgeFromSmartInput()
                  }
                }
              }}
              className="bg-slate-900/80 border-2 border-slate-700/50 hover:border-blue-500/50 focus:border-blue-500 text-white placeholder:text-slate-500 text-base px-4 py-3 rounded-lg transition-all duration-200"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 hover:from-blue-500/5 hover:via-purple-500/5 hover:to-blue-500/5 pointer-events-none transition-all duration-200"></div>
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={addEdgeFromSmartInput}
              disabled={isRunning}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Thêm
            </Button>

            <Button
              onClick={pasteBulkData}
              disabled={isRunning}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-200"
            >
              <Zap className="w-4 h-4 mr-1.5" />
              Paste
            </Button>

            <Button
              onClick={addSampleData}
              disabled={isRunning}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-200"
            >
              ✨ Mẫu
            </Button>
          </div>

          {/* Error/Success Message */}
          {errorMsg && (
            <div
              className={`text-sm p-3 rounded-lg border-l-4 font-medium transition-all duration-200 ${
                errorMsg.includes("✅")
                  ? "bg-green-900/20 text-green-300 border-l-green-500"
                  : "bg-red-900/20 text-red-300 border-l-red-500"
              }`}
            >
              {errorMsg}
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex gap-6 flex-1">
              <div className="text-center">
                <div className="text-xs text-slate-400 font-medium">Đỉnh</div>
                <div className="text-xl font-bold text-blue-400">{vertices.size}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 font-medium">Cạnh</div>
                <div className="text-xl font-bold text-purple-400">{edges.length}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 font-medium">Tổng</div>
                <div className="text-xl font-bold text-emerald-400">{totalWeight}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edges List */}
      {edges.length > 0 && (
        <Card className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 shadow-xl">
          <h4 className="text-sm font-bold text-slate-300 mb-3">📊 Danh Sách Cạnh ({edges.length})</h4>
          <div className="max-h-56 overflow-y-auto space-y-1.5">
            {edges.map((edge, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm p-2.5 bg-slate-900/40 hover:bg-slate-900/60 rounded-lg border border-slate-700/30 hover:border-slate-600/60 transition-all duration-200 group"
              >
                <div className="font-mono space-x-1.5">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-bold">{edge.source}</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded font-bold">{edge.target}</span>
                  <span className="text-slate-500">:</span>
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded font-bold">{edge.weight}</span>
                </div>
                <button
                  onClick={() => deleteEdge(idx)}
                  disabled={isRunning}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Help Section */}
      {edges.length === 0 && (
        <Card className="p-4 bg-slate-900/30 border border-slate-700/30">
          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-2"><span className="text-base">💡</span> <strong>Format hỗ trợ:</strong> A B 5 | A,B,5 | A-B-5 | A|B|5</p>
            <p className="flex items-center gap-2"><span className="text-base">�</span> <strong>Paste:</strong> Copy nhiều dòng, dán vào, click Paste</p>
            <p className="flex items-center gap-2"><span className="text-base">⌨️</span> <strong>Enter:</strong> Thêm 1 cạnh hoặc paste</p>
          </div>
        </Card>
      )}
    </div>
  )
}
