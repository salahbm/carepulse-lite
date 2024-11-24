import { Loader } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '../../../../components/admin-components/header';
import Sidebar from '../../../../components/admin-components/sidebar';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Admin Booking.uz',
  description: 'Admin Panel for Booking.uz.',
  icons: {
    icon: '/assets/logos/logo.png',
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative mx-auto h-screen">
      <Suspense fallback={<Loading />}>
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
