import React from 'react';
import { Button, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

const variantMap = {
  primary: { type: 'primary' },
  secondary: { type: 'default' },
  success: { type: 'primary', ghost: true },
  warning: { type: 'primary' },
  danger: { type: 'primary', danger: true },
  ghost: { ghost: true },
  link: { type: 'link' },
};

/**
 * CustomButton - Enhanced Ant Design Button
 */
export const CustomButton = ({
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
export const CustomButtonGroup = ({
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
export const IconButton = ({
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

