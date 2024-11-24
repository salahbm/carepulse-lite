import { MobileSidebar } from './mobile-nav';
import UserNav from './user-nav';
import Logo from '../shared/logo';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <nav className="flex h-14 items-center justify-between px-4 border-b">
      <div className="hidden lg:block">
        <Link href="/">
          <figure className="inline-flex items-center justify-start gap-3">
            <Image
              src="/assets/logos/logo.png"
              height={1000}
              width={1000}
              alt="logo"
              priority
              className="h-8 w-fit"
            />
            <p className="font-subtitle-1 font-semibold text-white whitespace-nowrap ">
              EasyBooking
            </p>
          </figure>
        </Link>
      </div>
      <MobileSidebar />
      <UserNav />
    </nav>
  );
}
