'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { adminSignInValidation } from '@/lib/validation';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import 'react-phone-number-input/style.css';
import SubmitButton from '../shared/submit-btn';
import toast from 'react-hot-toast';
import { companyName } from '@/lib/helpers';
import Cookies from 'js-cookie';
import { encryptKey } from '@/lib/utils';
import { signInCompany } from '@/lib/actions/company.actions';

export const AdminForm = () => {
  const router = useRouter();
  const path = usePathname();
  const company = companyName(path);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof adminSignInValidation>>({
    resolver: zodResolver(adminSignInValidation),
    defaultValues: {
      pwd: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof adminSignInValidation>) => {
    setIsLoading(true);

    try {
      const response = await signInCompany(company, values.pwd);
      if (response) {
        const encryptedKey = encryptKey(values.pwd);
        Cookies.set(`${company}_auth_token`, encryptedKey);
        toast.success('Welcome to Admin!');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!');
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex items-center flex-col justify-center gap-4 "
      >
        <FormField
          control={form.control}
          name="pwd"
          render={({ field }) => (
            <FormItem className="flex-1 mb-6">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Your password must be at least 6 characters. (You have
                registered in the system)
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
      </form>
    </Form>
  );
};
