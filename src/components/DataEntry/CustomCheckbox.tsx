import React from 'react';
import { Checkbox, CheckboxProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { cn } from '../../utils/cn';

export interface CustomCheckboxProps extends CheckboxProps {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

/**
 * CustomCheckbox - Enhanced Checkbox
 */
export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  description,
  error,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <Checkbox {...props}>
        {label || children}
      </Checkbox>
      {description && (
        <span className="ml-6 text-xs text-gray-500 mt-0.5">{description}</span>
      )}
      {error && (
        <span className="ml-6 text-xs text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
};

CustomCheckbox.displayName = 'CustomCheckbox';

// Checkbox Group
export interface CustomCheckboxGroupProps extends Omit<CheckboxGroupProps, 'options'> {
  options: Array<{
    label: string;
    value: string | number;
    disabled?: boolean;
    description?: string;
  }>;
  direction?: 'horizontal' | 'vertical';
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  options,
  direction = 'vertical',
  label,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Checkbox.Group
        {...props}
        className={cn(
          'flex gap-2',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((opt) => (
          <Checkbox key={opt.value} value={opt.value} disabled={opt.disabled}>
            <div>
              <span>{opt.label}</span>
              {opt.description && (
                <span className="block text-xs text-gray-400">{opt.description}</span>
              )}
            </div>
          </Checkbox>
        ))}
      </Checkbox.Group>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

CustomCheckboxGroup.displayName = 'CustomCheckboxGroup';

