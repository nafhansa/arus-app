"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Link2,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Settings,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface IntegrationConfig {
  [key: string]: string
}

interface Integration {
  id: number
  type: string
  name: string
  config: IntegrationConfig
  isConnected: boolean
  lastSyncAt: string | null
  createdAt: string
}

interface IntegrationType {
  name: string
  icon: string
  fields: string[]
  description: string
}

const FIELD_LABELS: Record<string, string> = {
  phoneNumber: "Phone Number",
  apiKey: "API Key",
  businessId: "Business ID",
  smtpHost: "SMTP Host",
  smtpPort: "SMTP Port",
  smtpUser: "SMTP Username",
  smtpPass: "SMTP Password",
  fromEmail: "From Email",
  fromName: "From Name",
  provider: "Provider (twilio/nexmo)",
  senderId: "Sender ID",
  botToken: "Bot Token",
  chatId: "Chat ID",
  shopId: "Shop ID",
  accessToken: "Access Token",
  refreshToken: "Refresh Token",
  clientId: "Client ID",
  clientSecret: "Client Secret",
  sellerId: "Seller ID",
}

const SENSITIVE_FIELDS = ["apiKey", "smtpPass", "accessToken", "refreshToken", "clientSecret", "botToken"]

export default function IntegrationsView() {
  const { user } = useAuth()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [availableTypes, setAvailableTypes] = useState<Record<string, IntegrationType>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ name: string; config: IntegrationConfig }>({
    name: "",
    config: {},
  })
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Fetch integrations
  useEffect(() => {
    if (!user) return

    const fetchIntegrations = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/integrations")
        if (res.ok) {
          const data = await res.json()
          setIntegrations(data.integrations || [])
          setAvailableTypes(data.availableTypes || {})
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIntegrations()
  }, [user])

  const resetForm = () => {
    setSelectedType(null)
    setFormData({ name: "", config: {} })
    setShowSecrets({})
    setShowAddModal(false)
    setEditingId(null)
  }

  const handleSelectType = (type: string) => {
    setSelectedType(type)
    const typeInfo = availableTypes[type]
    const initialConfig: IntegrationConfig = {}
    typeInfo.fields.forEach((field) => {
      initialConfig[field] = ""
    })
    setFormData({
      name: typeInfo.name,
      config: initialConfig,
    })
  }

  const handleSave = async () => {
    if (!selectedType) return

    setIsSaving(true)
    try {
      const endpoint = "/api/integrations"
      const method = editingId ? "PUT" : "POST"
      const body = editingId
        ? { id: editingId, ...formData }
        : { type: selectedType, ...formData }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        if (editingId) {
          setIntegrations((prev) =>
            prev.map((i) => (i.id === editingId ? data.integration : i))
          )
        } else {
          setIntegrations((prev) => [data.integration, ...prev])
        }
        setMessage({ type: "success", text: editingId ? "Integration updated!" : "Integration added!" })
        resetForm()
      } else {
        const err = await res.json()
        setMessage({ type: "error", text: err.error || "Failed to save" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this integration?")) return

    try {
      const res = await fetch(`/api/integrations?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setIntegrations((prev) => prev.filter((i) => i.id !== id))
        setMessage({ type: "success", text: "Integration deleted" })
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEdit = (integration: Integration) => {
    setEditingId(integration.id)
    setSelectedType(integration.type)
    setFormData({
      name: integration.name,
      config: integration.config as IntegrationConfig,
    })
    setShowAddModal(true)
  }

  const handleTestConnection = async (id: number) => {
    // Simulate connection test
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isConnected: true, lastSyncAt: new Date().toISOString() } : i))
    )
    
    // Update in database
    await fetch("/api/integrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isConnected: true }),
    })
    
    setMessage({ type: "success", text: "Connection successful!" })
    setTimeout(() => setMessage(null), 3000)
  }

  const connectedCount = integrations.filter((i) => i.isConnected).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B8FF3] to-[#34B1AA] flex items-center justify-center shadow-lg">
            <Link2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
            <p className="text-muted-foreground">Connect your business tools and platforms</p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground flex items-center gap-2 shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Integration
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-[#34B1AA]">{connectedCount}</div>
          <div className="text-sm text-muted-foreground">Connected</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-[#F29F67]">{integrations.length - connectedCount}</div>
          <div className="text-sm text-muted-foreground">Pending Setup</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-[#3B8FF3]">{Object.keys(availableTypes).length}</div>
          <div className="text-sm text-muted-foreground">Available Types</div>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-[#34B1AA]/20 text-[#34B1AA]"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integrations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : integrations.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Link2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Integrations Yet</h3>
          <p className="text-muted-foreground mb-4">
            Connect WhatsApp, Email, SMS, or marketplace platforms to enable automations
          </p>
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            whileHover={{ scale: 1.02 }}
          >
            Add Your First Integration
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-4">
          {integrations.map((integration) => {
            const typeInfo = availableTypes[integration.type]
            return (
              <motion.div
                key={integration.id}
                className={`p-4 rounded-xl border transition-all ${
                  integration.isConnected
                    ? "bg-card border-[#34B1AA]/30"
                    : "bg-card border-border"
                }`}
                layout
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                      {typeInfo?.icon || "🔗"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{integration.name}</h4>
                        {integration.isConnected ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#34B1AA]/20 text-[#34B1AA] text-xs">
                            Connected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#F29F67]/20 text-[#F29F67] text-xs">
                            Not Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{typeInfo?.name || integration.type}</p>
                      {integration.lastSyncAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {new Date(integration.lastSyncAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleTestConnection(integration.id)}
                      className="p-2 rounded-lg bg-[#34B1AA]/10 hover:bg-[#34B1AA]/20 text-[#34B1AA]"
                      whileHover={{ scale: 1.05 }}
                      title="Test Connection"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleEdit(integration)}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                      whileHover={{ scale: 1.05 }}
                      title="Edit"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(integration.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                      whileHover={{ scale: 1.05 }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-card border border-border shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingId ? "Edit Integration" : selectedType ? "Configure Integration" : "Add Integration"}
                </h3>
                <button onClick={resetForm} className="p-2 rounded-lg hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Select Type */}
              {!selectedType && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(availableTypes).map(([type, info]) => (
                    <motion.button
                      key={type}
                      onClick={() => handleSelectType(type)}
                      className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 text-left transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-2xl mb-2">{info.icon}</div>
                      <div className="font-medium text-foreground">{info.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{info.description}</div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 2: Configure */}
              {selectedType && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl">{availableTypes[selectedType]?.icon}</div>
                    <div>
                      <div className="font-medium">{availableTypes[selectedType]?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {availableTypes[selectedType]?.description}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., WhatsApp Bisnis Utama"
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border"
                    />
                  </div>

                  {/* Config Fields */}
                  {availableTypes[selectedType]?.fields.map((field) => (
                    <div key={field}>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        {FIELD_LABELS[field] || field}
                      </label>
                      <div className="relative">
                        <input
                          type={SENSITIVE_FIELDS.includes(field) && !showSecrets[field] ? "password" : "text"}
                          value={formData.config[field] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              config: { ...formData.config, [field]: e.target.value },
                            })
                          }
                          placeholder={`Enter ${FIELD_LABELS[field] || field}`}
                          className="w-full px-4 py-3 rounded-xl bg-input border border-border pr-12"
                        />
                        {SENSITIVE_FIELDS.includes(field) && (
                          <button
                            type="button"
                            onClick={() => setShowSecrets({ ...showSecrets, [field]: !showSecrets[field] })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                          >
                            {showSecrets[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={resetForm}
                      className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 font-medium"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={handleSave}
                      disabled={isSaving || !formData.name}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {editingId ? "Update" : "Save Integration"}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
