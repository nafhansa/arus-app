import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { limit } from "@/lib/rate-limit"
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth"
import { cookies } from "next/headers"
import { registerSchema } from "@/lib/validators"

// Create initial data for new user
async function createInitialDataForUser(userId: number) {
  // Create default automation recipes
  const defaultRecipes = [
    { title: "Low Stock Alert", category: "Inventory", config: { threshold: 10 }, enabled: false },
    { title: "Auto Reply WhatsApp", category: "Customer Service", config: { message: "Thank you for contacting us! We will respond shortly.", delay: 5 }, enabled: false },
    { title: "Flash Sale Alert", category: "Marketing", config: { threshold: 20, channels: ["email", "whatsapp"] }, enabled: false },
    { title: "Daily Sales Report", category: "Reports", config: { frequency: "daily", channels: ["email"] }, enabled: false },
    { title: "Price Drop Notification", category: "Marketing", config: { threshold: 10, channels: ["push"] }, enabled: false },
    { title: "Order Confirmation", category: "Customer Service", config: { message: "Your order has been confirmed!", delay: 0 }, enabled: true },
  ]

  await prisma.automationRecipe.createMany({
    data: defaultRecipes.map(recipe => ({
      ...recipe,
      userId,
    })),
  })

  // Create sample revenue data (empty months for user to fill)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  await prisma.revenueData.createMany({
    data: months.map(month => ({
      month,
      revenue: 0,
      cost: 0,
      userId,
    })),
  })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  if (!limit(`register:${ip}`)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    // Get first error message
    const firstError = parsed.error.errors[0]
    let errorMessage = "Invalid data"
    if (firstError) {
      if (firstError.path.includes("password")) {
        errorMessage = "Password must be at least 8 characters"
      } else if (firstError.path.includes("email")) {
        errorMessage = "Please enter a valid email address"
      } else if (firstError.path.includes("businessName")) {
        errorMessage = "Business name is required"
      } else {
        errorMessage = firstError.message
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
  const { email, password, businessName, country } = parsed.data
  const csrfHeader = req.headers.get("x-csrf-token")
  const csrfCookie = (await cookies()).get("csrf_token")?.value
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) return NextResponse.json({ error: "Session expired. Please refresh the page." }, { status: 403 })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists?.passwordHash) return NextResponse.json({ error: "Email already registered. Please login instead." }, { status: 409 })
  const passwordHash = await hashPassword(password)
  
  const isNewUser = !exists
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, businessName, country },
    create: { email, passwordHash, businessName, country },
  })
  
  // Create initial data for new users
  if (isNewUser) {
    await createInitialDataForUser(user.id)
  }
  
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
