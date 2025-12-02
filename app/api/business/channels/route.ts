import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
})

const updateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  enabled: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)

  const channels = await prisma.salesChannel.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ channels })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const channel = await prisma.salesChannel.create({
    data: {
      userId,
      name: parsed.data.name,
      icon: parsed.data.icon || "🛒",
    },
  })

  return NextResponse.json({ channel })
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

  const { id, name, icon, enabled } = parsed.data

  // Verify ownership
  const existing = await prisma.salesChannel.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 })
  }

  const updated = await prisma.salesChannel.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(icon !== undefined ? { icon } : {}),
      ...(enabled !== undefined ? { enabled } : {}),
    },
  })

  return NextResponse.json({ channel: updated })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  // Verify ownership
  const existing = await prisma.salesChannel.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 })
  }

  await prisma.salesChannel.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
