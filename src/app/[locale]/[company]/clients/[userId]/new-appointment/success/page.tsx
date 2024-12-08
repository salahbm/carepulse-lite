import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import { getCompany } from '@/lib/actions/company.actions';
import Link from 'next/link';
import { FC } from 'react';
import Logo from '@/components/shared/logo';
import { BookOpenText, Clock } from 'lucide-react';
import { firstLetterUppercase } from '@/lib/helpers';
interface Props {
  searchParams: { [key: string]: string };
  params: { [key: string]: string };
}

const SuccessAppointment: FC<any> = async ({ searchParams, params }) => {
  const { userId, company: companyName } = await params;
  const { appointmentId } = await searchParams;
  if (!userId || !companyName || !appointmentId) {
    console.error('Missing required parameters');
    return <p>Error: Missing required parameters</p>;
  }
  const appointment = await getAppointment(appointmentId as string);
  const company = await getCompany(companyName);

  return (
    <div className="flex flex-col w-full p-6 gap-y-6">
      <Logo />

      <section className="flex flex-col items-center my-6">
        <Image
          src="/assets/gifs/success.gif"
          height={300}
          width={280}
          alt="success"
        />
        <h2 className=" mb-6 max-w-[600px] text-center">
          Your <span className="text-green-500">appointment request</span> has
          been successfully submitted!
        </h2>
        <p>We&apos;ll be in touch shortly to confirm.</p>
      </section>

      <section className="flex w-full flex-col items-center gap-8 border-y-2 py-8">
        <p>Requested appointment details: </p>
        <div className="flex-row justify-between items-center flex gap-8 flex-wrap">
          <div className="flex items-center gap-3">
            <Image
              src={company?.data?.logoUrl || '/assets/logos/logo.png'}
              alt="company"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">
              {firstLetterUppercase(company?.data?.name!)}
            </p>
          </div>
          <div className="flex gap-2 ">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.data!.schedule).dateTime}</p>
          </div>
        </div>
      </section>
      <div className="mt-6 inline-flex justify-between items-center">
        <Button variant="default" className="h-11" asChild>
          <Link
            href={`/${company.data?.name}/clients/${userId}/new-appointment`}
          >
            <Clock />
            New Appointment
          </Link>
        </Button>
        <Button variant="outline" className="h-11" asChild>
          <Link href={`/${company.data?.name}/clients/${userId}/appointments`}>
            <BookOpenText />
            All Appointments
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessAppointment;
