import { NavItem } from '@/types/admin';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'dashboard',
    label: 'Dashboard',
  },

  {
    title: 'Date/Time',
    href: '/date-time',
    icon: 'clock',
    label: 'Date/Time',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'settings',
    label: 'settings',
  },
  {
    title: 'Statistics',
    href: '/statistics',
    icon: 'blogs',
    label: 'Statistics',
  },
];
