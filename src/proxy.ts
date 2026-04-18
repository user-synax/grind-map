import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create a custom middleware that handles both admin and Clerk auth
export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;

  // Admin routes - custom authentication
  if (url.pathname.startsWith('/admin')) {
    // Allow /admin/login without authentication
    if (url.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = req.cookies.get('admin_session');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminSession || adminSession.value !== adminPassword) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Dashboard routes - use Clerk auth
  const isDashboardRoute = createRouteMatcher(['/dashboard(.*)', '/sign-in(.*)', '/sign-up(.*)']);
  if (isDashboardRoute(req)) {
    auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)', '/admin/:path*', '/dashboard/:path*'],
};
