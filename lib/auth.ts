import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const COOKIE_NAME = "arus_session"

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: object) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET missing")
  return jwt.sign(payload as any, secret, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET missing")
  try {
    return jwt.verify(token, secret) as any
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const c = await cookies()
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionCookie() {
  const c = await cookies()
  c.delete(COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  const c = cookieStore.get(COOKIE_NAME)?.value
  if (!c) return null
  return verifyToken(c)
}
