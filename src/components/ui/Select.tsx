import { ChangeEvent, forwardRef, SelectHTMLAttributes } from 'react';
import {
  Select as PolarisSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@polaris/ui';
import { ErrorIcon } from '@polaris/ui/icons';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      options,
      placeholder,
      id,
      value,
      defaultValue,
      onChange,
      disabled,
      name,
      required,
    },
    ref
  ) => {
    void ref;

    const handleValueChange = (nextValue: string) => {
      onChange?.({
        target: { value: nextValue },
        currentTarget: { value: nextValue },
      } as ChangeEvent<HTMLSelectElement>);
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-label-neutral">
            {label}
          </label>
        )}
        <PolarisSelect
          value={value === undefined ? undefined : String(value)}
          defaultValue={defaultValue === undefined ? undefined : String(defaultValue)}
          onValueChange={handleValueChange}
          disabled={disabled}
          name={name}
          required={required}
        >
          <SelectTrigger id={id} className={cn('w-full', className)} aria-invalid={!!error}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </PolarisSelect>
        {error && (
          <p className="mt-1 flex items-center gap-1 text-xs text-state-error">
            <ErrorIcon className="h-3 w-3" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
