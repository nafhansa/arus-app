"use client"

import { useState, useEffect } from "react"
import { useAutomations } from "@/lib/hooks"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  MessageSquare,
  Package,
  TrendingDown,
  Bell,
  Clock,
  ShoppingCart,
  Truck,
  DollarSign,
  Mail,
  Calendar,
  Settings,
  X,
  Save,
  Sliders,
  Link2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type AutomationConfig = {
  threshold?: number
  delay?: number
  message?: string
  channels?: string[]
  frequency?: string
  integrationId?: number
  triggerOn?: string
  recipients?: string
  schedule?: string
}

type Integration = {
  id: number
  provider: string
  name: string
  isActive: boolean
}

type UIRecipe = {
  id: number
  title: string
  description?: string
  enabled: boolean
  category: string
  config: AutomationConfig
  integrationId?: number
  icon: typeof MessageSquare
}

// Automation templates with descriptions
const AUTOMATION_TEMPLATES: Record<string, {
  description: string
  configFields: string[]
  requiredIntegration?: string[]
}> = {
  "Auto-Reply WhatsApp": {
    description: "Automatically reply to incoming WhatsApp messages",
    configFields: ["message", "delay", "integrationId"],
    requiredIntegration: ["whatsapp"],
  },
  "Low Stock Alert": {
    description: "Get notified when inventory drops below threshold",
    configFields: ["threshold", "channels", "recipients"],
    requiredIntegration: ["email", "whatsapp", "telegram"],
  },
  "Flash Sale Trigger": {
    description: "Automatically start flash sale on low traffic",
    configFields: ["threshold", "delay", "channels"],
  },
  "Order Confirmation SMS": {
    description: "Send SMS confirmation for new orders",
    configFields: ["message", "integrationId"],
    requiredIntegration: ["sms"],
  },
  "Shipping Status Updates": {
    description: "Notify customers about shipping status changes",
    configFields: ["channels", "frequency", "integrationId"],
    requiredIntegration: ["email", "whatsapp", "sms"],
  },
  "Daily Sales Report": {
    description: "Receive daily sales summary via email",
    configFields: ["schedule", "recipients", "integrationId"],
    requiredIntegration: ["email"],
  },
  "Price Drop Alert": {
    description: "Notify when competitor prices change",
    configFields: ["threshold", "channels", "frequency"],
  },
  "Restock Reminder": {
    description: "Automated reminders to restock products",
    configFields: ["threshold", "schedule", "channels"],
  },
}

