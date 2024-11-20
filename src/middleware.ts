import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const { defaultLocale, localePrefix, locales } = routing;

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

// Define auth routes and protected pages
const authRoutes = ['/sign-in'];
// Use regular expressions to match each protected page and its subpaths
const protectedPages = [/^\/admin\/?/, /^\/admin\/\d+\/?/];

export async function middleware(request: NextRequest) {
  // Check for authentication cookie
  const isLoggedIn = request.cookies.has('admin-session-token');
  console.log(`isLoggedIn:`, isLoggedIn);

  const pathname = request.nextUrl.pathname;
  console.log(`pathname:`, pathname);

  // Check if the request is for an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect authenticated user away from auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated user trying to access protected routes
  const isProtectedPage = protectedPages.some((pattern) =>
    pattern.test(pathname)
  );
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Apply locale middleware, excluding specific paths
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('/favicon.ico')
  ) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!.*\\..*|_next|favicon\\.ico).*)', // Exclude files and Next.js internals
    '/',
    '/(api|trpc)(.*)', // API and trpc endpoints
    '/(uz|ru|en)/:path*', // Locale-specific paths
  ],
};
