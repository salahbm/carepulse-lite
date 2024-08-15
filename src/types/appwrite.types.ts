import { Models } from 'node-appwrite';

export interface Patient extends Models.Document {
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

export interface Appointment extends Models.Document {
  client: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}
