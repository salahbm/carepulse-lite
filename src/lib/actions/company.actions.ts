'use server';
import { ID, Query } from 'node-appwrite';
import {
  COMPANY_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '../appwrite.config';
import { parseStringify } from '../utils';
import { z } from 'zod';
import { CompanyFormValidation } from '../validation';

// GET SEARCHED COMPANY
export const searchCompany = async (name: string) => {
  try {
    console.log(DATABASE_ID, '-', COMPANY_COLLECTION_ID!);

    const companies = await databases.listDocuments(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      [Query.startsWith('name', name)]
    );
    console.log(companies);

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
export const registerCompany = async (
  data: z.infer<typeof CompanyFormValidation>
) => {
  try {
    // Create new client document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newCompany = await databases.createDocument(
      ID.unique(),
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      {
        name: data.name,
        phone: data.phone,
        ownerFullName: data.ownerFullName,
        ownerPhone: data.ownerPhone,
        gender: data.gender,
      }
    );
    return parseStringify(newCompany);
  } catch (error) {
    console.log('An error occurred while creating a new company:', error);
  }
};
