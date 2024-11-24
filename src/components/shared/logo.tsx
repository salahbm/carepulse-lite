import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href="/">
      <figure className="inline-flex items-center transition-all duration-300 animate-in hover:bg-accent/15 hover:rounded p-3 justify-start gap-3 mb-10 w-full border-b">
        <Image
          src="/assets/logos/logo.png"
          height={1000}
          width={1000}
          alt="logo"
          className="h-10 w-fit"
        />
        <p className="font-title font-semibold text-white whitespace-nowrap">
          EasyBooking
        </p>
      </figure>
    </Link>
  );
};

export default Logo;