export default function OpsView() {
  const { user } = useAuth()
  const { recipes: dbRecipes, updateAutomation } = useAutomations()
  const [configModalOpen, setConfigModalOpen] = useState<number | null>(null)
  const [tempConfig, setTempConfig] = useState<AutomationConfig>({})
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch integrations
  useEffect(() => {
    if (!user) return

    const fetchIntegrations = async () => {
      try {
        const res = await fetch("/api/integrations")
        if (res.ok) {
          const data = await res.json()
          setIntegrations(data.integrations || [])
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error)
      } finally {
        setIsLoadingIntegrations(false)
      }
    }

    fetchIntegrations()
  }, [user])

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
    description: AUTOMATION_TEMPLATES[r.title]?.description,
    integrationId: (r.config as AutomationConfig)?.integrationId,
  }))

  // Check if required integration is connected
  const hasRequiredIntegration = (recipe: UIRecipe) => {
    const template = AUTOMATION_TEMPLATES[recipe.title]
    if (!template?.requiredIntegration) return true
    return template.requiredIntegration.some((type) =>
      integrations.some((i) => i.provider.toLowerCase() === type && i.isActive)
    )
  }

  const connectedIntegrations = integrations.filter((i) => i.isActive)

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
  const currentTemplate = currentRecipe ? AUTOMATION_TEMPLATES[currentRecipe.title] : null

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

      {/* Integration Warning */}
      {connectedIntegrations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#F29F67]/10 border border-[#F29F67]/30 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F29F67]/20 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-5 h-5 text-[#F29F67]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">No Integrations Connected</p>
            <p className="text-sm text-muted-foreground mt-1">
              To enable automations like WhatsApp auto-reply or Email notifications, you need to connect your accounts first.
            </p>
            <p className="text-sm text-[#F29F67] mt-2">
              Go to <strong>Integrations</strong> in the sidebar to connect WhatsApp, Email, SMS, and more.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Active Automations", value: activeCount.toString(), color: "#F29F67" },
          { label: "Connected Integrations", value: connectedIntegrations.length.toString(), color: "#34B1AA" },
          { label: "Tasks Today", value: "—", color: "#3B8FF3" },
          { label: "Messages Sent", value: "—", color: "#F29F67" },
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
                .map((recipe, idx) => {
                  const needsIntegration = !hasRequiredIntegration(recipe)
                  const template = AUTOMATION_TEMPLATES[recipe.title]

                  return (
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
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${recipe.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                                {recipe.title}
                              </h4>
                              {needsIntegration && (
                                <span className="px-2 py-0.5 rounded-full bg-[#F29F67]/20 text-[#F29F67] text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Needs Integration
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{recipe.description}</p>
                            {template?.requiredIntegration && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Requires: {template.requiredIntegration.join(", ")}
                              </p>
                            )}
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
                            onClick={() => !needsIntegration && toggleRecipe(recipe.id, recipe.enabled)}
                            disabled={needsIntegration}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                              recipe.enabled ? "bg-secondary" : "bg-muted"
                            } ${needsIntegration ? "opacity-50 cursor-not-allowed" : ""}`}
                            whileTap={needsIntegration ? {} : { scale: 0.95 }}
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
                            <div className="pt-4 mt-4 border-t border-secondary/20 flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-secondary">
                                <Bell className="w-4 h-4" />
                                <span>Active</span>
                              </div>
                              {recipe.config.integrationId && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Link2 className="w-4 h-4" />
                                  <span>
                                    {integrations.find((i) => i.id === recipe.config.integrationId)?.name || "Connected"}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Last triggered: Never</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
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
                {/* Integration Selector */}
                {currentTemplate?.requiredIntegration && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Select Integration *
                    </label>
                    <select
                      value={tempConfig.integrationId || ""}
                      onChange={(e) =>
                        setTempConfig({ ...tempConfig, integrationId: Number(e.target.value) || undefined })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    >
                      <option value="">-- Select Integration --</option>
                      {integrations
                        .filter((i) => currentTemplate.requiredIntegration?.includes(i.provider.toLowerCase()))
                        .map((integration) => (
                          <option key={integration.id} value={integration.id}>
                            {integration.name} {integration.isActive ? "✓" : "(Not Connected)"}
                          </option>
                        ))}
                    </select>
                    {integrations.filter((i) => currentTemplate.requiredIntegration?.includes(i.provider.toLowerCase())).length === 0 && (
                      <p className="text-xs text-[#F29F67] mt-2">
                        No matching integration found. Go to Integrations to add one.
                      </p>
                    )}
                  </div>
                )}

                {/* Recipients */}
                {currentTemplate?.configFields.includes("recipients") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Recipients (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tempConfig.recipients || ""}
                      onChange={(e) => setTempConfig({ ...tempConfig, recipients: e.target.value })}
                      placeholder="email@example.com, +6281234567890"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    />
                  </div>
                )}

                {/* Threshold */}
                {currentTemplate?.configFields.includes("threshold") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Threshold</label>
                    <input
                      type="number"
                      value={tempConfig.threshold || ""}
                      onChange={(e) => setTempConfig({ ...tempConfig, threshold: Number(e.target.value) })}
                      placeholder="e.g., 10 for low stock"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    />
                  </div>
                )}

                {/* Delay */}
                {currentTemplate?.configFields.includes("delay") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Delay (minutes)</label>
                    <input
                      type="number"
                      value={tempConfig.delay || ""}
                      onChange={(e) => setTempConfig({ ...tempConfig, delay: Number(e.target.value) })}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    />
                  </div>
                )}

                {/* Message */}
                {currentTemplate?.configFields.includes("message") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Message Template</label>
                    <textarea
                      value={tempConfig.message || ""}
                      onChange={(e) => setTempConfig({ ...tempConfig, message: e.target.value })}
                      rows={3}
                      placeholder="Hi {customer_name}, thank you for your order..."
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Variables: {"{{customer_name}}"}, {"{{order_id}}"}, {"{{product_name}}"}
                    </p>
                  </div>
                )}

                {/* Schedule */}
                {currentTemplate?.configFields.includes("schedule") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Schedule</label>
                    <select
                      value={tempConfig.schedule || "daily"}
                      onChange={(e) => setTempConfig({ ...tempConfig, schedule: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    >
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Daily (9 AM)</option>
                      <option value="weekly">Weekly (Monday 9 AM)</option>
                      <option value="monthly">Monthly (1st day)</option>
                    </select>
                  </div>
                )}

                {/* Frequency */}
                {currentTemplate?.configFields.includes("frequency") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Frequency</label>
                    <select
                      value={tempConfig.frequency || "immediately"}
                      onChange={(e) => setTempConfig({ ...tempConfig, frequency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    >
                      <option value="immediately">Immediately</option>
                      <option value="batch">Batch (every hour)</option>
                      <option value="daily">Daily summary</option>
                    </select>
                  </div>
                )}

                {/* Notification Channels */}
                {currentTemplate?.configFields.includes("channels") && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Notification Channels</label>
                    <div className="flex flex-wrap gap-2">
                      {["email", "sms", "whatsapp", "telegram", "push"].map((channel) => (
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
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-secondary hover:bg-secondary/90 transition-colors font-medium text-white flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
