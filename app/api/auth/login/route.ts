import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { limit } from "@/lib/rate-limit"
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth"
import { cookies } from "next/headers"
import { loginSchema } from "@/lib/validators"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  if (!limit(`login:${ip}`)) return NextResponse.json({ error: "Rate limited" }, { status: 429 })
  const body = await req.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  const { email, password } = parsed.data
  const csrfHeader = req.headers.get("x-csrf-token")
  const csrfCookie = (await cookies()).get("csrf_token")?.value
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) return NextResponse.json({ error: "CSRF" }, { status: 403 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  const token = signToken({ sub: user.id, email: user.email })
  await setSessionCookie(token)
  return NextResponse.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      businessName: user.businessName,
      country: user.country,
    } 
  })
}
