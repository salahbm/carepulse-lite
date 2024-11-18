'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import React, { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hook/common/use-sidebar';
import { Icons } from '@/components/shared/icons';
import { NavItem } from '@/types/admin';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav
      className={cn(
        ' flex flex-col h-full duration-500',
        !isMinimized ? 'w-fit items-start' : 'w-[76px] items-center'
      )}
    >
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'question'];
        return (
          item.href && (
            <Button asChild key={index} variant="ghost">
              <Link
                href={item.disabled ? '/' : item.href}
                className={cn(
                  'flex items-center gap-2 overflow-hidden rounded',
                  path === item.href ? 'bg-accent' : 'transparent',
                  item.disabled && 'cursor-not-allowed opacity-80'
                )}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
              >
                <Icon className="ml-2 size-5" />

                {!isMinimized && (
                  <span className="mr-2 truncate">{item.title}</span>
                )}
              </Link>
            </Button>
          )
        );
      })}
    </nav>
  );
}
