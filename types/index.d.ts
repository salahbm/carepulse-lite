/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  company: string;
  emergencyName?: string;
  emergencyPhone?: string;
  privacyConsent: boolean;

  // Additional fields for the application
  birthDate?: Date;
  address?: string;
  occupation?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocument?: FormData;
  treatmentConsent?: boolean;
  disclosureConsent?: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string; // This will be mapped to 'client' field in the backend
  primaryPhysician?: string; // Make this optional since it's not in the schema
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
  company?: string;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};
