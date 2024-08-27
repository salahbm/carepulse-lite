import { z } from 'zod';

export const searchValidation = z.object({
  search: z
    .string()
    .min(2, 'Name must be at least 4 characters')
    .max(50, 'Name must be at most 50 characters'),
});
export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
});

export const ClientFormValidation = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
  gender: z.enum(['Male', 'Female']),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'You must consent to privacy in order to proceed',
    }),
});

export const CreateAppointmentSchema = z.object({
  master: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, 'Reason must be at least 2 characters')
    .max(500, 'Reason must be at most 500 characters'),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  master: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  master: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, 'Reason must be at least 2 characters')
    .max(500, 'Reason must be at most 500 characters'),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case 'create':
      return CreateAppointmentSchema;
    case 'cancel':
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}

export const CompanyFormValidation = z.object({
  ownerFullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  ownerPhone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
  gender: z.enum(['Male', 'Female']),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
  address: z.string().optional(),
  companyType: z.string().min(2, 'Company type must be at least 2 characters'),
  businessId: z.string().min(7, 'Business ID must be at least 7 characters'),
  keywords: z.string().min(2, 'Keywords must be at least 2 characters'),
  logo: z.custom<File[]>().optional(),
  adminPwd: z.string().min(6, 'Password must be at least 6 characters'),
  privacyConsent: z.boolean().default(false),
});
