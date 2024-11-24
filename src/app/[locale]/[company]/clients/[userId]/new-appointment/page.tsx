import Image from 'next/image';

import { getClient } from '@/lib/actions/clients.actions';
import { AppointmentForm } from '@/components/forms/appointment';
import { getCompany } from '@/lib/actions/company.actions';
import Logo from '@/components/shared/logo';

const Appointment = async ({
  params,
}: {
  params: Promise<{ userId: string; company: string }>;
}) => {
  const { userId, company: companyName } = await params;
  console.log('====================================');
  console.log('CLIENT IS BEING FETCHED');
  console.log('====================================');
  const client = await getClient(userId);
  const company = await getCompany(companyName);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Logo />
          <AppointmentForm
            userId={userId}
            clientId={client?.$id}
            company={company}
            type="create"
          />

          <p className="mt-10 py-12">© 2024 EasyBooking</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.svg"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[40%] bg-bottom transform scaleX(-1) "
      />
    </div>
  );
};

export default Appointment;
