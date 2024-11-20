'use client';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { DashboardNav } from './dashboard-nav';
import { useSidebar } from '@/hook/common/use-sidebar';
import { navItems } from '../../constants/admin-data';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  return (
    <nav
      className={cn(
        `relative hidden flex-none border-r pt-20 lg:block h-dvh duration-500`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute right-0 translate-x-1/2 top-5 cursor-pointer rounded-full border bg-background hover:bg-accent/50 text-3xl text-foreground size-10 px-2',
          isMinimized && 'rotate-180'
        )}
        onClick={toggle}
      />
      <DashboardNav items={navItems} />
    </nav>
  );
}
