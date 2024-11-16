import { Loader } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from './_components/shared/header';
import Sidebar from './_components/shared/sidebar';

export const metadata: Metadata = {
  title: 'Admin Booking.uz',
  description: 'Admin Panel for Booking.uz.',
  icons: {
    icon: '/assets/icons/logo-icon.png',
  },
};

export default function AdminLayout({
  children,
  params: { locale, company },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string; company: string };
}>) {
  return (
    <main className="relative  mx-auto">
      <Suspense
        fallback={
          <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        }
      >
        <div className="relative">
          <Header />
          <div className="flex  overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden pt-16">{children}</main>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
