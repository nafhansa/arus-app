"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Database,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Plus,
  Trash2,
  Save,
  Loader2,
  Check,
  Store,
  Calendar,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface RevenueData {
  id?: number
  month: string
  year: number
  revenue: number
  cost: number
  orders: number
}

interface SalesChannel {
  id: number
  name: string
  icon: string
  enabled: boolean
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const CHANNEL_ICONS = ["🛒", "🏪", "📦", "📱", "💻", "🌐", "🏬", "🛍️"]

export default function BusinessDataView() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"revenue" | "channels">("revenue")
  const [year, setYear] = useState(new Date().getFullYear())
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [channels, setChannels] = useState<SalesChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelIcon, setNewChannelIcon] = useState("🛒")

  // Fetch data
  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [revenueRes, channelsRes] = await Promise.all([
          fetch(`/api/business/revenue?year=${year}`),
          fetch("/api/business/channels"),
        ])

        if (revenueRes.ok) {
          const data = await revenueRes.json()
          // Initialize all months
          const monthData: RevenueData[] = MONTHS.map((month) => {
            const existing = data.revenues?.find((r: RevenueData) => r.month === month && r.year === year)
            return existing || { month, year, revenue: 0, cost: 0, orders: 0 }
          })
          setRevenueData(monthData)
        }

        if (channelsRes.ok) {
          const data = await channelsRes.json()
          setChannels(data.channels || [])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, year])

  const updateRevenueField = (month: string, field: "revenue" | "cost" | "orders", value: number) => {
    setRevenueData((prev) =>
      prev.map((r) => (r.month === month ? { ...r, [field]: value } : r))
    )
  }

  const saveRevenue = async (monthData: RevenueData) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/business/revenue", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monthData),
      })

      if (res.ok) {
        setSaveMessage({ type: "success", text: `${monthData.month} data saved!` })
      } else {
        setSaveMessage({ type: "error", text: "Failed to save" })
      }
    } catch {
      setSaveMessage({ type: "error", text: "Network error" })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 2000)
    }
  }

  const addChannel = async () => {
    if (!newChannelName.trim()) return

    try {
      const res = await fetch("/api/business/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newChannelName, icon: newChannelIcon }),
      })

      if (res.ok) {
        const data = await res.json()
        setChannels((prev) => [...prev, data.channel])
        setNewChannelName("")
        setSaveMessage({ type: "success", text: "Channel added!" })
        setTimeout(() => setSaveMessage(null), 2000)
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to add channel" })
    }
  }

  const toggleChannel = async (id: number, enabled: boolean) => {
    try {
      await fetch("/api/business/channels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled: !enabled }),
      })
      setChannels((prev) =>
        prev.map((c) => (c.id === id ? { ...c, enabled: !enabled } : c))
      )
    } catch {
      console.error("Failed to toggle channel")
    }
  }

  const deleteChannel = async (id: number) => {
    try {
      await fetch(`/api/business/channels?id=${id}`, { method: "DELETE" })
      setChannels((prev) => prev.filter((c) => c.id !== id))
    } catch {
      console.error("Failed to delete channel")
    }
  }

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0)
  const totalCost = revenueData.reduce((sum, r) => sum + r.cost, 0)
  const totalOrders = revenueData.reduce((sum, r) => sum + r.orders, 0)
  const totalProfit = totalRevenue - totalCost

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B8FF3] to-[#34B1AA] flex items-center justify-center shadow-lg">
            <Database className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Data</h1>
            <p className="text-muted-foreground">Manage your revenue, costs, and sales channels</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#34B1AA]" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-[#34B1AA]">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#F29F67]" />
            <span className="text-sm text-muted-foreground">Total Profit</span>
          </div>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-[#34B1AA]" : "text-destructive"}`}>
            ${totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-[#3B8FF3]" />
            <span className="text-sm text-muted-foreground">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-[#3B8FF3]">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-[#F29F67]" />
            <span className="text-sm text-muted-foreground">Active Channels</span>
          </div>
          <p className="text-2xl font-bold text-[#F29F67]">
            {channels.filter((c) => c.enabled).length}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: "revenue", label: "Revenue & Orders", icon: DollarSign },
          { id: "channels", label: "Sales Channels", icon: Store },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "revenue" | "channels")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Save Message */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-lg ${
              saveMessage.type === "success"
                ? "bg-[#34B1AA]/20 text-[#34B1AA]"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            {saveMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Year Selector */}
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="px-4 py-2 rounded-lg bg-input border border-border"
                >
                  {[2023, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly Data Grid */}
              <div className="grid gap-4">
                {revenueData.map((monthData) => (
                  <motion.div
                    key={monthData.month}
                    className="p-4 rounded-xl bg-card border border-border"
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="w-16 font-semibold text-foreground">{monthData.month}</div>
                      
                      <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-muted-foreground">Revenue ($)</label>
                        <input
                          type="number"
                          value={monthData.revenue || ""}
                          onChange={(e) => updateRevenueField(monthData.month, "revenue", Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-muted-foreground">Cost ($)</label>
                        <input
                          type="number"
                          value={monthData.cost || ""}
                          onChange={(e) => updateRevenueField(monthData.month, "cost", Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-muted-foreground">Orders</label>
                        <input
                          type="number"
                          value={monthData.orders || ""}
                          onChange={(e) => updateRevenueField(monthData.month, "orders", Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div className="w-24 text-right">
                        <label className="text-xs text-muted-foreground">Profit</label>
                        <p className={`font-semibold ${monthData.revenue - monthData.cost >= 0 ? "text-[#34B1AA]" : "text-destructive"}`}>
                          ${(monthData.revenue - monthData.cost).toLocaleString()}
                        </p>
                      </div>

                      <motion.button
                        onClick={() => saveRevenue(monthData)}
                        disabled={isSaving}
                        className="p-2 rounded-lg bg-primary text-primary-foreground"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Channels Tab */}
          {activeTab === "channels" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Add New Channel */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-4">Add Sales Channel</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="flex gap-2">
                    {CHANNEL_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewChannelIcon(icon)}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                          newChannelIcon === icon
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Channel name (e.g., Shopee, Tokopedia)"
                    className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-input border border-border"
                  />
                  <motion.button
                    onClick={addChannel}
                    disabled={!newChannelName.trim()}
                    className="px-4 py-2 rounded-lg bg-[#34B1AA] text-white flex items-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Channel
                  </motion.button>
                </div>
              </div>

              {/* Channel List */}
              <div className="space-y-3">
                {channels.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No sales channels yet. Add your first channel above!</p>
                  </div>
                ) : (
                  channels.map((channel) => (
                    <motion.div
                      key={channel.id}
                      className={`p-4 rounded-xl border transition-all ${
                        channel.enabled
                          ? "bg-card border-[#34B1AA]/30"
                          : "bg-muted/50 border-border"
                      }`}
                      layout
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{channel.icon}</span>
                          <div>
                            <p className={`font-medium ${channel.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                              {channel.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {channel.enabled ? "Active" : "Disabled"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => toggleChannel(channel.id, channel.enabled)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              channel.enabled ? "bg-[#34B1AA]" : "bg-muted"
                            }`}
                          >
                            <motion.div
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                              animate={{ left: channel.enabled ? "calc(100% - 22px)" : "2px" }}
                            />
                          </motion.button>
                          <motion.button
                            onClick={() => deleteChannel(channel.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
