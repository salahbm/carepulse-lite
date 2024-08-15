'use server';
import { ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { parseStringify } from '../utils';
import {
  BUCKET_ID,
  CLIENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PROJECT_ID,
  storage,
  users,
} from '../appwrite.config';

export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal('email', [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error('An error occurred while creating a new user:', error);
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

    return parseStringify(clients.documents[0]);
  } catch (error) {
    console.error(
      'An error occurred while retrieving the client details:',
      error
    );
  }
};

// REGISTER client
export const registerClient = async ({
  identificationDocument,
  ...client
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get('blobFile') as Blob,
          identificationDocument?.get('fileName') as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new client document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newClient = await databases.createDocument(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...client,
      }
    );

    return parseStringify(newClient);
  } catch (error) {
    console.log(error);
  }
};
