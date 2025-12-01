"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Upload,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  BarChart3,
  Target,
  Zap,
} from "lucide-react"

type InsightCard = {
  id: number
  title: string
  type: "warning" | "success" | "info"
  message: string
  action?: string
  icon: typeof AlertTriangle
}

export default function BrainView() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [insights, setInsights] = useState<InsightCard[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const uploadFile = async (file: File) => {
    setIsProcessing(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch(`/api/brain/analyze`, { method: "POST", body: fd })
    if (!res.ok) {
      setIsProcessing(false)
      return
    }
    const json = await res.json()
    const icons = { warning: AlertTriangle, success: TrendingUp, info: BarChart3 } as const
    const mapped: InsightCard[] = (json.insights ?? []).map((i: any) => ({
      id: i.id,
      title: i.title,
      type: i.type,
      message: i.message,
      action: i.action,
      icon: icons[i.type as keyof typeof icons],
    }))
    setInsights(mapped)
    setIsProcessing(false)
    setFileUploaded(true)
  }

  const handleDrop = (file?: File) => {
    setIsDragging(false)
    if (file) uploadFile(file)
  }

  const handleAction = (action?: string) => {
    console.log(`Action: ${action}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F29F67] to-[#F29F67]/60 flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Strategy Lab</h1>
            <p className="text-muted-foreground">Upload data and get AI-powered insights</p>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#34B1AA]/20 border border-[#34B1AA]/30"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Sparkles className="w-4 h-4 text-[#34B1AA]" />
          <span className="text-sm text-[#34B1AA]">AI Active</span>
        </motion.div>
      </div>

      {/* Data Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <motion.div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files?.[0]
            if (f) handleDrop(f)
          }}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
            isDragging
              ? "border-[#F29F67] bg-[#F29F67]/10"
              : isProcessing
                ? "border-[#3B8FF3] bg-[#3B8FF3]/10"
                : fileUploaded
                  ? "border-[#34B1AA] bg-[#34B1AA]/10"
                  : "border-[#F29F67]/50 hover:border-[#F29F67] hover:bg-[#F29F67]/5"
          }`}
          whileHover={{ scale: isProcessing ? 1 : 1.01 }}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader2 className="w-12 h-12 text-[#3B8FF3]" />
                  </motion.div>
                  <span className="text-[#3B8FF3] font-medium">AI Processing Data...</span>
                </motion.div>
              ) : fileUploaded ? (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#34B1AA]" />
                  <span className="text-[#34B1AA] font-medium">Data Analyzed Successfully</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFileUploaded(false)
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Upload New File
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#F29F67]/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[#F29F67]" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium mb-1">Upload Shopee/Tokopedia Excel</p>
                    <p className="text-muted-foreground text-sm">Drag and drop or click to select file</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="w-4 h-4" /> .xlsx
                    </span>
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="w-4 h-4" /> .csv
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) uploadFile(f)
        }} />
      </motion.div>

      {/* Insight Cards - Buttons now inside each card at the bottom, horizontally aligned */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#F29F67]" />
          AI Insights
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className={`p-6 rounded-2xl backdrop-blur-md bg-card border transition-all duration-300 hover:scale-[1.02] flex flex-col ${
                insight.type === "warning"
                  ? "border-[#F29F67]/50 hover:border-[#F29F67]"
                  : insight.type === "success"
                    ? "border-[#34B1AA]/50 hover:border-[#34B1AA]"
                    : "border-[#3B8FF3]/50 hover:border-[#3B8FF3]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    insight.type === "warning"
                      ? "bg-[#F29F67]/20"
                      : insight.type === "success"
                        ? "bg-[#34B1AA]/20"
                        : "bg-[#3B8FF3]/20"
                  }`}
                >
                  <insight.icon
                    className={`w-5 h-5 ${
                      insight.type === "warning"
                        ? "text-[#F29F67]"
                        : insight.type === "success"
                          ? "text-[#34B1AA]"
                          : "text-[#3B8FF3]"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    insight.type === "warning"
                      ? "bg-[#F29F67]/20 text-[#F29F67]"
                      : insight.type === "success"
                        ? "bg-[#34B1AA]/20 text-[#34B1AA]"
                        : "bg-[#3B8FF3]/20 text-[#3B8FF3]"
                  }`}
                >
                  {insight.title}
                </span>
              </div>
              <p className="text-foreground/80 mb-4 flex-1">{insight.message}</p>
              {/* Button inside card */}
              <motion.button
                onClick={() => handleAction(insight.action)}
                className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  insight.type === "warning"
                    ? "bg-[#F29F67] text-white hover:bg-[#F29F67]/90"
                    : insight.type === "success"
                      ? "bg-[#34B1AA] text-white hover:bg-[#34B1AA]/90"
                      : "bg-[#3B8FF3] text-white hover:bg-[#3B8FF3]/90"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-4 h-4" />
                {insight.action ?? "View"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Data Points Analyzed", value: "24,847", icon: BarChart3 },
          { label: "Predictions Made", value: "156", icon: Target },
          { label: "Accuracy Rate", value: "94.2%", icon: CheckCircle2 },
          { label: "Active Customers", value: "1,247", icon: Users },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl backdrop-blur-md bg-card border border-border">
            <stat.icon className="w-5 h-5 text-[#F29F67] mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
