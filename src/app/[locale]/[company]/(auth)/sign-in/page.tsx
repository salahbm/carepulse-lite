import { AdminForm } from '@/components/forms/admin-auth';
import Image from 'next/image';
import Link from 'next/link';

const Home = async () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <section className="mb-12">
          <h1 className="font-header-1">Log in</h1>
          <p className="text-dark-600 font-body-1 mt-2">
            Log in or sign up to get started
          </p>
        </section>
        <div className="sub-container max-w-[496px]">
          <AdminForm />
        </div>

        <div className="font-body-1 mt-20 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 EasyBooking
          </p>
          <Link href="/set-up" className="text-green-500">
            Create new company
          </Link>
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
