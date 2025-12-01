import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getUserId(req: NextRequest): number | null {
  const headerId = req.headers.get("x-user-id")
  if (headerId) return Number(headerId)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("userId")
  return q ? Number(q) : null
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req) ?? 1

  const [revenues, recentRecipes, insights] = await Promise.all([
    prisma.revenueData.findMany({ where: { userId }, orderBy: { month: "asc" } }),
    prisma.automationRecipe.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 10 }),
    prisma.insight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ])

  const activity = recentRecipes.map((r) => ({
    id: r.id,
    action: `${r.enabled ? "Enabled" : "Disabled"} ${r.title}`,
    time: r.updatedAt,
  }))

  return new NextResponse(JSON.stringify({ revenue: revenues, activity, insights }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=600",
    },
  })
}
