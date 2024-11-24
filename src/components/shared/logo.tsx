import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href="/">
      <figure className="inline-flex items-center py-3 group justify-start gap-3 mb-10 w-full border-b">
        <Image
          src="/assets/logos/logo.png"
          height={1000}
          width={1000}
          alt="logo"
          priority
          className="h-10 w-fit group-hover:h-11 transition-all duration-300"
        />
        <p className="font-title font-semibold text-white whitespace-nowrap group-hover:scale-105 transition-all duration-300">
          EasyBooking
        </p>
      </figure>
    </Link>
  );
};

export default Logo;
