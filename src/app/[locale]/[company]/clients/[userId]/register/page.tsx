import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getUser } from '@/lib/actions/clients.actions';
import RegisterForm from '@/components/forms/register';

const Register = async ({ params }: any) => {
  const { userId, company } = await params;
  if (!company || !userId) redirect('/');
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt="client"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} company={company} />

          <p className="py-12">© 2024 Booking uz</p>
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
