import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import { getCompany } from '@/lib/actions/company.actions';
import Link from 'next/link';

const SuccessAppointment = async ({
  searchParams,
  params,
}: SearchParamProps) => {
  const { userId, company: companyName } = params;
  const { appointmentId } = searchParams;
  if (!userId || !companyName || !appointmentId) {
    console.error('Missing required parameters');
    return <p>Error: Missing required parameters</p>;
  }
  const appointment = await getAppointment(appointmentId as string);
  const company = await getCompany(companyName);

  return (
    <div className=" flex h-screen max-h-screen px-[5%] py-10">
      <div className="flex flex-1 flex-col justify-center items-center">
        <Link href="/">
          <h1 className="font-title text-green-500">Go Back</h1>
        </Link>

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

        <section className=" flex w-full flex-col items-center gap-8 border-y-2  py-8 md:w-fit md:flex-row">
          <p>Requested appointment details: </p>
          <div className="flex-row justify-between items-center flex gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <Image
                src={company?.logoUrl || '/assets/icons/logo-icon.png'}
                alt="company"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">
                {' '}
                {company?.name.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2 ">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              <p> {formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn mt-6" asChild>
          <Link href={`/${company.name}/clients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="font-body-1 mt-6">© 2024 Booking uz</p>
      </div>
    </div>
  );
};

export default SuccessAppointment;
