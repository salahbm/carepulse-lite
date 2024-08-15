import Image from 'next/image';

import { getClient } from '@/lib/actions/clients.actions';
import { AppointmentForm } from '@/components/forms/appointment';

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const client = await getClient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            clientId={client?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 CarePluse</p>
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
