import type { Metadata } from 'next';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
