"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  User,
  Building2,
  Smartphone,
  Download,
  Check,
  Bell,
  Shield,
  Palette,
  Languages,
  Sun,
  Moon,
  Loader2,
  Mail,
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"

interface Language {
  code: string
  name: string
  flag: string
}

export default function SettingsView() {
  const { user, updateProfile } = useAuth()
  const [businessName, setBusinessName] = useState("")
  const [country, setCountry] = useState("Indonesia")
  const [selectedLanguage, setSelectedLanguage] = useState("id")
  const [pwaInstalled, setPwaInstalled] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const { theme, toggleTheme } = useTheme()

  // Load user data
  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || "")
      if (user.country) {
        setCountry(user.country)
        // Map country to language code
        const countryToLang: Record<string, string> = {
          'Indonesia': 'id',
          'Malaysia': 'my',
          'Singapore': 'sg',
          'Vietnam': 'vn',
          'Thailand': 'th',
          'Philippines': 'ph',
        }
        setSelectedLanguage(countryToLang[user.country] || 'id')
      }
    }
  }, [user])

  const languages: Language[] = [
    { code: "id", name: "Indonesia", flag: "🇮🇩" },
    { code: "my", name: "Malaysia", flag: "🇲🇾" },
    { code: "sg", name: "Singapore", flag: "🇸🇬" },
    { code: "vn", name: "Vietnam", flag: "🇻🇳" },
    { code: "th", name: "Thailand", flag: "🇹🇭" },
    { code: "ph", name: "Philippines", flag: "🇵🇭" },
  ]

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    
    const result = await updateProfile({ businessName, country })
    
    setIsSaving(false)
    
    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Profile saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } else {
      setSaveMessage({ type: 'error', text: result.error || 'Failed to save' })
    }
  }

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode)
    // Map language code to country
    const langToCountry: Record<string, string> = {
      'id': 'Indonesia',
      'my': 'Malaysia',
      'sg': 'Singapore',
      'vn': 'Vietnam',
      'th': 'Thailand',
      'ph': 'Philippines',
    }
    setCountry(langToCountry[langCode] || 'Indonesia')
  }

  const handleInstallPwa = () => {
    setPwaInstalled(true)
    setTimeout(() => {
      alert("A.R.U.S. has been added to your home screen!")
    }, 500)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B8FF3] to-[#3B8FF3]/60 flex items-center justify-center">
          <Settings className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Account & App</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl backdrop-blur-md bg-card border border-border"
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[#F29F67]" />
          Profile Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-[#F29F67] focus:outline-none transition-colors"
              placeholder="Enter business name"
            />
          </div>

          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                saveMessage.type === 'success' 
                  ? 'bg-[#34B1AA]/20 text-[#34B1AA]' 
                  : 'bg-destructive/20 text-destructive'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}

          <motion.button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="mt-4 px-6 py-3 bg-[#F29F67] text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: isSaving ? 1 : 1.02 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* PWA Install Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-[#3B8FF3]/20 to-[#34B1AA]/10 border border-[#3B8FF3]/30"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3B8FF3]/20 flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-[#3B8FF3]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Install Mobile App
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#34B1AA]/20 text-[#34B1AA]">Recommended</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Get the full app experience on your device. Works offline and receives push notifications.
              </p>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleInstallPwa}
          disabled={pwaInstalled}
          className={`mt-6 w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
            pwaInstalled ? "bg-[#34B1AA] text-white cursor-default" : "bg-[#3B8FF3] text-white hover:bg-[#3B8FF3]/90"
          }`}
          whileHover={pwaInstalled ? {} : { scale: 1.02 }}
          whileTap={pwaInstalled ? {} : { scale: 0.98 }}
        >
          {pwaInstalled ? (
            <>
              <Check className="w-5 h-5" />
              Added to Home Screen
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Add to Home Screen
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Language Picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl backdrop-blur-md bg-card border border-border"
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#34B1AA]" />
          Language & Region
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-4 rounded-xl border transition-all text-center ${
                selectedLanguage === lang.code
                  ? "bg-[#34B1AA]/20 border-[#34B1AA]"
                  : "bg-muted border-border hover:bg-muted/80"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl mb-2 block">{lang.flag}</span>
              <span
                className={`text-xs ${selectedLanguage === lang.code ? "text-[#34B1AA]" : "text-muted-foreground"}`}
              >
                {lang.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Preferences - Updated with working theme toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl backdrop-blur-md bg-card border border-border"
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#F29F67]" />
          Preferences
        </h2>

        <div className="space-y-4">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts and updates</p>
              </div>
            </div>
            <motion.button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                notifications ? "bg-[#34B1AA]" : "bg-border"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                animate={{
                  left: notifications ? "calc(100% - 28px)" : "4px",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Dark Mode Toggle - Now uses theme context */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  {theme === "dark" ? "Currently using dark theme" : "Currently using light theme"}
                </p>
              </div>
            </div>
            <motion.button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                theme === "dark" ? "bg-[#34B1AA]" : "bg-border"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                animate={{
                  left: theme === "dark" ? "calc(100% - 28px)" : "4px",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Security */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
            </div>
            <motion.button
              className="px-4 py-2 rounded-lg bg-[#F29F67]/20 text-[#F29F67] text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enable
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
