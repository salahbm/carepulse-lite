// 'use client';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// import { redirect, useRouter } from 'next/navigation';
// export function UserNav() {
//   // const { data: session } = useSession();
//   const router = useRouter();

//   if (session) {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//             <Avatar className="h-8 w-8">
//               <AvatarImage
//                 src={session.user?.image ?? ''}
//                 alt={session.user?.name ?? ''}
//               />
//               <AvatarFallback>{session.user?.email?.[0]}</AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56" align="end" forceMount>
//           <DropdownMenuLabel className="font-normal">
//             <div className="flex flex-col space-y-1">
//               <p className="text-sm font-medium leading-none">
//                 {session.user?.name || 'Interobmen Admin'}
//               </p>
//               <p className="text-xs leading-none text-muted-foreground">
//                 {session.user?.email}
//               </p>
//             </div>
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />

//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             onClick={() => {
//               signOut();
//               router.refresh();
//               redirect('/sign-in');
//             }}
//           >
//             Log out
//             <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   }
// }
import React from 'react';

const UserNav = () => {
  return <div>UserNav</div>;
};

export default UserNav;
