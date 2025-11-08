"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onUpload: (edges: Array<{ source: string; target: string; weight: number }>) => void
  onError: (error: string) => void
}

export default function FileUploader({ onUpload, onError }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [warning, setWarning] = useState<string>("")

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setWarning("")

    try {
      // Dynamic import xlsx
      const XLSX = await import("xlsx")

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "binary" })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          
          // Convert to CSV first to ensure all rows are read
          const csv = XLSX.utils.sheet_to_csv(worksheet)
          const lines = csv.split("\n").filter((line) => line.trim())
          
          if (lines.length < 2) {
            throw new Error("File Excel không có dữ liệu")
          }

          // Parse headers
          const headers = lines[0].split(",").map((h) => h.trim())
          console.log("[v0] Headers:", headers)

          const edges: Array<{ source: string; target: string; weight: number }> = []
          let skippedRows = 0

          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim())

            let source = ""
            let target = ""
            let weight = 0

            // Use first 3 columns directly
            if (values.length >= 3) {
              source = String(values[0] || "").toUpperCase()
              target = String(values[1] || "").toUpperCase()
              weight = Number.parseFloat(values[2])
            }

            console.log(`[v0] Row ${i}:`, { source, target, weight })

            // Skip completely empty rows
            if (!source && !target && !weight) {
              console.log(`[v0] Skipping empty row ${i}`)
              skippedRows++
              continue
            }

            // Skip invalid rows
            if (!source || !target || isNaN(weight) || weight <= 0) {
              console.log(`[v0] Skipping invalid row ${i}:`, { source, target, weight })
              skippedRows++
              continue
            }

            // Check for duplicates (undirected)
            const isDuplicate = edges.some(
              (e) =>
                (e.source === source && e.target === target) ||
                (e.source === target && e.target === source)
            )

            if (!isDuplicate) {
              edges.push({ source, target, weight })
            }
          }

          if (edges.length === 0) {
            throw new Error(
              "Không tìm thấy cạnh hợp lệ trong file. Vui lòng thêm ít nhất một dòng dữ liệu với tên đỉnh và trọng số hợp lệ.",
            )
          }

          if (skippedRows > 0) {
            setWarning(`⚠️ Bỏ qua ${skippedRows} dòng không hợp lệ. Sử dụng ${edges.length} cạnh hợp lệ.`)
          }

          console.log("[v0] Successfully parsed edges:", edges)
          onUpload(edges)
        } catch (err) {
          console.error("[v0] Error parsing file:", err)
          onError(err instanceof Error ? err.message : "Lỗi khi phân tích file")
        }
      }
      reader.readAsBinaryString(file)
    } catch (err) {
      console.error("[v0] Error loading xlsx:", err)
      onError("Lỗi khi tải thư viện xlsx")
    }
  }

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        <Upload className="w-4 h-4 mr-2" />
        Tải File Excel
      </Button>
      <p className="text-xs text-slate-400">
        Định dạng: 3 cột với tên đỉnh và trọng số. Hỗ trợ: "Đỉnh 1/2", "Node 1/2", "Weight", "Trọng số", v.v.
      </p>
      {warning && (
        <div className="flex items-start gap-2 p-2 bg-yellow-900/30 border border-yellow-700/50 rounded text-yellow-200 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  )
}
