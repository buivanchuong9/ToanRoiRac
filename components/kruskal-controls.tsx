"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw, StepForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface KruskalControlsProps {
  edges: Array<{ source: string; target: string; weight: number }>
  isRunning: boolean
  onRunningChange: (running: boolean) => void
  onStep?: () => void
}

export default function KruskalControls({ edges, isRunning, onRunningChange, onStep }: KruskalControlsProps) {
  const [hasRun, setHasRun] = useState(false)

  const handlePlay = () => {
    onRunningChange(true)
    setHasRun(true)
  }

  const handlePause = () => {
    onRunningChange(false)
  }

  const handleReset = () => {
    onRunningChange(false)
    setHasRun(false)
  }

  const handleStep = () => {
    if (onStep) {
      onStep()
      setHasRun(true)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-white mb-4">Điều Khiển</h3>
      <div className="space-y-3">
        {!isRunning && !hasRun && (
          <>
            <Button onClick={handlePlay} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium">
              <Play className="w-4 h-4 mr-2" />
              Chạy Kruskal
            </Button>
            <Button onClick={handleStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <StepForward className="w-4 h-4 mr-2" />
              Từng Bước
            </Button>
          </>
        )}

        {isRunning && (
          <Button onClick={handlePause} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium">
            <Pause className="w-4 h-4 mr-2" />
            Tạm Dừng
          </Button>
        )}

        {!isRunning && hasRun && (
          <>
            <Button onClick={handlePlay} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium">
              <Play className="w-4 h-4 mr-2" />
              Tiếp Tục
            </Button>
            <Button onClick={handleStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <StepForward className="w-4 h-4 mr-2" />
              Từng Bước
            </Button>
          </>
        )}

        {hasRun && (
          <Button onClick={handleReset} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium">
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt Lại
          </Button>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-xs font-semibold text-white mb-3 uppercase">Thông Tin Thuật Toán</h4>
        <div className="space-y-2 text-xs text-slate-400">
          <p>
            <span className="text-slate-300">Thuật toán Kruskal</span> tìm cây khung nhỏ nhất bằng cách:
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-1">
            <li>Sắp xếp các cạnh theo trọng số</li>
            <li>Thêm cạnh nếu không tạo chu trình</li>
            <li>Dừng khi tất cả đỉnh được kết nối</li>
          </ol>
        </div>
      </div>
    </Card>
  )
}
