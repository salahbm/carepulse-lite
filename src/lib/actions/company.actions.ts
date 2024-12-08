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
import { decryptKey, parseStringify } from '../utils';
import { createErrorResponse } from './errorHandler';
import { TCompany } from '@/types/appwrite.types';

// Types
interface CompanyResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// Cache implementation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const companyCache = new Map<string, { data: any; timestamp: number }>();

// Utility functions
const getCachedData = (key: string) => {
  const cached = companyCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  companyCache.set(key, { data, timestamp: Date.now() });
};

// GET SEARCHED COMPANY
export async function searchCompany(name: string): Promise<CompanyResponse<TCompany[]>> {
  try {
    if (!name?.trim()) {
      return createErrorResponse('Company name is required', 'INVALID_INPUT');
    }

    const cacheKey = `search_${name}`;
    const cachedResult = getCachedData(cacheKey);
    if (cachedResult) {
      return { data: cachedResult };
    }

    const companies = await databases.listDocuments(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      [Query.startsWith('name', name), Query.equal('isVerified', true)]
    );

    if (companies.documents.length > 0) {
      const result = companies.documents.map((doc) => parseStringify(doc));
      setCachedData(cacheKey, result);
      return { data: result };
    }

    return createErrorResponse('No companies found', 'NOT_FOUND');
  } catch (error) {
    console.error('Search company error:', error);
    return createErrorResponse(
      'Failed to search companies',
      'SEARCH_ERROR'
    );
  }
}

// GET COMPANY
export async function getCompany(company: string): Promise<CompanyResponse<TCompany>> {
  try {
    if (!company?.trim()) {
      return createErrorResponse('Company name is required', 'INVALID_INPUT');
    }

    const cacheKey = `company_${company}`;
    const cachedResult = getCachedData(cacheKey);
    if (cachedResult) {
      return { data: cachedResult };
    }

    const clients = await databases.listDocuments(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      [Query.equal('name', [company])]
    );

    if (!clients.documents.length) {
      return createErrorResponse('Company not found', 'NOT_FOUND');
    }

    const result = parseStringify(clients.documents[0]);
    setCachedData(cacheKey, result);
    return { data: result };
  } catch (error) {
    console.error('Get company error:', error);
    return createErrorResponse(
      'Failed to get company details',
      'FETCH_ERROR'
    );
  }
}

// CREATE COMPANY
export async function registerCompany(
  { logo, ...data }: SetUpCompanyParams
): Promise<CompanyResponse<any>> {
  try {
    if (!data.name || !data.adminPwd) {
      return createErrorResponse(
        'Company name and admin password are required',
        'INVALID_INPUT'
      );
    }

    let fileId = null;
    if (logo) {
      try {
        const blobFile = logo?.get('blobFile');
        const fileName = logo?.get('fileName') as string;

        if (!blobFile || !fileName) {
          return createErrorResponse('Invalid logo file', 'INVALID_INPUT');
        }

        // @ts-expect-error The property 'arrayBuffer' does not exist on type 'Blob'.
        const arrayBuffer = await blobFile!.arrayBuffer();
        const inputFile = InputFile.fromBuffer(Buffer.from(arrayBuffer), fileName);

        const file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        fileId = file.$id;
      } catch (error) {
        console.error('Logo upload error:', error);
        return createErrorResponse('Failed to upload logo', 'UPLOAD_ERROR');
      }
    }

    const newCompany = await databases.createDocument(
      DATABASE_ID!,
      COMPANY_COLLECTION_ID!,
      ID.unique(),
      {
        ...data,
        logoUrl: fileId
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
          : null,
        createdAt: new Date().toISOString(),
      }
    );

    const result = parseStringify(newCompany);
    // Clear search cache when new company is added
    companyCache.clear();
    return { data: result };
  } catch (error) {
    console.error('Register company error:', error);
    return createErrorResponse(
      'Failed to register company',
      'REGISTRATION_ERROR'
    );
  }
}

// SIGN IN COMPANY
export async function signInCompany(
  company: string,
  pwd: string
): Promise<CompanyResponse<TCompany>> {
  try {
    if (!company?.trim() || !pwd?.trim()) {
      return createErrorResponse(
        'Company name and password are required',
        'INVALID_INPUT'
      );
    }

    const companyData = await getCompany(company);
    if (companyData.error) {
      return createErrorResponse('Invalid credentials', 'AUTHENTICATION_FAILED');
    }

    const adminPwd = decryptKey(companyData.data?.adminPwd || '');
    if (adminPwd !== pwd) {
      return createErrorResponse('Invalid credentials', 'AUTHENTICATION_FAILED');
    }

    return { data: companyData.data };
  } catch (error) {
    console.error('Sign in error:', error);
    return createErrorResponse(
      'Failed to sign in',
      'AUTHENTICATION_ERROR'
    );
  }
}
