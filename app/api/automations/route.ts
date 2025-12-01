import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const putSchema = z.object({
  id: z.number(),
  enabled: z.boolean().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  config: z.record(z.any()).optional(),
})

function getUserId(req: NextRequest): number | null {
  const headerId = req.headers.get("x-user-id")
  if (headerId) return Number(headerId)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("userId")
  return q ? Number(q) : null
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req) ?? 1
  const recipes = await prisma.automationRecipe.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })
  return new NextResponse(JSON.stringify({ recipes }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
    },
  })
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = putSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }

  const { id, enabled, title, category, config } = parsed.data
  const updated = await prisma.automationRecipe.update({
    where: { id },
    data: {
      ...(enabled !== undefined ? { enabled } : {}),
      ...(title !== undefined ? { title } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(config !== undefined ? { config } : {}),
    },
  })

  return NextResponse.json({ recipe: updated })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const schema = z.object({ id: z.number(), enabled: z.boolean() })
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }
  const { id, enabled } = parsed.data
  const updated = await prisma.automationRecipe.update({ where: { id }, data: { enabled } })
  return NextResponse.json({ recipe: updated })
}
