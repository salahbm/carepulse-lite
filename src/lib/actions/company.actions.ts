'use server';
import { ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import {
  BUCKET_ID,
  COMPANY_COLLECTION_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PROJECT_ID,
  storage,
} from '../appwrite.config';
import { parseStringify } from '../utils';

// GET SEARCHED COMPANY
export const searchCompany = async (name: string) => {
  try {
    const companies = await databases.listDocuments(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      [Query.startsWith('name', name), Query.equal('isVerified', true)]
    );

    if (companies.documents.length > 0) {
      return companies.documents.map((doc) => parseStringify(doc));
    } else {
      console.log('No companies found with similar names.');
      return null;
    }
  } catch (error) {
    console.error(
      'An error occurred while retrieving the company details:',
      error
    );
  }
};

// GET SEARCHED COMPANY
export const getCompany = async (company: string) => {
  try {
    const clients = await databases.listDocuments(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      [Query.equal('name', [company])]
    );

    return parseStringify(clients.documents[0]);
  } catch (error) {
    console.error(
      'An error occurred while retrieving the client details:',
      error
    );
  }
};

// CREATE COMPANY
export const registerCompany = async ({
  logo,
  ...data
}: SetUpCompanyParams) => {
  try {
    let file;
    if (logo) {
      const blobFile = logo?.get('blobFile');
      const fileName = logo?.get('fileName') as string;

      // Ensure the blob is converted to ArrayBuffer first
      // @ts-expect-error ts(2322)
      const arrayBuffer = await blobFile!.arrayBuffer();
      const inputFile = InputFile.fromBuffer(
        Buffer.from(arrayBuffer),
        fileName
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new client document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newCompany = await databases.createDocument(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      ID.unique(),
      {
        logoUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...data,
      }
    );
    return parseStringify(newCompany);
  } catch (error) {
    console.log('An error occurred while creating a new company:', error);
  }
};
