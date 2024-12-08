import Image from 'next/image';
import { getClient } from '@/lib/actions/clients.actions';
import { AppointmentForm } from '@/components/forms/appointment';
import { getCompany } from '@/lib/actions/company.actions';
import Logo from '@/components/shared/logo';
import Link from 'next/link';

const Appointment = async ({
  params,
}: {
  params: Promise<{ userId: string; company: string }>;
}) => {
  const resolvedParams = await params;
  const { userId, company: companyName } = resolvedParams;

  try {
    const [clientResponse, companyResponse] = await Promise.all([
      getClient(userId),
      getCompany(companyName),
    ]);

    // If company not found or other errors
    if ('error' in clientResponse || 'error' in companyResponse) {
      return (
        <div className="flex h-screen max-h-screen justify-center items-center">
          <div className="text-center space-y-4">
            <p className="text-14-semibold"> Sorry for the inconvenience 🙏</p>
            <Link
              href={`/${companyName}/clients/${userId}/register`}
              className="text-primary hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container my-auto">
          <div className="sub-container max-w-[860px] flex-1 justify-between">
            <Logo />
            <AppointmentForm
              userId={userId}
              clientId={clientResponse?.data?.userId}
              company={companyResponse?.data!}
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
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <div className="flex h-screen max-h-screen justify-center items-center">
        <p className="text-14-semibold">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }
};

export default Appointment;
