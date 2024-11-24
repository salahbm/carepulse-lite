import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { getClient } from './lib/actions/clients.actions';

const { defaultLocale, localePrefix, locales } = routing;

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const segments = pathname.split('/');
  const company = segments[1];
  const userId = segments[3];

  if (pathname.includes('/new-appointment')) {
    const client = await getClient(userId);

    if (!client) {
      // Redirect to register page if no client exists
      return NextResponse.redirect(
        new URL(`/${company}/clients/${userId}/register`, request.url)
      );
    }
  }

  const dynamicPath = segments[1];
  const isLoggedIn = request.cookies.has(`${dynamicPath}_auth_token`);

  // Redirect authenticated user away from auth routes
  const isAuthRoute = pathname.includes('/sign-in');
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${dynamicPath}/admin`, request.url));
  }

  // Locale middleware handling
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
    '/((?!.*\\..*|_next|favicon\\.ico).*)',
    '/',
    '/(api|trpc)(.*)',
    '/(uz|ru|en)/:path*',
  ],
};
