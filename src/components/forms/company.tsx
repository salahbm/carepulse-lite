'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GenderOptions } from '@/constants';

import { CompanyFormValidation } from '@/lib/validation';
import CustomFormField, { FormFieldType } from '../shared/form-field';
import { FileUploader } from '../shared/file-uploader';
import SubmitButton from '../shared/submit-btn';
import { registerCompany } from '@/lib/actions/company.actions';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-number-input/style.css';
import toast from 'react-hot-toast';

const CompanyForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CompanyFormValidation>>({
    resolver: zodResolver(CompanyFormValidation),
    defaultValues: {
      ownerFullName: '',
      ownerPhone: '',
      gender: 'Male',
      name: '',
      phone: '',
      address: '',
      companyType: '',
      businessId: '',
      keywords: '',
      adminPwd: '',
      privacyConsent: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof CompanyFormValidation>) => {
    if (values.privacyConsent === false) {
      return toast.error('Please accept privacy policy');
    }
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (values.logo && values.logo?.length > 0) {
      const blobFile = new Blob([values.logo[0]], {
        type: values.logo[0].type,
      });

      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.logo[0].name);
    }

    try {
      const company = {
        ownerFullName: values.ownerFullName,
        ownerPhone: values.ownerPhone,
        businessId: values.businessId,
        gender: values.gender.toLocaleLowerCase() as Gender,
        name: values.name,
        phone: values.phone,
        address: values.address,
        companyType: values.companyType,
        keywords: values.keywords,
        adminPwd: values.adminPwd,
        logo: values.logo ? formData : undefined,
      };
      const newCompany = await registerCompany(company);

      if (newCompany) {
        router.push(`/set-up/${newCompany.name}`);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-2">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          {/* EMAIL & PHONE */}
          <div className="flex flex-col gap-6 xl:flex-row">
            {/* NAME */}

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="ownerFullName"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
              label="Owner Full Name"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="ownerPhone"
              label="Phone Number"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* BirthDate & Gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div
                        key={option + i}
                        className="flex h-full flex-1 items-center gap-2 rounded border border-dashed p-3"
                      >
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Company/Brand Information</h2>
          </div>

          {/* Business ID & Name */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Company/Brand Name"
              placeholder="Please enter your company name"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="businessId"
              label="Business ID"
              placeholder="Enter your business ID"
            />
          </div>
          {/* Address & Name */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="(555) 123-4567"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, New york, NY - 5101"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Additional Information</h2>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="keywords"
              label="Keywords"
              placeholder="Enter your keywords with comma"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="companyType"
              label="Company Type"
              placeholder="Enter your company type"
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="logo"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Admin Page Details</h2>
            <p className="text-dark-700">
              Admin Password is used to access the admin page.
              <span className="text-red-500 font-semibold ml-2">
                Please, do not forget your password!!!
              </span>
            </p>
          </div>
          <CustomFormField
            iconSrc="/assets/icons/lock.svg"
            iconAlt="Lock"
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="adminPwd"
            label="Admin Password"
            placeholder="Enter your admin password"
          />
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to BookingUz collecting, using, and disclosing my personal information."
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default CompanyForm;
