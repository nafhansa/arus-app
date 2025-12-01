import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getUserId(req: NextRequest): number | null {
  const headerId = req.headers.get("x-user-id")
  if (headerId) return Number(headerId)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("userId")
  return q ? Number(q) : null
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req) ?? 1
  const form = await req.formData()
  const file = form.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large" }, { status: 413 })
  }
  const sizeKB = Math.round(buffer.length / 1024)

  const insightsPayload = [
    {
      title: "Churn Risk",
      type: "warning" as const,
      message: `Detected inactive customers from dataset (${sizeKB}KB).`,
      action: "Auto-Draft Promo",
      userId,
    },
    {
      title: "Price Optimization",
      type: "success" as const,
      message: "Consider +5% weekend pricing for top-sellers.",
      action: "Apply",
      userId,
    },
    {
      title: "Demand Forecast",
      type: "info" as const,
      message: "High demand expected for Electronics next week.",
      action: "Stock Up",
      userId,
    },
  ]

  const created = await prisma.insight.createMany({ data: insightsPayload })
  const latest = await prisma.insight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 })

  return NextResponse.json({ inserted: created.count, insights: latest })
}
