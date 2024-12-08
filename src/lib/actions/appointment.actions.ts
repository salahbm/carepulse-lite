'use server';

import { revalidatePath } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import { Appointment } from '@/types/appwrite.types';
import axios from 'axios';
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '../appwrite.config';
import { formatDateTime, parseStringify } from '../utils';
import { BASE_URL } from '@/constants/base_url';
import { createErrorResponse } from './errorHandler';

// Types for internal use
type AppointmentResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
};

// Helper function to send Telegram notification
async function sendTelegramNotification(appointment: CreateAppointmentParams) {
  try {
    const message = `
🆕 New Appointment!
👤 Company: ${appointment.company}
📅 Date: ${formatDateTime(appointment.schedule)}
⏰ Reason: ${appointment.reason}
🏷️ Status: ${appointment.status}
    `;

    const response = await axios.post(
      `${BASE_URL}/api/telegram/new-appointment`,
      {
        message,
        userId: appointment.userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.error('Failed to send Telegram notification:', response.statusText);
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
    // Don't throw error to prevent appointment creation failure
  }
}

// CREATE APPOINTMENT
export async function createAppointment(
  appointment: CreateAppointmentParams
): Promise<AppointmentResponse<any>> {
  try {
    if (!appointment.company || !appointment.schedule || !appointment.reason || !appointment.userId) {
      return createErrorResponse(
        'Company, schedule, reason, and user ID are required',
        'INVALID_INPUT'
      );
    }

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      {
        ...appointment,
        createdAt: new Date().toISOString(),
        status: appointment.status || 'pending',
      }
    );

    // Send Telegram notification asynchronously
    sendTelegramNotification(appointment).catch(error => {
      console.error('Failed to send Telegram notification:', error);
    });

    revalidatePath('/admin');
    return { data: parseStringify(newAppointment) };
  } catch (error) {
    console.error('Create appointment error:', error);
    return createErrorResponse(
      'Failed to create appointment',
      'CREATION_ERROR'
    );
  }
}

// GET APPOINTMENT
export async function getAppointment(appointmentId: string): Promise<AppointmentResponse<any>> {
  try {
    if (!appointmentId?.trim()) {
      return createErrorResponse('Appointment ID is required', 'INVALID_INPUT');
    }

    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return { data: parseStringify(appointment) };
  } catch (error) {
    console.error('Get appointment error:', error);
    return createErrorResponse(
      'Failed to get appointment',
      'FETCH_ERROR'
    );
  }
}

// GET RECENT APPOINTMENTS
export async function getRecentAppointmentList(company?: string): Promise<AppointmentResponse<any>> {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(50) // Limit results for better performance
      ]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Filter and process appointments
    const filteredDocuments = company
      ? appointments.documents.filter((doc) => doc.company === company)
      : appointments.documents;

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
      { ...initialCounts }
    );

    return {
      data: {
        appointments: parseStringify(filteredDocuments),
        counts,
      }
    };
  } catch (error) {
    console.error('Get recent appointments error:', error);
    return createErrorResponse(
      'Failed to get recent appointments',
      'FETCH_ERROR'
    );
  }
}

// UPDATE APPOINTMENT
export async function updateAppointment({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams): Promise<AppointmentResponse<any>> {
  try {
    if (!appointmentId || !userId || !appointment) {
      return createErrorResponse(
        'Appointment ID, user ID, and appointment data are required',
        'INVALID_INPUT'
      );
    }

    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      {
        ...appointment,
        updatedAt: new Date().toISOString(),
      }
    );

    revalidatePath('/admin');

    // Send notification if status changed
    if (type === 'status' && appointment.status) {
      await sendTelegramNotification({
        ...appointment,
        userId,
        message: `
📅 Appointment Update
Status changed to: ${appointment.status}
Date: ${formatDateTime(appointment.schedule, timeZone)}
        `,
      });
    }

    return { data: parseStringify(updatedAppointment) };
  } catch (error) {
    console.error('Update appointment error:', error);
    return createErrorResponse(
      'Failed to update appointment',
      'UPDATE_ERROR'
    );
  }
}
