import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales, localePrefix } from '../i18n.config';
import createMiddleware from 'next-intl/middleware';
import { cookies } from 'next/headers';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

const isAuthRoute = 'sign-in';

export default async function middleware(request: NextRequest) {
  // // Check for authentication cookie
  // const isLoggedIn =
  //   !!cookies.get('accessKey') ||
  //   !!cookies.get('accessKey');

  // // Extract locale from the pathname

  // const pathname = request.nextUrl.pathname;

  // // Handle authenticated user on auth routes
  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     return NextResponse.redirect(new URL(`/dashboard`, request.nextUrl));
  //   }
  //   return NextResponse.next();
  // }

  // // Handle unauthenticated user on protected routes
  // if (!isLoggedIn) {
  //   return NextResponse.redirect(new URL(`/sign-in`, request.nextUrl));
  // }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
