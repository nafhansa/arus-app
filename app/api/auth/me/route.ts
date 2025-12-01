import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(_req: NextRequest) {
  const session = await getSession()
  if (!session?.sub) return NextResponse.json({ user: null }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: Number(session.sub) } })
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user: { id: user.id, email: user.email, businessName: user.businessName } })
}
