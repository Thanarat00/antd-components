import React from 'react';
import { Select, SelectProps, Tag } from 'antd';
import { cn } from '../../utils/cn';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps extends Omit<SelectProps, 'options'> {
  /** Select options */
  options: SelectOption[];
  /** Label for the select */
  label?: string;
  /** Helper text below select */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Custom class name */
  className?: string;
  /** Show search */
  showSearch?: boolean;
  /** Enable multiple selection */
  multiple?: boolean;
  /** Max tag count for multiple mode */
  maxTagCount?: number | 'responsive';
  /** Custom tag render */
  tagRender?: SelectProps['tagRender'];
}

/**
 * CustomSelect - Enhanced Ant Design Select with additional features
 *
 * Features:
 * - Label and helper text support
 * - Error states
 * - Required field indicator
 * - Custom option rendering with icons and descriptions
 * - Multiple selection with tag styling
 */
export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  label,
  helperText,
  error,
  required,
  className,
  showSearch = false,
  multiple = false,
  maxTagCount = 'responsive',
  disabled,
  placeholder = 'กรุณาเลือก',
  ...props
}) => {
  // Transform options for Ant Design Select
  const selectOptions = options.map((opt) => ({
    label: (
      <div className="flex items-center gap-2">
        {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
        <div className="flex flex-col">
          <span>{opt.label}</span>
          {opt.description && (
            <span className="text-xs text-gray-400">{opt.description}</span>
          )}
        </div>
      </div>
    ),
    value: opt.value,
    disabled: opt.disabled,
    // Keep original label for search
    searchLabel: opt.label,
  }));

  // Custom tag render for multiple mode
  const defaultTagRender: SelectProps['tagRender'] = (tagProps) => {
    const { label, closable, onClose } = tagProps;
    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        className="mr-1 flex items-center"
      >
        {label}
      </Tag>
    );
  };

  return (
    <div className={cn('sgn-select-wrapper', className)}>
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

      <Select
        options={selectOptions}
        status={error ? 'error' : undefined}
        disabled={disabled}
        placeholder={placeholder}
        showSearch={showSearch}
        mode={multiple ? 'multiple' : undefined}
        maxTagCount={multiple ? maxTagCount : undefined}
        tagRender={multiple ? (props.tagRender || defaultTagRender) : undefined}
        filterOption={(input, option) => {
          const searchLabel = option?.searchLabel as string;
          return searchLabel?.toLowerCase().includes(input.toLowerCase()) ?? false;
        }}
        className="w-full"
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
};

CustomSelect.displayName = 'CustomSelect';

// Preset select components
export interface StatusOption extends SelectOption {
  color?: string;
}

interface CustomStatusSelectProps extends Omit<CustomSelectProps, 'options'> {
  options: StatusOption[];
}

export const CustomStatusSelect: React.FC<CustomStatusSelectProps> = ({
  options,
  ...props
}) => {
  const statusOptions = options.map((opt) => ({
    ...opt,
    icon: (
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: opt.color || '#1677ff' }}
      />
    ),
  }));

  return <CustomSelect options={statusOptions} {...props} />;
};

CustomStatusSelect.displayName = 'CustomStatusSelect';

