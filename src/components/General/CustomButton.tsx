import React from 'react';
import { Button, ButtonProps, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CustomButtonProps extends ButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  /** Full width */
  fullWidth?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Custom class */
  className?: string;
}

const variantMap: Record<string, { type?: ButtonProps['type']; danger?: boolean; ghost?: boolean }> = {
  primary: { type: 'primary' },
  secondary: { type: 'default' },
  success: { type: 'primary', ghost: false },
  warning: { type: 'primary' },
  danger: { type: 'primary', danger: true },
  ghost: { ghost: true },
  link: { type: 'link' },
};

/**
 * CustomButton - Enhanced Ant Design Button
 */
export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  loading,
  disabled,
  ...props
}) => {
  const variantProps = variantMap[variant] || variantMap.primary;

  const colorClass = {
    success: 'bg-green-500 hover:bg-green-600 border-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500',
  }[variant];

  return (
    <Button
      {...variantProps}
      disabled={disabled}
      loading={loading}
      className={cn(
        fullWidth && 'w-full',
        colorClass,
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        {leftIcon && !loading && leftIcon}
        {children}
        {rightIcon && !loading && rightIcon}
      </span>
    </Button>
  );
};

CustomButton.displayName = 'CustomButton';

// Button Group
export interface CustomButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'middle' | 'large';
}

export const CustomButtonGroup: React.FC<CustomButtonGroupProps> = ({
  children,
  className,
  direction = 'horizontal',
  size = 'middle',
}) => {
  return (
    <Space
      direction={direction}
      size={size}
      className={className}
    >
      {children}
    </Space>
  );
};

CustomButtonGroup.displayName = 'CustomButtonGroup';

// Icon Button
export interface IconButtonProps extends Omit<ButtonProps, 'shape'> {
  icon: React.ReactNode;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  ...props
}) => {
  const button = (
    <Button
      shape="circle"
      icon={icon}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <span title={tooltip}>
        {button}
      </span>
    );
  }

  return button;
};

IconButton.displayName = 'IconButton';

