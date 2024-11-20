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

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="block lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetTitle className="hidden"></SheetTitle>
        <SheetDescription className="hidden"></SheetDescription>
        <SheetContent
          aria-describedby={undefined}
          side="left"
          className="pt-20 px-0"
        >
          <DashboardNav items={navItems} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
