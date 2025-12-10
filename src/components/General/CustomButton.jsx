import React from 'react';
import { Button, ButtonProps, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

// Interface{
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  /** Full width */
  fullWidth?;
  /** Left icon */
  leftIcon?.ReactNode;
  /** Right icon */
  rightIcon?.ReactNode;
  /** Custom class */
  className?;
}

const variantMap{ type?'type']; danger?; ghost?}> = {
  primary: { type: 'primary' },
  secondary: { type: 'default' },
  success: { type: 'primary', ghost},
  warning: { type: 'primary' },
  danger: { type: 'primary', danger},
  ghost: { ghost},
  link: { type: 'link' },
};

/**
 * CustomButton - Enhanced Ant Design Button
 */
export const CustomButton.FC<CustomButtonProps> = ({
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
// Interface{
  children.ReactNode;
  className?;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'middle' | 'large';
}

export const CustomButtonGroup.FC<CustomButtonGroupProps> = ({
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
// Interface'shape'> {
  icon.ReactNode;
  tooltip?;
}

export const IconButton.FC<IconButtonProps> = ({
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

