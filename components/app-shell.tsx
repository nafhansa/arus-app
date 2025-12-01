"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "@/components/sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Register service worker once
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) navigator.serviceWorker.register('/sw.js').catch(() => {})
      })
    }
  }, [])
  return (
    <div>
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            className="p-2 rounded-lg bg-muted hover:bg-muted/80"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-5 h-0.5 bg-foreground block mb-1" />
            <span className="w-5 h-0.5 bg-foreground block mb-1" />
            <span className="w-5 h-0.5 bg-foreground block" />
          </button>
          <span className="text-sm font-semibold text-primary">A.R.U.S. OS</span>
          <div className="w-8" />
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}
