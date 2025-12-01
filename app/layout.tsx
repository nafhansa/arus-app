import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import AppShell from "@/components/app-shell"
import "./globals.css"

 

export const metadata: Metadata = {
  title: "A.R.U.S. - Automated Resource & Unified Strategy",
  description: "AI-Powered Operations Platform for ASEAN SMEs",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

const geist = Geist({ subsets: ["latin"], display: "swap" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.className}`}>
      <body className={`font-sans antialiased`}>
        <AppShell>
          {children}
        </AppShell>
        <Analytics />
      </body>
    </html>
  )
}
