'use client';
import React from 'react';
import { Check } from 'lucide-react';
import { useStepper } from 'headless-stepper';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-select';
import { Button } from '@/components/ui/button';

const steps = [
  { label: 'Owner ' },
  { label: 'Company ' },
  { label: 'Confirmation' },
];

const SetUpCompany = () => {
  const { state, nextStep, prevStep, stepperProps } = useStepper({
    steps,
  });

  const NavSection = () => {
    return (
      <div className="flex flex-row items-center justify-end gap-2">
        <Button
          onClick={() => prevStep()}
          disabled={state.currentStep === 0}
          variant="outline"
          className={cn(
            'block h-11 w-[108px] px-4 py-[10px]',
            state.currentStep === 0 && 'hidden'
          )}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (state.currentStep === steps.length - 1) {
              alert('Success Alert');
            } else {
              nextStep();
            }
          }}
          className={cn('h-11 w-[108px] px-4 py-[10px]')}
        >
          {state.currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    );
  };

  return (
    <>
      <div
        className="z-10 gap-4 flex flow-row w-full items-center justify-center  py-5 px-4"
        {...stepperProps}
      >
        {/* Render the navigation section */}
        {steps?.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col justify-center items-center ">
              <div
                className={cn(
                  'flex h-9 w-9 transform items-center justify-center rounded-full border border-gray-200 text-white transition-all duration-300',
                  index === state.currentStep
                    ? 'bg-green-500'
                    : index <= state.currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-700 text-gray-400'
                )}
              >
                {state.currentStep <= index ? (
                  <p className="text-14-regular">{index + 1}</p>
                ) : (
                  <Check />
                )}
              </div>
              <p
                className={cn(
                  ' mt-2 text-center text-14-regular',
                  index === state.currentStep
                    ? 'text-green-500'
                    : 'text-gray-400'
                )}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <Separator
                className={cn(
                  'h-[2px] mb-4 w-full bg-gray-200',
                  index === state.currentStep
                    ? 'bg-green-500'
                    : index < state.currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8 flex  px-8 py-5">
        <div
          className={cn('hidden w-full', state.currentStep === 0 && 'block')}
        >
          {/* Section 1 */}
        </div>
        <div
          className={cn('hidden w-full', state.currentStep === 1 && 'block')}
        >
          {/* Section 2 */}
        </div>
        <div
          className={cn('hidden w-full', state.currentStep === 2 && 'block')}
        >
          {/* Section 3 */}
        </div>
      </div>

      <NavSection />
    </>
  );
};

export default SetUpCompany;
