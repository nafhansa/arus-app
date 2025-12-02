"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
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
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [view, setView] = useState<ViewType>("landing")
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-redirect to dashboard if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && view !== "dashboard") {
      setView("dashboard")
    }
  }, [isLoading, isAuthenticated, view])

  const goToLogin = () => setView("login")
  const goToRegister = () => setView("register")

  const handleLoginSuccess = () => {
    setView("dashboard")
  }

  const handleRegisterSuccess = () => {
    setView("dashboard")
  }

  const handleLogout = async () => {
    await logout()
    setView("landing")
  }

  // Show loading state until client-side hydration is complete
  if (!mounted || isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {view === "landing" && <LandingPage onLaunchConsole={goToLogin} />}
      {view === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} onRegisterLink={goToRegister} />}
      {view === "register" && <RegisterPage onRegisterSuccess={handleRegisterSuccess} onLoginLink={goToLogin} />}
      {view === "dashboard" && user && <DashboardPage onLogout={handleLogout} />}
    </main>
  )
}

export default function AppContainer() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
