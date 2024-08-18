import { Models } from 'node-appwrite';

export interface TClient extends Models.Document {
  email: string;
  phone: string;
  userId: string;
  name: string;
  privacyConsent: boolean;
  gender: Gender;
  birthDate: Date;
  emergencyContactName: string;
  address: string;
  occupation: string;
  emergencyContactNumber: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  primaryPhysician: string;
  insuranceProvider: string;
  currentMedication: string | undefined;
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
  master: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
  reScheduleReason: string | null;
}
