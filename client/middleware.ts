import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "jwt";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/workspace");
  const isPublicRoute = pathname === "/login" || pathname === "/signup";

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && authToken) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
