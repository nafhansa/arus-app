"use client"

import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ShoppingCart, TrendingUp, Globe } from "lucide-react"
import { useDashboardData } from "@/lib/hooks"

const channels = [
  { name: "Shopee", icon: "🛒" },
  { name: "Tokopedia", icon: "🏪" },
  { name: "Lazada", icon: "📦" },
  { name: "TikTok Shop", icon: "📱" },
]

export default function DashboardContent() {
  const { data } = useDashboardData()
  const revenueData = (data?.revenue ?? []).map((r) => ({ month: r.month, revenue: r.revenue }))
  const activityLog = data?.activity ?? []
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Profit</p>
              <p className="text-3xl font-bold text-secondary">$127,450</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Orders This Month</p>
              <p className="text-3xl font-bold text-accent">1,284</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Active Channels</p>
              <p className="text-3xl font-bold text-primary">{channels.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Large */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)]"
        >
          <h3 className="text-lg font-bold mb-4 text-foreground">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F29F67" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F29F67" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground" tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis className="text-muted-foreground" tick={{ fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-medium)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#F29F67"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Log - Tall */}
        <motion.div
          variants={itemVariants}
          className="bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)]"
        >
          <h3 className="text-lg font-bold mb-4 text-foreground">AI Activity Log</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-muted/50 border border-border text-sm hover:bg-muted transition-colors"
              >
                <p className="font-medium text-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{typeof log.time === "string" ? log.time : new Date(log.time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Channels & Expansion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Channels */}
        <motion.div
          variants={itemVariants}
          className="bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)]"
        >
          <h3 className="text-lg font-bold mb-4 text-foreground">Active Channels</h3>
          <div className="grid grid-cols-2 gap-3">
            {channels.map((channel, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-muted/50 border border-border text-center hover:bg-muted hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">{channel.icon}</div>
                <p className="text-xs font-medium text-foreground">{channel.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expansion Radar */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-soft)]"
        >
          <h3 className="text-lg font-bold mb-4 text-foreground">Market Expansion Radar</h3>
          <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
            <div className="inline-block">
              <div className="relative w-40 h-40">
                {/* Radar circles */}
                <div className="absolute inset-0 border-2 border-border rounded-full" />
                <div className="absolute inset-4 border border-border rounded-full" />
                <div className="absolute inset-8 border border-border rounded-full" />

                {/* Marker points with shadows */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-md" />
                <div className="absolute bottom-6 right-6 w-3 h-3 bg-secondary rounded-full shadow-md" />
                <div className="absolute bottom-6 left-6 w-3 h-3 bg-accent rounded-full shadow-md" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-6">
              Analyzing expansion opportunities across ASEAN markets...
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
