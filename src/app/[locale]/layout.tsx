import type { Metadata } from 'next';
import '../../styles/globals.css';
import { Plus_Jakarta_Sans as FontSans } from 'next/font/google';
// import { ThemeProvider } from "next-themes";

import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';

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
    icon: '/assets/icons/logo-icon.png',
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-slate-200  dark:bg-dark-300  font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
