'use client';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/logo';

const RequestSuccess = () => {
  const pathname = usePathname();

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="m-auto flex flex-1 flex-col items-center justify-center gap-10 py-10">
        <Logo />

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">company request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/${pathname?.split('/')[2]}`}>Home</Link>
        </Button>

        <p className="copyright">© 2024 EasyBooking</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
