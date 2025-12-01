"use client"

import { useState } from "react"
import { useAutomations } from "@/lib/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, MessageSquare, Package, TrendingDown, Bell, Clock, ShoppingCart, Truck, DollarSign, Mail, Calendar, Settings, X, Save, Sliders } from "lucide-react"

type AutomationConfig = {
  threshold?: number
  delay?: number
  message?: string
  channels?: string[]
  frequency?: string
}

type UIRecipe = {
  id: number
  title: string
  enabled: boolean
  category: string
  config: AutomationConfig
  icon: typeof MessageSquare
  description?: string
}

export default function OpsView() {
  const { recipes: dbRecipes, updateAutomation } = useAutomations()
  const [configModalOpen, setConfigModalOpen] = useState<number | null>(null)
  const [tempConfig, setTempConfig] = useState<AutomationConfig>({})

  const iconFor = (category: string, title: string) => {
    const key = `${category}:${title}`.toLowerCase()
    if (key.includes("whatsapp") || key.includes("message")) return MessageSquare
    if (key.includes("stock")) return Package
    if (key.includes("traffic") || key.includes("flash")) return TrendingDown
    if (key.includes("order")) return ShoppingCart
    if (key.includes("ship")) return Truck
    if (key.includes("price")) return DollarSign
    if (key.includes("report")) return Mail
    if (key.includes("restock") || key.includes("schedule")) return Calendar
    return Settings
  }

  const recipes: UIRecipe[] = (dbRecipes || []).map((r) => ({
    id: r.id,
    title: r.title,
    enabled: r.enabled,
    category: r.category,
    config: r.config as AutomationConfig,
    icon: iconFor(r.category, r.title),
    description: undefined,
  }))

  const toggleRecipe = async (id: number, enabled: boolean) => {
    await updateAutomation(id, { enabled: !enabled })
  }

  const openConfigModal = (recipe: UIRecipe) => {
    setTempConfig(recipe.config)
    setConfigModalOpen(recipe.id)
  }

  const saveConfig = async () => {
    if (configModalOpen !== null) {
      await updateAutomation(configModalOpen, { config: tempConfig })
      setConfigModalOpen(null)
    }
  }

  const categories = [...new Set(recipes.map((r) => r.category))]
  const activeCount = recipes.filter((r) => r.enabled).length

  const currentRecipe = recipes.find((r) => r.id === configModalOpen)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Smart Automations</h1>
            <p className="text-muted-foreground">Configure your business autopilot</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
            <span className="text-secondary font-bold">{activeCount}</span>
            <span className="text-muted-foreground ml-1">/ {recipes.length} Active</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Tasks Automated Today", value: "247", color: "#F29F67" },
          { label: "Time Saved", value: "12.5h", color: "#34B1AA" },
          { label: "Messages Sent", value: "89", color: "#3B8FF3" },
          { label: "Alerts Triggered", value: "14", color: "#F29F67" },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-card border border-border shadow-[var(--shadow-soft)]">
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Automation Recipes */}
      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + catIdx * 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {category}
            </h3>
            <div className="space-y-2">
              {recipes
                .filter((r) => r.category === category)
                .map((recipe, idx) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      recipe.enabled
                        ? "bg-secondary/5 border-secondary/30 shadow-sm"
                        : "bg-card border-border hover:bg-muted/50 shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            recipe.enabled ? "bg-secondary/20" : "bg-muted"
                          }`}
                        >
                          <recipe.icon
                            className={`w-6 h-6 ${recipe.enabled ? "text-secondary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <h4 className={`font-medium ${recipe.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                            {recipe.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{recipe.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Config Button */}
                        <motion.button
                          onClick={() => openConfigModal(recipe)}
                          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Sliders className="w-5 h-5 text-muted-foreground" />
                        </motion.button>

                        {/* Toggle Switch */}
                        <motion.button
                          onClick={() => toggleRecipe(recipe.id, recipe.enabled)}
                          className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                            recipe.enabled ? "bg-secondary" : "bg-muted"
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            layout
                            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                            animate={{
                              left: recipe.enabled ? "calc(100% - 28px)" : "4px",
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded details when enabled */}
                    <AnimatePresence>
                      {recipe.enabled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-secondary/20 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-secondary">
                              <Bell className="w-4 h-4" />
                              <span>Active</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>Last triggered: 2 hours ago</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {configModalOpen !== null && currentRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfigModalOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-strong)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <currentRecipe.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Configure Automation</h3>
                    <p className="text-sm text-muted-foreground">{currentRecipe.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfigModalOpen(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Config Fields */}
              <div className="space-y-4">
                {tempConfig.threshold !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Threshold</label>
                    <input
                      type="number"
                      value={tempConfig.threshold}
                      onChange={(e) => setTempConfig({ ...tempConfig, threshold: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {tempConfig.delay !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Delay (minutes)</label>
                    <input
                      type="number"
                      value={tempConfig.delay}
                      onChange={(e) => setTempConfig({ ...tempConfig, delay: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {tempConfig.message !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Message Template</label>
                    <textarea
                      value={tempConfig.message}
                      onChange={(e) => setTempConfig({ ...tempConfig, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all resize-none"
                    />
                  </div>
                )}

                {tempConfig.channels !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Notification Channels</label>
                    <div className="flex flex-wrap gap-2">
                      {["email", "sms", "whatsapp", "push"].map((channel) => (
                        <button
                          key={channel}
                          onClick={() => {
                            const channels = tempConfig.channels || []
                            if (channels.includes(channel)) {
                              setTempConfig({ ...tempConfig, channels: channels.filter((c) => c !== channel) })
                            } else {
                              setTempConfig({ ...tempConfig, channels: [...channels, channel] })
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                            tempConfig.channels?.includes(channel)
                              ? "bg-secondary text-white shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {channel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tempConfig.frequency !== undefined && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Frequency</label>
                    <input
                      type="text"
                      value={tempConfig.frequency}
                      onChange={(e) => setTempConfig({ ...tempConfig, frequency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setConfigModalOpen(null)}
                  className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-medium text-foreground"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={saveConfig}
                  className="flex-1 py-3 rounded-xl bg-secondary hover:bg-secondary/90 transition-colors font-medium text-white flex items-center justify-center gap-2 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
