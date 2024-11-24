'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { DashboardNav } from './dashboard-nav';
import { navItems } from '../../constants/admin-data';
import Link from 'next/link';
import Image from 'next/image';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="block lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>

        <SheetDescription className="hidden"></SheetDescription>
        <SheetContent aria-describedby={undefined} side="left" className="px-0">
          <SheetTitle>
            <Link href="/">
              <figure className="inline-flex items-center px-4 justify-start gap-3 mb-10 w-full border-b py-3">
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
          </SheetTitle>
          <DashboardNav items={navItems} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
