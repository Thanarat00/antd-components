import React, { forwardRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { cn } from '../../utils/cn';

/**
 * CustomInput - Enhanced Ant Design Input with additional features
 *
 * Features:
 * - Label and helper text support
 * - Error and success states
 * - Required field indicator
 * - Tailwind CSS styling integration
 */
export const CustomInput = forwardRef(
  (
    {
      size = 'middle',
      label,
      helperText,
      error,
      success,
      required,
      className,
      variant = 'outlined',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputStatus = error ? 'error' : success ? '' : undefined;

    return (
      <div className={cn('sgn-input-wrapper', className)}>
        {label && (
          <label
            className={cn(
              'block mb-1.5 text-sm font-medium text-gray-700',
              disabled && 'text-gray-400',
              error && 'text-red-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Input
          ref={ref}
          size={size}
          status={inputStatus}
          variant={variant}
          disabled={disabled}
          className={cn(
            'sgn-input',
            success && 'border-green-500 hover:border-green-400 focus:border-green-500',
            error && 'border-red-500'
          )}
          {...props}
        />

        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

// Additional Input variants
export const CustomSearchInput = forwardRef(
  (props, ref) => (
    <CustomInput ref={ref} prefix={<SearchOutlined />} placeholder="ค้นหา..." {...props} />
  )
);

CustomSearchInput.displayName = 'CustomSearchInput';

export const CustomPasswordInput = forwardRef(
  ({ ...props }, ref) => {
    const { label, helperText, error, success, required, className, disabled, ...inputProps } = props;
    
    return (
      <div className={cn('sgn-input-wrapper', className)}>
        {label && (
          <label
            className={cn(
              'block mb-1.5 text-sm font-medium text-gray-700',
              disabled && 'text-gray-400',
              error && 'text-red-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Input.Password
          ref={ref}
          status={error ? 'error' : undefined}
          disabled={disabled}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          className={cn(
            'sgn-input',
            success && 'border-green-500',
            error && 'border-red-500'
          )}
          {...inputProps}
        />

        {(helperText || error) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-red-500' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

CustomPasswordInput.displayName = 'CustomPasswordInput';

export const CustomTextArea = forwardRef(
  ({ rows = 4, ...props }, ref) => {
    const { label, helperText, error, success, required, className, disabled, showCount, maxLength, ...inputProps } = props;

    return (
      <div className={cn('sgn-input-wrapper', className)}>
        {label && (
          <label
            className={cn(
              'block mb-1.5 text-sm font-medium text-gray-700',
              disabled && 'text-gray-400',
              error && 'text-red-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Input.TextArea
          ref={ref}
          rows={rows}
          status={error ? 'error' : undefined}
          disabled={disabled}
          showCount={showCount}
          maxLength={maxLength}
          className={cn(
            'sgn-input',
            success && 'border-green-500',
            error && 'border-red-500'
          )}
          {...inputProps}
        />

        {(helperText || error) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-red-500' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

CustomTextArea.displayName = 'CustomTextArea';
