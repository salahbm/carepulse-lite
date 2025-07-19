"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { sendTwilioSMS } from "../twilio.config";
import { formatDateTime, parseStringify } from "../utils";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    // Create a clean object with ONLY the fields that exist in your Appwrite schema
    // Only include fields that are in the actual schema
    const cleanAppointment = {
      userId: appointment.userId, // This is the user ID field
      client: appointment.patient, // Using client field for the patient relationship
      schedule: appointment.schedule,
      reason: appointment.reason,
      status: appointment.status,
      note: appointment.note || "",
      company: appointment.company || "Unknown",
    };

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      cleanAppointment
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error: any) {
    console.error("An error occurred while creating a new appointment:", error);
    if (error?.code === 400) {
      console.error(
        "Validation error - check required fields:",
        error?.message
      );
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
      return {
        totalCount: 0,
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
        documents: [],
      };
    }

    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (
  phoneNumber: string,
  content: string
) => {
  try {
    const result = await sendTwilioSMS(phoneNumber, content);
    return result;
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
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
    const updateData = {
      schedule: appointment.schedule,
      status: appointment.status,
      company: appointment.company || "Unknown",
      ...(appointment.cancellationReason
        ? { cancellationReason: appointment.cancellationReason }
        : {}),
    };

    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      updateData
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;

    // Just use userId for SMS since we don't have direct access to patient phone here
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
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
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};
