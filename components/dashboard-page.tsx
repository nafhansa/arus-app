"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, LogOut, MessageCircle, Home, Brain, Zap, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DashboardContent from "./dashboard-content"
import ChatWidget from "./chat-widget"
import BrainView from "./brain-view"
import OpsView from "./ops-view"
import SettingsView from "./settings-view"

interface DashboardPageProps {
  onLogout: () => void
}

type ViewType = "dashboard" | "brain" | "ops" | "settings"

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [chatOpen, setChatOpen] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "brain", label: "AI Brain", icon: Brain },
    { id: "ops", label: "Auto-Ops", icon: Zap },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const displayName = user?.businessName || user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-card border-r border-border flex flex-col shadow-[var(--shadow-soft)]"
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-border">
          <motion.div animate={{ opacity: sidebarOpen ? 1 : 0 }} transition={{ duration: 0.2 }}>
            {sidebarOpen && <h1 className="font-bold text-lg text-primary">A.R.U.S.</h1>}
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  {sidebarOpen && item.label}
                </motion.span>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium"
            >
              {sidebarOpen && "Logout"}
            </motion.span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-20 bg-card border-b border-border px-8 flex items-center justify-between shadow-[var(--shadow-soft)]">
          <div>
            <h2 className="text-sm text-muted-foreground">Welcome back,</h2>
            <p className="text-xl font-bold text-foreground">{displayName}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {currentView === "dashboard" && <DashboardContent />}
            {currentView === "brain" && <BrainView />}
            {currentView === "ops" && <OpsView />}
            {currentView === "settings" && <SettingsView />}
          </motion.div>
        </div>
      </div>

      {/* Chat Widget FAB */}
      <div className="fixed bottom-8 right-8">
        <motion.button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center hover:bg-primary/90 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>

        {/* Chat Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: chatOpen ? 1 : 0, scale: chatOpen ? 1 : 0.8, y: chatOpen ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className={chatOpen ? "block" : "hidden"}
          style={{ pointerEvents: chatOpen ? "auto" : "none" }}
        >
          <ChatWidget onClose={() => setChatOpen(false)} />
        </motion.div>
      </div>
    </div>
  )
}
