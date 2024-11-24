'use server';
import { revalidatePath } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import { Appointment } from '@/types/appwrite.types';
import axios from 'axios';

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from '../appwrite.config';
import { formatDateTime, parseStringify } from '../utils';
import { BASE_URL } from '@/constants/base_url';

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    // const response = await axios.post(
    //   `${BASE_URL}/api/telegram/new-appointment`,
    //   {
    //     message: `Hi ${appointment.company}, I received your request!`,
    //     userId: appointment.userId, // Make sure to pass the correct userId here
    //   }
    // );

    // console.log(`response:`, response);
    // if (response.status !== 200) {
    //   throw new Error('Failed to send message');
    // }

    revalidatePath('/admin');
    return parseStringify(newAppointment);
  } catch (error) {
    console.error('Error in createAppointment:', error);
    throw error;
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      'An error occurred while retrieving the existing client:',
      error
    );
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async (company: string) => {
  try {
    // Fetch the appointments
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    // Initialize counts
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Filter by company if provided
    const filteredDocuments = company
      ? appointments.documents.filter((doc) => doc.company === company)
      : appointments.documents;

    // Calculate counts by status
    const counts = (filteredDocuments as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case 'scheduled':
            acc.scheduledCount++;
            break;
          case 'pending':
            acc.pendingCount++;
            break;
          case 'cancelled':
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    // Prepare the response data
    const data = {
      totalCount: filteredDocuments.length, // Update totalCount for filtered results
      ...counts,
      documents: filteredDocuments,
    };

    return parseStringify(data); // Ensure consistent return format
  } catch (error) {
    console.error(
      'An error occurred while retrieving the recent appointments:',
      error
    );
    return null; // Return null explicitly in case of an error
  }
};

//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error('An error occurred while sending sms:', error);
  }
};

//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from BookingUz. ${
      type === 'schedule'
        ? `Your appointment is confirmed for ${
            formatDateTime(appointment.schedule!, timeZone).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${
            formatDateTime(appointment.schedule!, timeZone).dateTime
          } is cancelled. Reason:  ${appointment.cancellationReason}`
    }.`;
    await sendSMSNotification(userId, smsMessage);

    revalidatePath('/admin');
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error('An error occurred while scheduling an appointment:', error);
  }
};
