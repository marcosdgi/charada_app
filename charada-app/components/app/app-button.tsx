import React from 'react';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';

type AppButtonProps = Omit<React.ComponentProps<typeof Button>, 'children'> & {
  label: string;
  isLoading?: boolean;
  textClassName?: string;
};

export function AppButton({
  label,
  isLoading = false,
  disabled,
  className,
  textClassName,
  ...props
}: AppButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      className={`rounded-lg bg-[#8f7a66] ${className ?? ''}`.trim()}
    >
      {isLoading ? <ButtonSpinner color="#f9f6f2" /> : null}
      <ButtonText className={`text-[#f9f6f2] font-semibold ${textClassName ?? ''}`.trim()}>
        {label}
      </ButtonText>
    </Button>
  );
}
