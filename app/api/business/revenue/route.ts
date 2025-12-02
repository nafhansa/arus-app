import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"

const updateSchema = z.object({
  month: z.string(),
  year: z.number(),
  revenue: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  orders: z.number().min(0).optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get("year")) || new Date().getFullYear()

  const revenues = await prisma.revenueData.findMany({
    where: { userId, year },
    orderBy: { month: "asc" },
  })

  return NextResponse.json({ revenues })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const { month, year, revenue, cost, orders } = parsed.data

  const updated = await prisma.revenueData.upsert({
    where: {
      userId_month_year: { userId, month, year },
    },
    update: {
      ...(revenue !== undefined ? { revenue } : {}),
      ...(cost !== undefined ? { cost } : {}),
      ...(orders !== undefined ? { orders } : {}),
    },
    create: {
      userId,
      month,
      year,
      revenue: revenue ?? 0,
      cost: cost ?? 0,
      orders: orders ?? 0,
    },
  })

  return NextResponse.json({ revenue: updated })
}
