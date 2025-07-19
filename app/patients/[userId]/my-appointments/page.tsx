import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import { Appointment } from "@/types/appwrite.types";

export default async function MyAppointmentsPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  try {
    // Get patient info to display name
    const patient = await getPatient(userId);
    const patientName = patient?.name || "Patient";
    const appointments = (await getPatientAppointments(userId)) || {
      total: 0,
      documents: [],
    };

    return (
      <div className="flex min-h-screen flex-col">
        <header className="container shadow-sm">
          <div className="container mx-auto flex items-center justify-between p-4">
            <Link href="/">
              <Image
                src="/assets/icons/logo-full.svg"
                height={40}
                width={120}
                alt="CarePulse"
                className="h-8 w-auto"
              />
            </Link>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Logout
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto flex-1 px-4 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-400">
                {patientName}&apos;s Appointments
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Manage your upcoming and past appointments
              </p>
            </div>
            <Link
              href={`/patients/${userId}/new-appointment`}
              className="mt-4 sm:mt-0"
            >
              <Button className="shad-primary-btn">New Appointment</Button>
            </Link>
          </div>

          {appointments.total === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-medium">
                No appointments found
              </h3>
              <p className="text-gray-500">
                You haven&apos;t scheduled any appointments yet.
              </p>
              <Link
                href={`/patients/${userId}/new-appointment`}
                className="mt-4 inline-block"
              >
                <Button className="shad-primary-btn mt-4">
                  Schedule Your First Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  Loading appointments...
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appointments.documents.map((appointment: Appointment) => (
                  <AppointmentCard
                    key={appointment.$id}
                    appointment={appointment}
                    noSchedule={true}
                  />
                ))}
              </div>
            </Suspense>
          )}
        </main>

        <footer className="container mt-auto border-t border-neutral-200 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            &copy; 2024 CarePulse. All rights reserved.
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error loading appointments:", error);

    return (
      <div className="flex min-h-screen flex-col">
        <header className="container shadow-sm">
          <div className="container mx-auto flex items-center justify-between p-4">
            <Link href="/">
              <Image
                src="/assets/icons/logo-full.svg"
                height={40}
                width={120}
                alt="CarePulse"
                className="h-8 w-auto"
              />
            </Link>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Logout
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto flex-1 px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-4 text-xl font-semibold text-red-600">
              Something went wrong
            </h2>
            <p className="mb-6 text-center text-gray-600">
              We couldn&apos;t load your appointments. Please try again later.
            </p>
            <div className="flex gap-4">
              <Link href={`/patients/${userId}/new-appointment`}>
                <Button className="shad-primary-btn">
                  Schedule Appointment
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
            </div>
          </div>
        </main>

        <footer className="container mt-auto border-t border-neutral-200 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            &copy; 2024 CarePulse. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }
}
