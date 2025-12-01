"use client"
import { Home, Brain, Zap, Settings } from "lucide-react"

type SidebarProps = {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "brain", label: "AI Brain", icon: Brain },
    { id: "ops", label: "Auto-Ops", icon: Zap },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-72 h-full bg-card border-r border-border shadow-[var(--shadow-soft)]">
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md mr-2">
          A
        </div>
        <span className="text-lg font-bold text-primary">A.R.U.S.</span>
      </div>
      <nav className="py-4 space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={onClose}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
