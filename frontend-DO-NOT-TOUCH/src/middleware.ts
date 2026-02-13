import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js middleware for route protection.
 * Per User Story 2 scenario 4, FR-010.
 *
 * Redirects unauthenticated users to signin for protected routes.
 */

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth session in cookies (set by AuthProvider via localStorage)
  // For server-side check, we look for our session cookie
  const sessionCookie = request.cookies.get("auth_session");
  const hasSession = !!sessionCookie?.value;

  // Redirect authenticated users away from auth pages
  if (hasSession && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to signin for protected routes
  if (!hasSession && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
