"use client"

import { Slider } from "@/components/ui/slider"

interface SpeedControlProps {
  speed: number
  onSpeedChange: (speed: number) => void
  isRunning: boolean
}

export default function SpeedControl({ speed, onSpeedChange, isRunning }: SpeedControlProps) {
  const speedLabels: Record<number, string> = {
    0.25: "0.25x",
    0.5: "0.5x",
    1: "1x",
    1.5: "1.5x",
    2: "2x",
  }

  const getSpeedLabel = (value: number) => {
    const closest = Object.keys(speedLabels)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev))
    return speedLabels[closest]
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-white">Tốc Độ Hoạt Hình</label>
        <span className="text-lg font-bold text-blue-400">{getSpeedLabel(speed)}</span>
      </div>
      <Slider
        value={[speed]}
        onValueChange={(value) => onSpeedChange(value[0])}
        min={0.25}
        max={2}
        step={0.05}
        disabled={!isRunning}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>0.25x</span>
        <span>1x</span>
        <span>2x</span>
      </div>
    </div>
  )
}
