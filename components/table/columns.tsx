"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "client",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      // Handle client field which might be an object or string ID
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

      return <p className="text-14-medium ">{clientDisplay}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    header: "Doctor",
    cell: ({ row }) => {
      // Use default doctor since primaryPhysician is not in the schema
      const defaultDoctor = Doctors[0];

      return (
        <div className="flex items-center gap-3">
          <Image
            src={defaultDoctor?.image || "/assets/icons/doctor.svg"}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">
            Dr. {defaultDoctor?.name || "David Livingston"}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      // Extract the client ID correctly whether it's a string or object
      const clientId =
        typeof appointment.client === "object" && appointment.client.$id
          ? appointment.client.$id
          : typeof appointment.client === "string"
            ? appointment.client
            : "";

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={clientId}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={clientId}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];
