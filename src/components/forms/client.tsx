'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import { UserFormValidation } from '@/lib/validation';

import CustomFormField, { FormFieldType } from '../shared/form-field';
import 'react-phone-number-input/style.css';
import SubmitButton from '../shared/submit-btn';
import { createUser } from '@/lib/actions/clients.actions';
import toast from 'react-hot-toast';
import { companyName, firstLetterUppercase } from '@/lib/helpers';

export const ClientForm = ({
  user,
}: {
  user?: { name: string; phone: string };
}) => {
  const router = useRouter();
  const path = usePathname();
  const company = companyName(path);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        phone: values.phone,
      };
      const newUser = await createUser(user);
      if (newUser) {
        router.push(`${path}/clients/${newUser.$id}/new-appointment`);
        toast.success(`Welcome to ${firstLetterUppercase(company)}!`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!');
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12">
          <h1 className="font-header-1">
            Welcome to {firstLetterUppercase(company)}
          </h1>
          <p className="text-dark-600 font-body-1 mt-2">
            Log in or sign up to get started
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(998) 123-45-67"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
