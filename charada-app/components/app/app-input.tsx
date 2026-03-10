import React from 'react';
import { Input, InputField } from '@/components/ui/input';

type AppInputProps = React.ComponentProps<typeof InputField> & {
  containerClassName?: string;
};

export function AppInput({
  containerClassName,
  className,
  ...props
}: AppInputProps) {
  return (
    <Input
      variant="outline"
      size="md"
      className={`rounded-lg border-[#ddd] bg-white ${containerClassName ?? ''}`.trim()}
    >
      <InputField
        {...props}
        placeholderTextColor={props.placeholderTextColor ?? '#999'}
        className={`text-base text-[#776e65] ${className ?? ''}`.trim()}
      />
    </Input>
  );
}
