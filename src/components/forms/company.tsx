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
import { SelectItem } from '@/components/ui/select';
import { Doctors, GenderOptions, IdentificationTypes } from '@/constants';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-number-input/style.css';
import { CompanyFormValidation } from '@/lib/validation';
import CustomFormField, { FormFieldType } from '../shared/form-field';
import { FileUploader } from '../shared/file-uploader';
import SubmitButton from '../shared/submit-btn';

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
      logoUrl: '',
      adminPwd: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CompanyFormValidation>) => {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    // if (
    //   values.logoUrl &&
    //   values.logoUrl?.length > 0
    // ) {
    //   const blobFile = new Blob([values.identificationDocument[0]], {
    //     type: values.identificationDocument[0].type,
    //   });

    //   formData = new FormData();
    //   formData.append("blobFile", blobFile);
    //   formData.append("fileName", values.identificationDocument[0].name);
    // }

    try {
      //   const patient = {
      //     name: values.name,
      //     phone: values.phone,
      //     gender: values.gender,
      //     address: values.address,
      //     identificationDocument: values.identificationDocument
      //       ? formData
      //       : undefined,
      //   };
    } catch (error) {
      console.log(error);
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

        <section className="space-y-6">
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
                      <div key={option + i} className="radio-group">
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
              iconSrc="/assets/icons/lock.svg"
              iconAlt="Lock"
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="adminPwd"
              label="Admin Password"
              placeholder="Enter your admin password"
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
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
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default CompanyForm;
