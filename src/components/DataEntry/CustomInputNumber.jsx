import React from 'react';
import { InputNumber } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomInputNumber - Enhanced InputNumber
 */
export const CustomInputNumber = ({
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
        status={error ? 'error' }
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


export const CurrencyInput = ({
  currency = '฿',
  ...props
}) => {
  return (
    <CustomInputNumber
      formatter={(value) => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value?.replace(new RegExp(`\\${currency}\\s?|(,*)`, 'g'), '')}
      {...props}
    />
  );
};

CurrencyInput.displayName = 'CurrencyInput';

// Percentage Input


export const PercentageInput = ({
  allowNegative = false,
  ...props
}) => {
  return (
    <CustomInputNumber
      min={allowNegative ? -100 : 0}
      max={100}
      formatter={(value) => `${value}%`}
      parser={(value) => value?.replace('%', '')}
      {...props}
    />
  );
};

PercentageInput.displayName = 'PercentageInput';

