import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomInputNumberProps extends InputNumberProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * CustomInputNumber - Enhanced InputNumber
 */
export const CustomInputNumber: React.FC<CustomInputNumberProps> = ({
  label,
  helperText,
  error,
  required,
  fullWidth = false,
  prefix,
  suffix,
  className,
  disabled,
  ...props
}) => {
  return (
    <div className={cn(fullWidth && 'w-full', className)}>
      {label && (
        <label className={cn(
          'block text-sm font-medium text-gray-700 mb-1',
          disabled && 'text-gray-400',
          error && 'text-red-500'
        )}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <InputNumber
        status={error ? 'error' : undefined}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        className={cn(fullWidth && 'w-full')}
        {...props}
      />
      {(helperText || error) && (
        <p className={cn('mt-1 text-xs', error ? 'text-red-500' : 'text-gray-500')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

CustomInputNumber.displayName = 'CustomInputNumber';

// Currency Input
export interface CurrencyInputProps extends Omit<CustomInputNumberProps, 'formatter' | 'parser'> {
  currency?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  currency = '฿',
  ...props
}) => {
  return (
    <CustomInputNumber
      formatter={(value) => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value?.replace(new RegExp(`\\${currency}\\s?|(,*)`, 'g'), '') as unknown as number}
      {...props}
    />
  );
};

CurrencyInput.displayName = 'CurrencyInput';

// Percentage Input
export interface PercentageInputProps extends Omit<CustomInputNumberProps, 'min' | 'max' | 'formatter' | 'parser'> {
  allowNegative?: boolean;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  allowNegative = false,
  ...props
}) => {
  return (
    <CustomInputNumber
      min={allowNegative ? -100 : 0}
      max={100}
      formatter={(value) => `${value}%`}
      parser={(value) => value?.replace('%', '') as unknown as number}
      {...props}
    />
  );
};

PercentageInput.displayName = 'PercentageInput';

