'use server';
import { Query } from 'node-appwrite';
import {
  COMPANY_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '../appwrite.config';
import { parseStringify } from '../utils';

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
