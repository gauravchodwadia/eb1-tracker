import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // If not authenticated and not on login page, redirect to login
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login
     * - /api/auth (NextAuth routes)
     * - /_next (Next.js internals)
     * - /favicon.ico, /icon.*, /apple-icon.* (static assets)
     */
    "/((?!login|api/auth|_next|favicon\\.ico|icon|apple-icon).*)",
  ],
};
