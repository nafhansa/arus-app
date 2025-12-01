import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { limit } from "@/lib/rate-limit"
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth"
import { cookies } from "next/headers"
import { registerSchema } from "@/lib/validators"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  if (!limit(`register:${ip}`)) return NextResponse.json({ error: "Rate limited" }, { status: 429 })
  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  const { email, password, businessName, country } = parsed.data
  const csrfHeader = req.headers.get("x-csrf-token")
  const csrfCookie = (await cookies()).get("csrf_token")?.value
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) return NextResponse.json({ error: "CSRF" }, { status: 403 })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists?.passwordHash) return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  const passwordHash = await hashPassword(password)
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, businessName, country },
    create: { email, passwordHash, businessName, country },
  })
  const token = signToken({ sub: user.id, email: user.email })
  await setSessionCookie(token)
  return NextResponse.json({ user: { id: user.id, email: user.email, businessName: user.businessName } })
}
