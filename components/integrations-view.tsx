"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Link2,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { INTEGRATION_PROVIDERS, getProviderConfig } from "@/lib/integration-guides"

interface Integration {
  id: number
  provider: string
  name: string
  credentials: Record<string, string>
  isActive: boolean
  lastSyncAt: string | null
  createdAt: string
}

export default function IntegrationsView() {
  const { user } = useAuth()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ name: string; credentials: Record<string, string> }>({
    name: "",
    credentials: {},
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
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIntegrations()
  }, [user])

  const getIntegrationStatus = (provider: string) => {
    const integration = integrations.find((i) => i.provider === provider)
    return integration?.isActive ? "connected" : integration ? "configured" : "not_configured"
  }

  const openConfigModal = (provider: string) => {
    const config = getProviderConfig(provider)
    if (!config) return

    const existingIntegration = integrations.find((i) => i.provider === provider)

    const initialCredentials: Record<string, string> = {}
    config.fields.forEach((field) => {
      initialCredentials[field.key] = existingIntegration?.credentials?.[field.key] || ""
    })

    setFormData({
      name: existingIntegration?.name || config.name,
      credentials: initialCredentials,
    })
    setSelectedProvider(provider)
    setShowSecrets({})
  }

  const closeModal = () => {
    setSelectedProvider(null)
    setFormData({ name: "", credentials: {} })
    setShowSecrets({})
  }

  const handleSave = async () => {
    if (!selectedProvider) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          name: formData.name,
          credentials: formData.credentials,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setIntegrations((prev) => {
          const existing = prev.findIndex((i) => i.provider === selectedProvider)
          if (existing >= 0) {
            const updated = [...prev]
            updated[existing] = data.integration
            return updated
          }
          return [data.integration, ...prev]
        })
        setMessage({ type: "success", text: "Integration saved successfully!" })
        closeModal()
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

  const handleDelete = async (provider: string) => {
    const integration = integrations.find((i) => i.provider === provider)
    if (!integration) return

    if (!confirm("Are you sure you want to disconnect this integration?")) return

    try {
      const res = await fetch(`/api/integrations?id=${integration.id}`, { method: "DELETE" })
      if (res.ok) {
        setIntegrations((prev) => prev.filter((i) => i.provider !== provider))
        setMessage({ type: "success", text: "Integration disconnected" })
        closeModal()
      }
    } catch {
      setMessage({ type: "error", text: "Failed to disconnect" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleTestConnection = async (provider: string) => {
    const integration = integrations.find((i) => i.provider === provider)
    if (!integration) return

    try {
      await fetch("/api/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: integration.id, isActive: true }),
      })

      setIntegrations((prev) =>
        prev.map((i) =>
          i.provider === provider ? { ...i, isActive: true, lastSyncAt: new Date().toISOString() } : i
        )
      )
      setMessage({ type: "success", text: "Connection successful!" })
    } catch {
      setMessage({ type: "error", text: "Connection failed" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const providerList = Object.entries(INTEGRATION_PROVIDERS)
  const connectedCount = integrations.filter((i) => i.isActive).length
  const currentConfig = selectedProvider ? getProviderConfig(selectedProvider) : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B8FF3] to-[#34B1AA] flex items-center justify-center shadow-lg">
            <Link2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Integrations Hub</h1>
            <p className="text-muted-foreground">Connect your business tools and platforms</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-[#34B1AA]">{connectedCount}</div>
          <div className="text-sm text-muted-foreground">Connected</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-[#F29F67]">{integrations.length - connectedCount}</div>
          <div className="text-sm text-muted-foreground">Pending Setup</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-[#3B8FF3]">{providerList.length}</div>
          <div className="text-sm text-muted-foreground">Available</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-2xl font-bold text-muted-foreground">—</div>
          <div className="text-sm text-muted-foreground">Syncs Today</div>
        </div>
      </div>

      {/* Toast Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-[#34B1AA]/20 text-[#34B1AA]"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {providerList.map(([key, config]) => {
            const status = getIntegrationStatus(key)
            const integration = integrations.find((i) => i.provider === key)

            return (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openConfigModal(key)}
                className={`relative p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  status === "connected"
                    ? "bg-[#34B1AA]/10 border-[#34B1AA]/30"
                    : status === "configured"
                    ? "bg-[#F29F67]/10 border-[#F29F67]/30"
                    : "bg-card border-border hover:bg-muted/50"
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {status === "connected" && (
                    <span className="px-2 py-1 rounded-full bg-[#34B1AA]/20 text-[#34B1AA] text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" /> Connected
                    </span>
                  )}
                  {status === "configured" && (
                    <span className="px-2 py-1 rounded-full bg-[#F29F67]/20 text-[#F29F67] text-xs">
                      Pending
                    </span>
                  )}
                </div>

                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{config.name}</h3>
                    {integration?.lastSyncAt && (
                      <p className="text-xs text-muted-foreground">
                        Last sync: {new Date(integration.lastSyncAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">{config.guide.description}</p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Configuration Modal with Tutor Panel */}
      <AnimatePresence>
        {selectedProvider && currentConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${currentConfig.color}20` }}
                  >
                    {currentConfig.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{currentConfig.name}</h2>
                    <p className="text-sm text-muted-foreground">Configure your integration</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Split Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border max-h-[60vh] overflow-y-auto">
                {/* Left: Form */}
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#3B8FF3]" />
                    Credentials
                  </h3>

                  {/* Integration Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-[#3B8FF3] focus:ring-1 focus:ring-[#3B8FF3] outline-none transition-colors"
                      placeholder="My WhatsApp Business"
                    />
                  </div>

                  {/* Dynamic Fields */}
                  {currentConfig.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {field.label}
                        {field.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type === "password" && !showSecrets[field.key] ? "password" : "text"}
                          value={formData.credentials[field.key] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              credentials: { ...formData.credentials, [field.key]: e.target.value },
                            })
                          }
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-[#3B8FF3] focus:ring-1 focus:ring-[#3B8FF3] outline-none transition-colors pr-12"
                        />
                        {field.type === "password" && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowSecrets({ ...showSecrets, [field.key]: !showSecrets[field.key] })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                          >
                            {showSecrets[field.key] ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#3B8FF3] to-[#34B1AA] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save Configuration
                    </button>
                  </div>

                  {/* Test & Delete */}
                  {integrations.some((i) => i.provider === selectedProvider) && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTestConnection(selectedProvider)}
                        className="flex-1 py-2 rounded-lg border border-[#34B1AA] text-[#34B1AA] font-medium flex items-center justify-center gap-2 hover:bg-[#34B1AA]/10 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Test Connection
                      </button>
                      <button
                        onClick={() => handleDelete(selectedProvider)}
                        className="py-2 px-4 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500/10 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Tutor Panel */}
                <div className="p-6 bg-muted/30 space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-[#F29F67]" />
                      {currentConfig.guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{currentConfig.guide.description}</p>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F29F67]" />
                      Step-by-Step Guide
                    </h4>
                    <ol className="space-y-2">
                      {currentConfig.guide.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F29F67]/20 text-[#F29F67] flex items-center justify-center text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-muted-foreground pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips */}
                  {currentConfig.guide.tips && currentConfig.guide.tips.length > 0 && (
                    <div className="p-4 rounded-lg bg-[#3B8FF3]/10 border border-[#3B8FF3]/20">
                      <h4 className="text-sm font-medium text-[#3B8FF3] flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-1">
                        {currentConfig.guide.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-[#3B8FF3] flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* External Link */}
                  {currentConfig.guide.link && (
                    <a
                      href={currentConfig.guide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#3B8FF3] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {currentConfig.guide.linkText || "View Documentation"}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
