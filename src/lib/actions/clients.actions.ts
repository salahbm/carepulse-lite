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
import { createErrorResponse } from './errorHandler';
import { TClient } from '@/types/appwrite.types';

// Types for internal use
type ClientResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
};

// CREATE USER
export async function createUser(user: CreateUserParams): Promise<ClientResponse<TClient>> {
  try {
    if (!user.phone || !user.name) {
      return createErrorResponse('Phone and name are required', 'INVALID_INPUT');
    }

    // Store data in Cookie to check if user is authenticated
    const cookie = await cookies();
    cookie.set('user', JSON.stringify(user), {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Check if a user with the given name and phone number already exists
    const existingUserList = await users.list([
      Query.equal('phone', user.phone),
      Query.equal('name', user.name),
      Query.limit(1),
    ]);

    if (existingUserList.total > 0) {
      return { data: parseStringify(existingUserList.users[0]) };
    }

    // If no user exists, create a new user
    const newUser = await users.create(
      ID.unique(),
      undefined,
      user.phone,
      undefined,
      user.name
    );

    return { data: parseStringify(newUser) };
  } catch (error) {
    console.error('Create user error:', error);
    return createErrorResponse('Failed to create user', 'CREATION_ERROR');
  }
}

// GET USER
export async function getUser(userId: string): Promise<ClientResponse<TClient>> {
  try {
    if (!userId?.trim()) {
      return createErrorResponse('User ID is required', 'INVALID_INPUT');
    }

    const user = await users.get(userId);
    return { data: parseStringify(user) };
  } catch (error) {
    console.error('Get user error:', error);
    return createErrorResponse('Failed to get user', 'FETCH_ERROR');
  }
}

// GET CLIENT
export const getClient = async (userId: string) => {
  try {
    const client = await databases.listDocuments(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    if (client.documents.length === 0) {
      return { error: { code: 'NOT_FOUND', message: 'Client not found' } };
    }   

    return { data: parseStringify(client) };
  } catch (docError: any) {
    if (docError!.code === 404) {
      return createErrorResponse('Client not found', 'NOT_FOUND');
    }
    console.error('Get client error:', docError);
    return createErrorResponse('Failed to get client', 'FETCH_ERROR');
    }

}

// REGISTER CLIENT
export async function registerClient(client: RegisterUserParams): Promise<ClientResponse<TClient>> {
  try {
    if (!client.userId || !client.name || !client.phone) {
      return createErrorResponse(
        'User ID, name, and phone are required',
        'INVALID_INPUT'
      );
    }

    // Create new client document
    const newClient = await databases.createDocument(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID!,
      client.userId,
      {
        name: client.name,
        phone: client.phone,
        createdAt: new Date().toISOString(),
      }
    );

    return { data: parseStringify(newClient) };
  } catch (error) {
    console.error('Register client error:', error);
    return createErrorResponse('Failed to register client', 'REGISTRATION_ERROR');
  }
}
