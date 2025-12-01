import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto")
  if (process.env.NODE_ENV === "production" && proto === "http") {
    const url = new URL(req.url)
    url.protocol = "https:"
    return NextResponse.redirect(url, 301)
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/:path*",
}

