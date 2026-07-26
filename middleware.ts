import { auth } from '@/lib/auth-edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based route access — only active sections
const ROLE_ROUTES: Record<string, string[]> = {
  '/admin/gallery': ['admin'],
  '/admin/settings': ['admin'],
};

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = req.auth.user?.role as string;

    // Check role-specific access
    for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !roles.includes(userRole)) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === '/auth/login' && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/auth/login'],
};
