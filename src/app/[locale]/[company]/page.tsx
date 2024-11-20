import { ClientForm } from '@/components/forms/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

const Home = async ({ params }: SearchParamProps) => {
  const { company } = await params;
  const cookie = await cookies();
  const user = cookie.get('user')?.value;
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <ClientForm user={user ? JSON.parse(user) : null} />

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
