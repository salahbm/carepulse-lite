import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getUser } from '@/lib/actions/clients.actions';
import RegisterForm from '@/components/forms/register';
import Logo from '@/components/shared/logo';

const Register = async ({ params }: any) => {
  const { userId, company } = await params;

  if (!userId || !company) {
    redirect('/');
  }

  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container justify-start">
        <div className="sub-container max-w-[860px] py-10">
          <Logo />
          <RegisterForm user={user.data!} company={company} />

          <p className="py-12">© 2024 EasyBooking</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="client"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
