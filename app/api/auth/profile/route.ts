import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { z } from "zod"

const updateSchema = z.object({
  businessName: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(50).optional(),
})

export async function PUT(req: NextRequest) {
  // Verify session
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify CSRF
  const csrfHeader = req.headers.get("x-csrf-token")
  const csrfCookie = (await cookies()).get("csrf_token")?.value
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 })
  }

  // Parse body
  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
  }

  const userId = Number(session.sub)
  const { businessName, country } = parsed.data

  // Update user
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(businessName !== undefined ? { businessName } : {}),
      ...(country !== undefined ? { country } : {}),
    },
  })

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      businessName: user.businessName,
      country: user.country,
    },
  })
}

export async function GET(_req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.sub) },
    select: {
      id: true,
      email: true,
      businessName: true,
      country: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user })
}
