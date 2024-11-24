import { SearchForm } from '@/components/forms/search';
import Logo from '@/components/shared/logo';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Logo />

          <SearchForm />

          <div className="font-body-1 mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 EasyBooking
            </p>
            <Link href="/set-up" className="text-green-500">
              Create new company
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
