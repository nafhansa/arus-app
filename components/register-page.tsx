"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Building2, Mail, Lock, Globe } from "lucide-react"

interface RegisterPageProps {
  onRegister: (businessName: string, email: string) => void
  onLoginLink: () => void
}

const ASEAN_COUNTRIES = [
  "Indonesia",
  "Malaysia",
  "Philippines",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Cambodia",
  "Laos",
  "Myanmar",
  "Brunei",
]

export default function RegisterPage({ onRegister, onLoginLink }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    country: "Indonesia",
  })
  const [error, setError] = useState<string | null>(null)
  const [csrf, setCsrf] = useState<string>("")

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then(r => r.json())
      .then(j => setCsrf(j.token))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/register', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'X-CSRF-Token': csrf 
      }, 
      body: JSON.stringify(formData) 
    })
    if (!res.ok) {
      setError('Registration failed')
      return
    }
    onRegister(formData.businessName, formData.email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent via-secondary to-primary items-center justify-center p-12"
      >
        <div className="text-center">
          <div className="inline-block w-20 h-20 bg-white/20 rounded-full mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">Join A.R.U.S.</h1>
          <p className="text-white/80 text-lg">Build your business empire across ASEAN</p>
          <div className="mt-12 space-y-3">
            {["Real-time insights", "Automated operations", "Multi-market support"].map((item, idx) => (
              <p key={idx} className="text-white/70 flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-white rounded-full" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right: Registration Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Create ID</h2>
            <p className="text-muted-foreground">Start your journey with A.R.U.S.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your Business Co."
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@business.com"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none"
                >
                  {ASEAN_COUNTRIES.map((country) => (
                    <option key={country} value={country} className="bg-background">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create ID
            </motion.button>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={onLoginLink}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
