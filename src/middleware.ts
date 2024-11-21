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
const authRoutes = '/sign-in';
// Use regular expressions to match each protected page and its subpaths
const protectedPages = [
  '/admin/date-time',
  `/admin/statistics`,
  `/admin/settings`,
  '/admin',
];

export async function middleware(request: NextRequest) {
  // Check for authentication cookie

  const pathname = request.nextUrl.pathname;

  const dynamicPath = pathname.split('/')[1];

  const isLoggedIn = request.cookies.has(`${dynamicPath}_auth_token`);

  // Check if the request is for an auth route
  const isAuthRoute = pathname.includes(authRoutes);

  // Redirect authenticated user away from auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${dynamicPath}/admin`, request.url));
  }

  // Redirect unauthenticated user trying to access protected routes
  const isProtectedPage = protectedPages.some((pattern) =>
    pathname.match(pattern)
  );
  if (!isLoggedIn && isProtectedPage) {
    // Avoid loop by ensuring the pathname does not already end with /sign-in
    if (!pathname.endsWith('/sign-in')) {
      const basePath = dynamicPath; // Extract the first dynamic segment (e.g., 'salahLLC')
      return NextResponse.redirect(
        new URL(`/${basePath}/sign-in`, request.url)
      );
    }
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
