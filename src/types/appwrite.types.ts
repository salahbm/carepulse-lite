import { Models } from 'node-appwrite';

export interface TClient extends Models.Document {
  email: string;
  phone: string;
  userId: string;
  name: string;
  privacyConsent: boolean;
  gender: Gender;
  address: string;
}

export interface TCompany extends Models.Document {
  name: string;
  address: string;
  phone: string;
  businessId: string;
  companyField: string;
  companyType: string;
  logoUrl?: string;
  keywords: string;
  ownerFullName: string;
  ownerPhone?: string;
  adminPwd: string;
  client?: TClient[];
}

export interface Appointment extends Models.Document {
  client: TClient;
  schedule: Date;
  status: Status;
  company: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
  reScheduleReason: string | null;
  clientName: string;
}
