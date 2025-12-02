"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface LoginPageProps {
  onLoginSuccess: () => void
  onRegisterLink: () => void
}

export default function LoginPage({ onLoginSuccess, onRegisterLink }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const result = await login(email, password)
    
    setIsLoading(false)
    
    if (result.success) {
      onLoginSuccess()
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-accent to-primary items-center justify-center p-12"
      >
        <div className="text-center">
          <div className="inline-block w-20 h-20 bg-white/20 rounded-full mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">A.R.U.S.</h1>
          <p className="text-white/80 text-lg">Automated Resource & Unified Strategy</p>
          <p className="text-white/60 mt-6">Empowering ASEAN SMEs with AI-driven operations</p>
        </div>
      </motion.div>

      {/* Right: Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Access Console</h2>
            <p className="text-muted-foreground">Sign in to your A.R.U.S. account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="business@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Access Console"
              )}
            </motion.button>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              No account?{" "}
              <button
                onClick={onRegisterLink}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
