"use server";

import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  databases,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined, // password is undefined as we're using phone auth
      user.name
    );
    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      try {
        // Try to find user by email first
        let existingUser = await users.list([
          Query.equal("email", [user.email]),
        ]);

        if (existingUser.users.length > 0) {
          return existingUser.users[0];
        }

        // If not found by email, try by phone
        existingUser = await users.list([Query.equal("phone", [user.phone])]);

        if (existingUser.users.length > 0) {
          return existingUser.users[0];
        }

        // If we still can't find the user, create a new one with a slightly modified email
        const timestamp = Date.now();
        const modifiedEmail = `${user.email.split("@")[0]}_${timestamp}@${user.email.split("@")[1]}`;

        const newUser = await users.create(
          ID.unique(),
          modifiedEmail,
          user.phone,
          undefined,
          user.name
        );

        return parseStringify(newUser);
      } catch (listError) {
        console.error("Error handling existing user:", listError);
        throw listError;
      }
    }
    throw error;
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument, // We'll ignore this for now since it's not in the schema
  ...patientData
}: RegisterUserParams) => {
  try {
    const cleanPatient = {
      userId: patientData.userId,
      name: patientData.name,
      phone: patientData.phone,
      email: patientData.email || "",
      gender: patientData.gender.toLowerCase(),
      company: patientData.company,
      emergencyName: patientData.emergencyName || "",
      emergencyPhone: patientData.emergencyPhone || "",
      privacyConsent: patientData.privacyConsent,
    };

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      cleanPatient
    );

    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("An error occurred while creating a new patient:", error);
    if (error?.code === 400) {
      console.error(
        "Validation error - check required fields:",
        error?.message
      );
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    if (patients.documents.length === 0) {
      return null;
    }

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    return null;
  }
};
