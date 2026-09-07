import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAuthRoute } from "./lib/auth/route-access";

function isProtectedPath(pathname: string): boolean {
  // Public route
  if (pathname === "/") return true;

  // Explicitly protected routes
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/classes") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/agents") ||
    pathname.startsWith("/admin")
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const auth = isAuthRoute(pathname);
  const protectedRoute = isProtectedPath(pathname);

  // Early return if route requires no auth enforcement
  if (!auth && !protectedRoute) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("refreshToken")?.value;

  // 1. Unauthenticated users attempting to access protected paths -> Redirect to sign-in
  if (!refreshToken && protectedRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);

    return NextResponse.redirect(url);
  }

  // 2. Authenticated users attempting to access auth paths (sign-in, sign-up, etc.) -> Redirect to home
  if (refreshToken && auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/dashboard/:path*",
    "/classes/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/agents/:path*",
    "/admin/:path*",
  ],
};