import { NextRequest, NextResponse } from "next/server"

function randomToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export async function GET(_req: NextRequest) {
  const token = randomToken()
  const res = NextResponse.json({ token })
  res.cookies.set("csrf_token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  })
  return res
}
