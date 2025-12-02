import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { limit } from "@/lib/rate-limit"
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth"
import { cookies } from "next/headers"
import { loginSchema } from "@/lib/validators"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  if (!limit(`login:${ip}`)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
  const body = await req.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    let errorMessage = "Invalid data"
    if (firstError) {
      if (firstError.path.includes("password")) {
        errorMessage = "Password must be at least 8 characters"
      } else if (firstError.path.includes("email")) {
        errorMessage = "Please enter a valid email address"
      } else {
        errorMessage = firstError.message
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
  const { email, password } = parsed.data
  const csrfHeader = req.headers.get("x-csrf-token")
  const csrfCookie = (await cookies()).get("csrf_token")?.value
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) return NextResponse.json({ error: "Session expired. Please refresh the page." }, { status: 403 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) return NextResponse.json({ error: "Email not found. Please register first." }, { status: 401 })
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 })
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
