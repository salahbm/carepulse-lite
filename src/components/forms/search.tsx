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

export const SearchForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof searchValidation>>({
    resolver: zodResolver(searchValidation),
    defaultValues: {
      search: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof searchValidation>) => {
    setIsLoading(true);

    try {
      console.log(values.search);
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
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="search"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/search.svg"
          iconAlt="search"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
