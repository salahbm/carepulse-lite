import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

type SearchParamProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { userId: string };
};

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";

  try {
    const appointment = await getAppointment(appointmentId);

    if (!appointment) {
      return (
        <div className="flex h-screen flex-col items-center justify-center px-4">
          <h2 className="mb-4 text-2xl font-bold">Appointment Not Found</h2>
          <p className="mb-6 text-gray-600">
            The appointment information could not be retrieved.
          </p>
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              Schedule New Appointment
            </Link>
          </Button>
        </div>
      );
    }

    // Since primaryPhysician is not in the schema, we'll use a default doctor
    const defaultDoctor = Doctors[0]; // Use the first doctor as default
    const doctorName = "David Livingston"; // Hardcoded default doctor name

    return (
      <div className="flex h-screen max-h-screen px-[5%]">
        <div className="success-img w-full">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="logo"
              className="h-10 w-fit"
            />
          </Link>

          <section className="flex flex-col items-center">
            <Image
              src="/assets/gifs/success.gif"
              height={300}
              width={280}
              alt="success"
            />
            <h2 className="header mb-6 max-w-[600px] text-center">
              Your <span className="text-green-500">appointment request</span>{" "}
              has been successfully submitted!
            </h2>
            <p>We&apos;ll be in touch shortly to confirm.</p>
          </section>

          <section className="request-details">
            <p>Requested appointment details: </p>
            <div className="flex items-center gap-3">
              <Image
                src={defaultDoctor?.image || "/assets/icons/doctor.svg"}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">Dr. {doctorName}</p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              <p>
                {" "}
                {appointment?.schedule
                  ? formatDateTime(appointment.schedule).dateTime
                  : "Schedule not available"}
              </p>
            </div>
          </section>

          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </Button>
          <Button variant="link" className="underline" asChild size="sm">
            <Link href={`/patients/${userId}/my-appointments`}>
              My Appointments
            </Link>
          </Button>
          <p className="copyright">© 2024 CarePulse</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return (
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong</h2>
        <p className="mb-6 text-gray-600">
          We encountered an error while retrieving your appointment details.
        </p>
        <Button variant="outline" className="shad-primary-btn mt-4" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Return to Appointments
          </Link>
        </Button>
      </div>
    );
  }
};

export default RequestSuccess;
