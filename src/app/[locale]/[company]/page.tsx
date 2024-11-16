import { ClientForm } from '@/components/forms/client';
import Image from 'next/image';
import Link from 'next/link';

const Home = async ({ params: { company } }: SearchParamProps) => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt="client"
            className="mb-12 h-10 w-fit"
            priority
          />

          <ClientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Booking uz
            </p>
            <Link href={`/${company}/admin`} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="client"
        className="side-img max-w-[50%]"
        priority
      />
    </div>
  );
};

export default Home;
