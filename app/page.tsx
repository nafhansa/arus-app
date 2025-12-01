"use client"

export const dynamic = "force-dynamic"
export const revalidate = 0

import { useState } from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import LandingPage from "@/components/landing-page"
import LoginPage from "@/components/login-page"
import RegisterPage from "@/components/register-page"
import DashboardPage from "@/components/dashboard-page"

type ViewType = "landing" | "login" | "register" | "dashboard"

function AppContent() {
  const [view, setView] = useState<ViewType>("landing")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

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
