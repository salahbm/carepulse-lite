"use client";

import Image from "next/image";

import { Doctors } from "@/constants";
import { cn, formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "./AppointmentModal";

interface AppointmentCardProps {
  appointment: Appointment;
  noSchedule?: boolean;
}

export const AppointmentCard = ({
  appointment,
  noSchedule,
}: AppointmentCardProps) => {
  // Extract the client ID correctly whether it's a string or object
  const clientId =
    typeof appointment.client === "object" && appointment.client.$id
      ? appointment.client.$id
      : typeof appointment.client === "string"
        ? appointment.client
        : "";

  // Handle client display name
  let clientDisplay = "N/A";
  if (appointment.client) {
    // If client is an object with a name property
    if (typeof appointment.client === "object" && appointment.client.name) {
      clientDisplay = appointment.client.name;
    }
    // If client is a string ID
    else if (typeof appointment.client === "string") {
      clientDisplay = appointment.client;
    }
  }

  // Use default doctor
  const defaultDoctor = Doctors[0];

  return (
    <div className="w-full rounded-lg border bg-dark-400 p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-16-semibold">Appointment</h3>
        <span
          className={cn(`rounded-lg capitalize px-2 text-xs p-1`, {
            "bg-green-100 text-green-800": appointment.status === "scheduled",
            "bg-yellow-100 text-yellow-800": appointment.status === "pending",
            "bg-red-100 text-red-800": appointment.status === "cancelled",
          })}
        >
          {appointment.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-14-medium text-gray-500">Patient:</span>
          <span className="text-14-medium">{clientDisplay}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-14-medium text-gray-500">Date:</span>
          <span className="text-14-medium">
            {
              formatDateTime(new Date(appointment.schedule), "America/New_York")
                .dateOnly
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-14-medium text-gray-500">Time:</span>
          <span className="text-14-medium">
            {
              formatDateTime(new Date(appointment.schedule), "America/New_York")
                .timeOnly
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-14-medium text-gray-500">Doctor:</span>
          <div className="flex items-center gap-2">
            <Image
              src={defaultDoctor?.image || "/assets/icons/doctor.svg"}
              alt="doctor"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-14-medium">
              Dr. {defaultDoctor?.name || "David Livingston"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-14-medium text-gray-500">Reason:</span>
          <span className="text-14-medium">{appointment.reason || "N/A"}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!noSchedule && (
          <AppointmentModal
            patientId={clientId}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
        )}
        <AppointmentModal
          patientId={clientId}
          userId={appointment.userId}
          appointment={appointment}
          type="cancel"
          title="Cancel Appointment"
          description="Are you sure you want to cancel your appointment?"
        />
      </div>
    </div>
  );
};
