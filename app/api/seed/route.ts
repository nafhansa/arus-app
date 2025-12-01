import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest) {
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    return NextResponse.json({ ok: true, message: "Seed skipped: users already exist" })
  }

  const user = await prisma.user.create({
    data: {
      email: "demo@arus.local",
      businessName: "Demo SME",
    },
  })

  const automations = [
    { title: "Auto-Reply WhatsApp", enabled: true, category: "Communication", config: { message: "Thanks! We'll reply soon.", delay: 1 } },
    { title: "Low Stock Alert", enabled: true, category: "Inventory", config: { threshold: 10, channels: ["email", "whatsapp"] } },
    { title: "Flash Sale Trigger", enabled: false, category: "Sales", config: { threshold: 30, delay: 15 } },
    { title: "Order Confirmation SMS", enabled: true, category: "Orders", config: { message: "Order confirmed", channels: ["sms", "whatsapp"] } },
    { title: "Shipping Status Updates", enabled: true, category: "Shipping", config: { channels: ["sms", "email"], frequency: "On status change" } },
  ]

  await prisma.automationRecipe.createMany({
    data: automations.map((a) => ({ ...a, userId: user.id })),
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  await prisma.revenueData.createMany({
    data: months.map((m, i) => ({ month: m, revenue: 45000 + i * 5000, cost: 20000 + i * 3000, userId: user.id })),
  })

  await prisma.insight.createMany({
    data: [
      { title: "Churn Risk", type: "warning", message: "15 customers inactive > 30 days.", action: "Auto-Draft Promo", userId: user.id },
      { title: "Price Optimization", type: "success", message: "Increase Kopi price by 5% on weekend.", action: "Apply", userId: user.id },
      { title: "Demand Forecast", type: "info", message: "High demand expected for Electronics next week.", action: "Stock Up", userId: user.id },
    ],
  })

  return NextResponse.json({ ok: true, message: "Seed completed", userId: user.id })
}
