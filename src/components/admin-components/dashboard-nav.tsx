'use client';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hook/common/use-sidebar';
import { Icons } from '@/components/shared/icons';
import { NavItem } from '@/types/admin';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const route = useRouter();
  const { isMinimized } = useSidebar();
  const getBaseRoute = path.split('/').slice(0, 3).join('/');

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn('flex flex-col items-start h-full whitespace-nowrap')}>
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'question'];

        return (
          item.href && (
            <div
              key={index}
              className={cn(
                'w-full px-4 py-3 hover:bg-accent/35 rounded cursor-pointer flex flex-row items-center justify-start gap-2',
                (item.href === '/' && path.endsWith('admin')) ||
                  path.endsWith(item.href)
                  ? 'bg-accent'
                  : 'transparent'
              )}
              onClick={() => {
                if (setOpen) setOpen(false);
                if (item.disabled || isMinimized) return;
                route.push(`${getBaseRoute}/${item.href}`);
              }}
            >
              <Icon className="ml-2 size-5" />

              {!isMinimized && <p className="mr-2 truncate">{item.title}</p>}
            </div>
          )
        );
      })}
    </nav>
  );
}
