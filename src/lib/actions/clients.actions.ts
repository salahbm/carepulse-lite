'use server';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';
import {
  CLIENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  users,
} from '../appwrite.config';

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Check if a user with the given name and phone number already exists
    const existingUserList = await users.list([
      Query.equal('phone', user.phone),
      Query.equal('name', user.name),
    ]);

    if (existingUserList.total > 0) {
      return parseStringify(existingUserList.users[0]);
    }

    // If no user exists, create a new user
    const newUser = await users.create(
      ID.unique(),
      undefined,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    console.error('An error occurred while creating a new user:', error);
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
      'An error occurred while retrieving the user details:',
      error
    );
  }
};

// GET ClIENT
export const getClient = async (userId: string) => {
  try {
    const clients = await databases.listDocuments(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID!,
      [Query.equal('$id', [userId])]
    );

    return parseStringify(clients.documents[0]);
  } catch (error: any) {
    console.error(
      'An error occurred while retrieving the client details:',
      error.message || error
    );
  }
};

// REGISTER client
export const registerClient = async ({ ...client }: RegisterUserParams) => {
  try {
    // Create new client document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newClient = await databases.createDocument(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID!,
      ID.unique(),
      { ...client }
    );

    return parseStringify(newClient);
  } catch (error) {
    console.log('An error occurred while creating a new client:', error);
  }
};
