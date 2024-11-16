'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import { searchValidation } from '@/lib/validation';

import CustomFormField, { FormFieldType } from '../shared/form-field';
import 'react-phone-number-input/style.css';
import SubmitButton from '../shared/submit-btn';
import toast from 'react-hot-toast';
import { searchCompany } from '@/lib/actions/company.actions';
import Link from 'next/link';
import { TCompany } from '@/types/appwrite.types';
import Image from 'next/image';

export const SearchForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState<TCompany[]>([]);

  const form = useForm<z.infer<typeof searchValidation>>({
    resolver: zodResolver(searchValidation),
    defaultValues: {
      search: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof searchValidation>) => {
    setIsLoading(true);

    try {
      const getCompany = await searchCompany(values.search);

      if (getCompany) {
        setCompanyList(getCompany);
      } else {
        toast.error('Company not found!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="font-header-1">Hi there 👋</h1>
          <p className="text-dark-700 font-body-1">
            Get started with appointments.
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="search"
          placeholder="Search for the company"
          iconSrc="/assets/icons/search.svg"
          iconAlt="search"
        />
        <div className="w-full max-h-[350px] overflow-y-auto    px-2">
          {companyList.length > 0 && (
            <div className="gap-2 flex flex-col">
              {companyList.map((company) => (
                <Link
                  href={`/${company.name}`}
                  key={company.$id}
                  className="text-white"
                >
                  <div className="inline-flex items-center justify-between gap-2">
                    <Image
                      src={company.logoUrl || '/assets/icons/logo-icon.png'}
                      alt="company logo"
                      width={50}
                      height={50}
                      className="rounded-full object-contain h-10 w-10"
                    />
                    <div>
                      <p className="text-lg font-semibold">{company.name}</p>
                      <p className="text-mg font-medium">{company.address}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
