import { cn } from '@/lib/utils';
import Link from 'next/link';

import { MobileSidebar } from './mobile-nav';
import Image from 'next/image';
import UserNav from './user-nav';

export default function Header() {
  return (
    <nav className="flex h-14 items-center justify-between px-4 border-b">
      <div className="hidden lg:block">
        <Link
          href="/jobs"
          className="flex items-center justify-start  flex-row"
        >
          <p
            className={cn(
              'text-sm md:text-lg font-bold whitespace-nowrap -ml-1'
            )}
          >
            Admin <span className="textGradient">Booking Uz</span>
          </p>
        </Link>
      </div>
      <MobileSidebar />
      <UserNav />
    </nav>
  );
}
