'use server';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';
import {
  CLIENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  users,
} from '../appwrite.config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  // Store data in Cookie to check if user is authenticated
  const cookie = await cookies();
  cookie.set('user', JSON.stringify(user), {
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

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
      [Query.equal('userId', [userId])]
    );

    if (!clients.documents || clients.documents.length === 0) {
      console.warn(`No client found for userId: ${userId}`);
      throw new Error(`No client found for userId: ${userId}`);
    }

    return parseStringify(clients.documents[0]);
  } catch (error: any) {
    console.error('An error occurred:', error.message || error);
    return NextResponse.error();
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
    throw new Error('An error occurred while creating a new client', {
      cause: error,
    });
  }
};
