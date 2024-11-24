import Image from 'next/image';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const SubmitButton = ({
  isLoading,
  className,
  children,
  disabled,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={isLoading || disabled}
      className={cn(className ?? 'w-full', 'h-11')}
    >
      {isLoading ? (
        <div className="flex items-center gap-4 text-white">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin fill-white"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
