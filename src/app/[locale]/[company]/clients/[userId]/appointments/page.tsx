import Image from 'next/image';

import Logo from '@/components/shared/logo';

const Appointment = async () => {
  return (
    <div className="flex h-screen max-h-screen justify-start">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Logo />

          <p className="mt-10 py-12">© 2024 Booking uz</p>
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
