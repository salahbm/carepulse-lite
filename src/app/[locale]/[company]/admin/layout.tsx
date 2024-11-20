import { Loader } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '../../../../components/admin-components/header';
import Sidebar from '../../../../components/admin-components/sidebar';

export const metadata: Metadata = {
  title: 'Admin Booking.uz',
  description: 'Admin Panel for Booking.uz.',
  icons: {
    icon: '/assets/icons/logo-icon.png',
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative mx-auto">
      <Suspense
        fallback={
          <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin h-screen" />
        }
      >
        <div className="relative">
          <Header />
          <div className="flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden pt-16 px-6">
              {children}
            </main>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
