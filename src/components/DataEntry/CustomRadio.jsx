import React from 'react';
import { Radio } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomRadio - Enhanced Radio
 */
export const CustomRadio = ({
  label,
  description,
  className,
  children,
  ...props
}) => {
  return (
    <Radio className={className} {...props}>
      <div>
        <span>{label || children}</span>
        {description && (
          <span className="block text-xs text-gray-400">{description}</span>
        )}
      </div>
    </Radio>
  );
};

CustomRadio.displayName = 'CustomRadio';

// Radio Group
>;
  direction?: 'horizontal' | 'vertical';
  label?;
  error?;
  required?;
  variant?: 'default' | 'button' | 'card';
  className?;
}

export const CustomRadioGroup = ({
  options,
  direction = 'vertical',
  label,
  error,
  required,
  variant = 'default',
  className,
  ...props
}) => {
  if (variant === 'button') {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Radio.Group buttonStyle="solid" {...props}>
          {options.map((opt) => (
            <Radio.Button key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Radio.Group {...props} className="w-full">
          <div className={cn('grid gap-3', direction === 'vertical' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3')}>
            {options.map((opt) => (
              <Radio key={opt.value} value={opt.value} disabled={opt.disabled}
                className="border rounded-lg p-3 w-full hover:border-blue-400 [&.ant-radio-wrapper-checked]:border-blue-500 [&.ant-radio-wrapper-checked]:bg-blue-50"
              >
                <div className="ml-2">
                  <div className="font-medium">{opt.label}</div>
                  {opt.description && (
                    <div className="text-xs text-gray-400 mt-0.5">{opt.description}</div>
                  )}
                </div>
              </Radio>
            ))}
          </div>
        </Radio.Group>
        {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Radio.Group
        {...props}
        className={cn(
          'flex gap-2',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((opt) => (
          <Radio key={opt.value} value={opt.value} disabled={opt.disabled}>
            <div>
              <span>{opt.label}</span>
              {opt.description && (
                <span className="block text-xs text-gray-400">{opt.description}</span>
              )}
            </div>
          </Radio>
        ))}
      </Radio.Group>
      {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

CustomRadioGroup.displayName = 'CustomRadioGroup';

