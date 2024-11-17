/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = 'Male' | 'Female';
declare type Status = 'pending' | 'scheduled' | 'cancelled';

declare interface CreateUserParams {
  name: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  gender: Gender;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  client: string;
  company: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
  clientName: string;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};

declare interface SetUpCompanyParams extends TCompany {
  name: string;
  address: string | undefined;
  phone: string;
  businessId: string;
  companyType: string;
  logoUrl?: string;
  keywords: string;
  ownerFullName: string;
  ownerPhone?: string;
  gender: Gender;
  adminPwd: string;
  logo: FormData | undefined;
}
