import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"

// Integration types and their required config fields
const INTEGRATION_TYPES = {
  whatsapp: {
    name: "WhatsApp Business",
    icon: "💬",
    fields: ["phoneNumber", "apiKey", "businessId"],
    description: "Connect WhatsApp Business API for auto-replies and notifications",
  },
  email: {
    name: "Email SMTP",
    icon: "📧",
    fields: ["smtpHost", "smtpPort", "smtpUser", "smtpPass", "fromEmail", "fromName"],
    description: "Send automated emails via your SMTP server",
  },
  sms: {
    name: "SMS Gateway",
    icon: "📱",
    fields: ["provider", "apiKey", "senderId"],
    description: "Send SMS notifications (Twilio, Nexmo, etc.)",
  },
  telegram: {
    name: "Telegram Bot",
    icon: "✈️",
    fields: ["botToken", "chatId"],
    description: "Send notifications via Telegram bot",
  },
  shopee: {
    name: "Shopee",
    icon: "🛒",
    fields: ["shopId", "accessToken", "refreshToken"],
    description: "Sync orders and inventory from Shopee",
  },
  tokopedia: {
    name: "Tokopedia",
    icon: "🏪",
    fields: ["shopId", "clientId", "clientSecret"],
    description: "Sync orders and inventory from Tokopedia",
  },
  lazada: {
    name: "Lazada",
    icon: "📦",
    fields: ["sellerId", "accessToken", "refreshToken"],
    description: "Sync orders and inventory from Lazada",
  },
  tiktok: {
    name: "TikTok Shop",
    icon: "🎵",
    fields: ["shopId", "accessToken"],
    description: "Sync orders from TikTok Shop",
  },
}

const createSchema = z.object({
  type: z.string(),
  name: z.string().min(1),
  config: z.record(z.string()),
})

const updateSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  config: z.record(z.string()).optional(),
  isConnected: z.boolean().optional(),
})

// GET - List all integrations + available types
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
    availableTypes: INTEGRATION_TYPES,
  })
}

// POST - Create new integration
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.sub)
  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const { type, name, config } = parsed.data

  // Validate type
  if (!INTEGRATION_TYPES[type as keyof typeof INTEGRATION_TYPES]) {
    return NextResponse.json({ error: "Invalid integration type" }, { status: 400 })
  }

  const integration = await prisma.integration.create({
    data: {
      type,
      name,
      config,
      userId,
      isConnected: false,
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
