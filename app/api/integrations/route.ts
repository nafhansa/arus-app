import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"
import { INTEGRATION_PROVIDERS } from "@/lib/integration-guides"

const upsertSchema = z.object({
  provider: z.string(),
  name: z.string().min(1),
  credentials: z.record(z.string()),
})

const updateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  credentials: z.record(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// GET - List all integrations + available providers
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)

  const integrations = await prisma.integration.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    integrations,
    availableProviders: INTEGRATION_PROVIDERS,
  })
}

// POST - Upsert integration (create or update by provider)
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const body = await req.json().catch(() => null)
  const parsed = upsertSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { provider, name, credentials } = parsed.data
  const providerUpper = provider.toUpperCase()

  // Validate provider
  if (!INTEGRATION_PROVIDERS[providerUpper]) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  // Upsert - create or update based on userId + provider
  const integration = await prisma.integration.upsert({
    where: {
      userId_provider: { userId, provider: providerUpper },
    },
    update: {
      name,
      credentials,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      provider: providerUpper,
      name,
      credentials,
      isActive: true,
      userId,
    },
  })

  return NextResponse.json({ integration })
}

// PUT - Update integration
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

  const { id, ...updateData } = parsed.data

  // Verify ownership
  const existing = await prisma.integration.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Integration not found" }, { status: 404 })
  }

  const updated = await prisma.integration.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json({ integration: updated })
}

// DELETE - Remove integration
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  // Verify ownership
  const existing = await prisma.integration.findFirst({
    where: { id, userId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Integration not found" }, { status: 404 })
  }

  await prisma.integration.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
