'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { companyName } from '@/lib/helpers';
import { getCompany } from '@/lib/actions/company.actions';
import { use, useEffect, useState } from 'react';
import { TCompany } from '@/types/appwrite.types';
const UserNav = () => {
  const router = useRouter();
  const path = usePathname();
  const company = companyName(path);
  const [data, setData] = useState<TCompany>();

  const handleLogout = async () => {
    // Remove token from cookie
    Cookies.remove(`${company}_auth_token`);
    // Redirect to login page
    router.push(`/${company}`);
  };

  const fetchCompany = async () => {
    try {
      const response = await getCompany(company);
      setData(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCompany();
  }, [company]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={data?.logoUrl} alt={data?.name || 'LOGO'} />
            <AvatarFallback>X</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded" align="end" forceMount>
        <DropdownMenuLabel className="font-normal flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {data?.name.toLocaleUpperCase() || 'Company'} Admin
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {data?.phone}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer text-red-400 w-full text-left">
              Log out
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will log you out, and you
                  have to sign in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserNav;
