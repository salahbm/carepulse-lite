'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { searchValidation } from '@/lib/validation';
import CustomFormField, { FormFieldType } from '../shared/form-field';
import 'react-phone-number-input/style.css';
import toast from 'react-hot-toast';
import { searchCompany } from '@/lib/actions/company.actions';
import Link from 'next/link';
import { TCompany } from '@/types/appwrite.types';
import Image from 'next/image';
import { useDebounce } from '@/hook/use-debounce';

// Types
interface SearchState {
  isLoading: boolean;
  error: string | null;
  companies: TCompany[];
}

export const SearchForm = () => {
  const router = useRouter();
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    companies: [],
  });

  // Form setup with validation
  const form = useForm<z.infer<typeof searchValidation>>({
    resolver: zodResolver(searchValidation),
    defaultValues: {
      search: '',
    },
  });

  // Get form values
  const searchValue = form.watch('search');
  const debouncedSearch = useDebounce(searchValue, 500);

  // Search handler with error boundaries
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState(prev => ({ ...prev, companies: [], error: null }));
      return;
    }

    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const companies = await searchCompany(query);
      setSearchState((prev:any) => ({
        ...prev,
        companies: companies?.data || [],
        error: companies?.error ? companies.error.message : null,
      }));
    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({
        ...prev,
        error: 'Failed to search companies',
        companies: [],
      }));
      toast.error('Failed to search companies. Please try again.');
    } finally {
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Auto-search effect
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  return (
    <Form {...form}>
      <div className="flex-1 space-y-6">
        <section className="my-12 space-y-4">
          <h1 className="font-header-1">Hi there 👋</h1>
          <p className="text-dark-700 font-body-1">
            Get started with appointments.
          </p>
        </section>

        <div className="relative">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="search"
            placeholder="Search for the company"
            iconSrc="/assets/icons/search.svg"
            iconAlt="search"
            aria-label="Search company name"
            aria-describedby="search-description"
          />
          <div 
            id="search-description" 
            className="sr-only"
          >
            Enter a company name to search for available appointments
          </div>
        </div>

        {/* Results section with loading and error states */}
        <div 
          className="w-full max-h-[350px] rounded overflow-x-hidden overflow-y-auto bg-accent/10"
          role="region"
          aria-label="Search results"
          aria-live="polite"
        >
          {searchState.isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          )}

          {searchState.error && (
            <div className="p-4 text-center text-red-400">
              {searchState.error}
            </div>
          )}

          {searchState.companies.length > 0 && (
            <ul 
              className="gap-2 flex flex-col [&>li:last-child]:border-none [&>li]:border-b p-4"
              role="listbox"
            >
              {searchState.companies.map((company) => (
                <Link
                  href={`/${company.name}`}
                  key={company.$id}
                  className="text-white group focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                >
                  <li 
                    className="inline-flex items-center justify-start gap-2 w-full p-2 hover:bg-accent/20 rounded-lg transition-colors"
                    role="option"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={company.logoUrl || '/assets/logos/logo.png'}
                        alt={`${company.name} logo`}
                        fill
                        className="rounded-full object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold group-hover:underline truncate">
                        {company.name}
                      </p>
                      {company.address && (
                        <p className="text-mg font-medium text-gray-300 truncate">
                          {company.address}
                        </p>
                      )}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Form>
  );
};
