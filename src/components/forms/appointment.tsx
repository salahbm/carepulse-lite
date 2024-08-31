'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getAppointmentSchema } from '@/lib/validation';
import { Appointment, TCompany } from '@/types/appwrite.types';

import 'react-datepicker/dist/react-datepicker.css';

import { Form } from '../ui/form';
import CustomFormField, { FormFieldType } from '../shared/form-field';
import SubmitButton from '../shared/submit-btn';
import toast from 'react-hot-toast';
import {
  createAppointment,
  updateAppointment,
} from '@/lib/actions/appointment.actions';

export const AppointmentForm = ({
  userId,
  clientId,
  company,
  type = 'create',
  appointment,
  setOpen,
}: {
  userId: string;
  clientId: string;
  company: TCompany;
  type: 'create' | 'schedule' | 'cancel';
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      master: appointment ? appointment?.master : '',
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);
    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
    }

    try {
      if (type === 'create' && clientId) {
        const appointment = {
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
          userId,
          master: company.name,
          client: clientId,
        };

        const newAppointment = await createAppointment(appointment);
        if (newAppointment) {
          form.reset();
          toast.success('Appointment created successfully!');
          router.push(`/${path}/success?appointmentId=${newAppointment.$id}`);
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            master: values.master,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;
    default:
      buttonLabel = 'Submit Appointment';
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === 'create' && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== 'cancel' && (
          <>
            <p>You are scheduling an appointment for {company.name}</p>
            <div className="inline-flex items-center justify-between gap-4">
              <Image
                src={company.logoUrl || '/assets/icons/logo-icon.png'}
                alt="company logo"
                width={50}
                height={50}
                className="rounded-full object-contain h-10 w-10"
              />
              <div>
                <p className="text-lg font-semibold">{company.name}</p>
                <p className="text-mg font-medium">{company.address}</p>
              </div>
            </div>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  HH:mm "
            />

            <div
              className={`flex flex-col gap-6  ${
                type === 'create' && 'xl:flex-row'
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === 'schedule'}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === 'schedule'}
              />
            </div>
          </>
        )}

        {type === 'cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
