"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/contexts/theme-context"
import LoginPage from "@/components/login-page"
import RegisterPage from "@/components/register-page"
import DashboardPage from "@/components/dashboard-page"

// Dynamic import HARUS di atas sebelum digunakan
const LandingPage = dynamic(() => import("@/components/landing-page"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
})

type ViewType = "landing" | "login" | "register" | "dashboard"

function AppContent() {
  const [view, setView] = useState<ViewType>("landing")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const goToLogin = () => setView("login")
  const goToRegister = () => setView("register")

  const handleLogin = (email: string) => {
    setUser({ name: "Business Owner", email })
    setView("dashboard")
  }

  const handleRegister = (businessName: string, email: string) => {
    setUser({ name: businessName, email })
    setView("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setView("landing")
  }

  // Show loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {view === "landing" && <LandingPage onLaunchConsole={goToLogin} />}
      {view === "login" && <LoginPage onLogin={handleLogin} onRegisterLink={goToRegister} />}
      {view === "register" && <RegisterPage onRegister={handleRegister} onLoginLink={goToLogin} />}
      {view === "dashboard" && user && <DashboardPage user={user} onLogout={handleLogout} />}
    </main>
  )
}

export default function AppContainer() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
