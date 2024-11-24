import type { Metadata } from 'next';

import React from 'react';
import '@/styles/globals.css';
import { Plus_Jakarta_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import RootProvider from '@/providers/root';
import { setRequestLocale } from 'next-intl/server';
import Head from 'next/head';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Booking.uz',
  description:
    'A healthcare client management System designed to streamline client registration, appointment scheduling, and medical records management for healthcare providers.',
  icons: {
    icon: '/assets/logos/logo.png',
  },
};

export default async function IndexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Destructure `locale` from `params` (already awaited by Next.js).
  const { locale } = await params;

  // Set the request locale if required.
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overflow-x-hidden',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
