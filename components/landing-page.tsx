"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Brain,
  Cog,
  Globe2,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronDown,
  Package,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  Bot,
  ShoppingCart,
  BarChart3,
  Users,
  RotateCcw,
} from "lucide-react"
import dynamic from "next/dynamic"
const ThreeDCanvas = dynamic(() => import("./three-d-canvas"), { ssr: false })

interface LandingPageProps {
  onLaunchConsole: () => void
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 3 === 0 ? "#F29F67" : i % 3 === 1 ? "#34B1AA" : "#3B8FF3",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #F29F67 0%, transparent 70%)",
          top: "-200px",
          right: "-200px",
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #34B1AA 0%, transparent 70%)",
          bottom: "-150px",
          left: "-150px",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle, #3B8FF3 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}

function AnimatedHeadline() {
  const words = ["Commerce", "Business", "Growth", "Success"]
  const [currentWord, setCurrentWord] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary inline-block"
        >
          {words[currentWord]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

function FlippableFeatureCard({
  feature,
  idx,
}: {
  feature: {
    icon: typeof Brain
    title: string
    description: string
    color: string
    gradient: string
    simulation: { steps: { icon: typeof Bot; message: string; color: string }[] }
  }
  idx: number
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [simStep, setSimStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isFlipped || !isPlaying) return

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= feature.simulation.steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [isFlipped, isPlaying, feature.simulation.steps.length])

  const startSimulation = () => {
    setSimStep(0)
    setIsPlaying(true)
  }

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      setTimeout(() => startSimulation(), 400)
    } else {
      setIsFlipped(false)
      setSimStep(0)
      setIsPlaying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.15 }}
      className="relative h-[420px]"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card - Solid background */}
        <div
          className="absolute inset-0 p-8 rounded-3xl border border-border overflow-hidden group bg-card"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Gradient overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          <motion.div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: `${feature.color}15` }}
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
          </motion.div>

          <h3 className="relative text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
          <p className="relative text-muted-foreground leading-relaxed mb-6">{feature.description}</p>

          <motion.button
            onClick={handleFlip}
            className="relative mt-auto inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            style={{ color: feature.color, backgroundColor: `${feature.color}15` }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>See Simulation</span>
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Back of Card - Solid background, content stays upright */}
        <div
          className="absolute inset-0 rounded-3xl border border-border overflow-hidden bg-card"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative w-full h-full p-6 flex flex-col">
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34B1AA] animate-pulse" />
                <span className="text-xs text-[#34B1AA]">{feature.title}</span>
              </div>
            </div>

            {/* Simulation Steps */}
            <div className="space-y-3 flex-1 overflow-auto">
              <AnimatePresence mode="popLayout">
                {feature.simulation.steps.slice(0, simStep + 1).map((step, stepIdx) => (
                  <motion.div
                    key={stepIdx}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${step.color}20` }}
                    >
                      <step.icon className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                    <p className="text-sm text-foreground/80 pt-1.5 leading-relaxed">{step.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Progress & Controls */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs" style={{ color: feature.color }}>
                  {Math.round(((simStep + 1) / feature.simulation.steps.length) * 100)}%
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: feature.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((simStep + 1) / feature.simulation.steps.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={startSimulation}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors text-foreground"
                  whileTap={{ scale: 0.95 }}
                >
                  Replay
                </motion.button>
                <motion.button
                  onClick={handleFlip}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SystemSimulation() {
  const [activeDemo, setActiveDemo] = useState<"stock" | "pricing" | "expansion">("stock")
  const [simStep, setSimStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const stockSimulation = [
    {
      type: "alert",
      icon: AlertTriangle,
      message: "Stock level critical: Wireless Earbuds (SKU-2847)",
      color: "#F29F67",
    },
    { type: "ai", icon: Bot, message: "AI analyzing supplier options...", color: "#3B8FF3" },
    { type: "action", icon: Send, message: "Auto-message sent to Vendor: PT Elektronik Jaya", color: "#34B1AA" },
    {
      type: "response",
      icon: MessageSquare,
      message: "Vendor confirmed: 500 units arriving in 2 days",
      color: "#34B1AA",
    },
    {
      type: "success",
      icon: CheckCircle2,
      message: "Inventory replenishment scheduled successfully",
      color: "#34B1AA",
    },
  ]

  const pricingSimulation = [
    {
      type: "alert",
      icon: BarChart3,
      message: "Competitor price drop detected: -15% on similar products",
      color: "#F29F67",
    },
    { type: "ai", icon: Bot, message: "AI calculating optimal price strategy...", color: "#3B8FF3" },
    {
      type: "action",
      icon: TrendingUp,
      message: "Dynamic pricing adjusted: -8% (maintaining 22% margin)",
      color: "#34B1AA",
    },
    {
      type: "response",
      icon: ShoppingCart,
      message: "Sales velocity increased by 34% in last 2 hours",
      color: "#34B1AA",
    },
    {
      type: "success",
      icon: CheckCircle2,
      message: "Revenue optimized: +$2,847 additional profit today",
      color: "#34B1AA",
    },
  ]

  const expansionSimulation = [
    { type: "alert", icon: Globe2, message: "High demand detected in Vietnam market", color: "#F29F67" },
    { type: "ai", icon: Bot, message: "AI analyzing market entry requirements...", color: "#3B8FF3" },
    { type: "action", icon: Users, message: "Auto-localizing product listings to Vietnamese", color: "#34B1AA" },
    {
      type: "response",
      icon: Package,
      message: "Cross-border logistics partner connected: VN Express",
      color: "#34B1AA",
    },
    {
      type: "success",
      icon: CheckCircle2,
      message: "Vietnam storefront live! First orders incoming...",
      color: "#34B1AA",
    },
  ]

  const simulations = {
    stock: stockSimulation,
    pricing: pricingSimulation,
    expansion: expansionSimulation,
  }

  const currentSim = simulations[activeDemo]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= currentSim.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [activeDemo, isPlaying, currentSim.length])

  useEffect(() => {
    setSimStep(0)
  }, [activeDemo])

  const demos = [
    { id: "stock" as const, label: "Auto Restock", icon: Package },
    { id: "pricing" as const, label: "Smart Pricing", icon: TrendingUp },
    { id: "expansion" as const, label: "Market Entry", icon: Globe2 },
  ]

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-block px-4 py-2 rounded-full bg-[#34B1AA]/10 text-[#34B1AA] text-sm font-medium mb-6"
          >
            Live Simulation
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-foreground">
            See A.R.U.S.
            <br />
            <span className="text-[#34B1AA]">In Action</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch how our AI-powered system automates critical business operations in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {demos.map((demo) => (
                <motion.button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(demo.id)
                    setIsPlaying(true)
                  }}
                  className={`w-full p-6 rounded-2xl border transition-all duration-300 text-left ${
                    activeDemo === demo.id
                      ? "bg-gradient-to-r from-[#F29F67]/20 to-[#34B1AA]/10 border-[#F29F67]/50"
                      : "bg-card border-border hover:bg-muted"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeDemo === demo.id ? "bg-[#F29F67]" : "bg-muted"
                      }`}
                    >
                      <demo.icon className={`w-6 h-6 ${activeDemo === demo.id ? "text-white" : "text-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{demo.label}</h3>
                      <p className="text-muted-foreground text-sm">
                        {demo.id === "stock" && "Automated vendor communication"}
                        {demo.id === "pricing" && "AI-driven price optimization"}
                        {demo.id === "expansion" && "Cross-border market automation"}
                      </p>
                    </div>
                    {activeDemo === demo.id && (
                      <motion.div layoutId="activeDot" className="ml-auto w-3 h-3 rounded-full bg-[#34B1AA]" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-muted border border-border text-sm font-medium hover:bg-muted/80 transition-colors text-foreground"
              >
                {isPlaying ? "Pause" : "Play"} Simulation
              </button>
              <button
                onClick={() => setSimStep(0)}
                className="px-4 py-2 rounded-xl bg-muted border border-border text-sm font-medium hover:bg-muted/80 transition-colors text-foreground"
              >
                Restart
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden border border-border bg-card backdrop-blur-xl">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#3B8FF3]" />
                  <span className="text-sm text-muted-foreground">A.R.U.S. Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#34B1AA] animate-pulse" />
                  <span className="text-xs text-[#34B1AA]">LIVE</span>
                </div>
              </div>

              <div className="p-6 min-h-[400px] space-y-4">
                <AnimatePresence mode="popLayout">
                  {currentSim.slice(0, simStep + 1).map((step, idx) => (
                    <motion.div
                      key={`${activeDemo}-${idx}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex items-start gap-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <step.icon className="w-5 h-5" style={{ color: step.color }} />
                      </motion.div>
                      <div className="flex-1 pt-2">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-foreground/90 text-sm leading-relaxed"
                        >
                          {step.message}
                        </motion.p>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs text-muted-foreground mt-1 block"
                        >
                          {new Date().toLocaleTimeString()} - Step {idx + 1}/{currentSim.length}
                        </motion.span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="pt-6 border-t border-border mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs text-[#34B1AA]">
                      {Math.round(((simStep + 1) / currentSim.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#F29F67] to-[#34B1AA]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((simStep + 1) / currentSim.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-[#34B1AA] text-white text-sm font-medium shadow-lg shadow-[#34B1AA]/25"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Automated
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage({ onLaunchConsole }: LandingPageProps) {
  const containerRef = useRef(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20)
  }

  const features = [
    {
      icon: Brain,
      title: "AI Decision Brain",
      description: "Real-time market insights and predictive analytics powered by advanced neural networks",
      color: "#F29F67",
      gradient: "from-[#F29F67]/20 to-transparent",
      simulation: {
        steps: [
          { icon: BarChart3, message: "Analyzing 24,847 data points from your store...", color: "#3B8FF3" },
          { icon: Bot, message: "AI detected: 15 customers at churn risk", color: "#F29F67" },
          { icon: TrendingUp, message: "Recommending: 10% weekend discount on Kopi", color: "#34B1AA" },
          { icon: CheckCircle2, message: "Promo campaign auto-scheduled for Saturday", color: "#34B1AA" },
        ],
      },
    },
    {
      icon: Cog,
      title: "Auto-Ops Engine",
      description: "Intelligent automation for inventory, pricing, and customer engagement workflows",
      color: "#34B1AA",
      gradient: "from-[#34B1AA]/20 to-transparent",
      simulation: {
        steps: [
          { icon: AlertTriangle, message: "Stock alert: Wireless Earbuds < 10 units", color: "#F29F67" },
          { icon: Send, message: "Auto-message sent to PT Elektronik Jaya", color: "#3B8FF3" },
          { icon: MessageSquare, message: "Vendor reply: 500 units in 2 days", color: "#34B1AA" },
          { icon: CheckCircle2, message: "Purchase order confirmed automatically", color: "#34B1AA" },
        ],
      },
    },
    {
      icon: Globe2,
      title: "Market Expansion",
      description: "Seamless ASEAN market entry with localization and regulatory compliance automation",
      color: "#3B8FF3",
      gradient: "from-[#3B8FF3]/20 to-transparent",
      simulation: {
        steps: [
          { icon: Globe2, message: "Demand spike detected in Vietnam", color: "#F29F67" },
          { icon: Bot, message: "Auto-translating 47 product listings...", color: "#3B8FF3" },
          { icon: Package, message: "VN Express logistics connected", color: "#34B1AA" },
          { icon: CheckCircle2, message: "Vietnam store LIVE - first order received!", color: "#34B1AA" },
        ],
      },
    },
  ]

  const stats = [
    { value: 10000, suffix: "+", label: "Active SMEs" },
    { value: 99.9, suffix: "%", label: "Uptime" },
    { value: 150, suffix: "M+", label: "Transactions" },
    { value: 10, suffix: "", label: "ASEAN Countries" },
  ]

  return (
    <div
      ref={containerRef}
      className="w-full bg-background text-foreground overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <FloatingParticles />
      <GradientOrbs />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
      >
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F29F67] to-[#34B1AA] flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">A.R.U.S.</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#simulation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
            <a href="#cta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Get Started
            </a>
          </div>
          <motion.button
            onClick={onLaunchConsole}
            className="px-5 py-2.5 bg-gradient-to-r from-[#F29F67] to-[#F29F67]/80 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-[#F29F67]/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch Console
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#34B1AA] animate-pulse" />
                <span className="text-sm text-foreground/80">AI-Powered SaaS Platform</span>
              </motion.div>

              <div>
                <motion.h1
                  className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  The Future of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F29F67] via-[#34B1AA] to-[#3B8FF3]">
                    ASEAN <AnimatedHeadline />
                  </span>
                </motion.h1>
                <motion.p
                  className="text-xl text-muted-foreground max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Automated Resource & Unified Strategy — empowering modern SMEs with AI-driven operations, analytics,
                  and market expansion tools.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  onClick={onLaunchConsole}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F29F67] to-[#F29F67]/90 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-[#F29F67]/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Launch Console</span>
                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-2xl hover:bg-muted transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-5 h-5 text-[#34B1AA]" />
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-8 border-t border-border"
              >
                <p className="text-sm text-muted-foreground mb-4">Trusted by leading SMEs across</p>
                <div className="flex items-center gap-6">
                  {["Indonesia", "Malaysia", "Singapore", "Thailand", "Vietnam"].map((country, i) => (
                    <motion.span
                      key={country}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      className="text-sm font-medium text-muted-foreground"
                    >
                      {country}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right: 3D Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{ x, y }}
              className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#F29F67]/20 via-[#34B1AA]/10 to-[#3B8FF3]/20 blur-3xl rounded-full scale-75" />

              <motion.div
                className="absolute inset-[15%] border border-[#F29F67]/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[20%] border border-[#34B1AA]/15 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[25%] border border-[#3B8FF3]/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              <div className="absolute inset-[10%]">
                <ThreeDCanvas />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 relative">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F29F67] to-[#34B1AA]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 rounded-full bg-[#3B8FF3]/10 text-[#3B8FF3] text-sm font-medium mb-6"
            >
              Core Features
            </motion.span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Intelligent Operations
              <br />
              <span className="text-muted-foreground">for Modern SMEs</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three powerful pillars designed to automate, optimize, and scale your business across ASEAN markets.
              <br />
              <span className="text-[#F29F67]">Click "See Simulation" to watch each feature in action.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <FlippableFeatureCard key={idx} feature={feature} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      <div id="simulation">
        <SystemSimulation />
      </div>

      {/* CTA Section */}
      <section id="cta" className="py-32 px-6 relative">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#F29F67]/20 via-[#34B1AA]/10 to-[#3B8FF3]/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute inset-0 rounded-[2.5rem] border border-border" />

            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#F29F67] to-[#34B1AA] flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to Transform
                <br />
                Your Business?
              </h2>
              <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">
                Join 10,000+ SMEs across ASEAN already using A.R.U.S. to automate operations and scale globally.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={onLaunchConsole}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-2xl hover:bg-muted transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Sales
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F29F67] to-[#34B1AA] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">A.R.U.S.</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2025 A.R.U.S. All rights reserved. Built for ASEAN SMEs.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
