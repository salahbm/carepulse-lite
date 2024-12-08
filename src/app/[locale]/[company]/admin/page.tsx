import Image from 'next/image';
import Link from 'next/link';

import { columns } from '@/components/table/columns';
import { DataTable } from '@/components/table/DataTable';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import { StatCard } from '@/components/shared/stats-card';
import Logo from '@/components/shared/logo';

const Dashboard = async ({
  params,
}: {
  params: Promise<{ company: string }>;
}) => {
  const { company } = await params;
  const appointments = await getRecentAppointmentList(company);

  if (!company || !appointments) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <header className="admin-header">
          <Logo />

          <p className="text-16-semibold">Admin Dashboard</p>
        </header>

        <main className="admin-main">
          <section className="w-full space-y-4">
            <h1 className="header">Sorry for the inconvenience 🙏</h1>
            <p className="text-dark-700">
              You don&apos;t have any company or appointments
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="flex gap-4 flex-wrap my-6">
          <StatCard
            type="appointments"
            count={appointments.data.counts.scheduledCount}
            label="Scheduled appointments"
            icon={'/assets/icons/appointments.svg'}
          />
          <StatCard
            type="pending"
            count={appointments.data.counts.pendingCount}
            label="Pending appointments"
            icon={'/assets/icons/pending.svg'}
          />
          <StatCard
            type="cancelled"
            count={appointments.data.counts.cancelledCount}
            label="Cancelled appointments"
            icon={'/assets/icons/cancelled.svg'}
          />
        </section>

        <DataTable columns={columns} data={appointments.data.appointments} />
      </main>
    </div>
  );
};

export default Dashboard;
