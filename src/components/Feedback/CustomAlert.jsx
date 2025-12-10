import React from 'react';
import { Alert } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomAlert - Enhanced Alert
 */
export const CustomAlert = ({
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <Alert
      className={cn(
        variant === 'outlined' && 'bg-transparent',
        className
      )}
      {...props}
    />
  );
};

CustomAlert.displayName = 'CustomAlert';

// Banner Alert (full width)


export const BannerAlert = ({
  className,
  ...props
}) => {
  return (
    <Alert
      banner
      className={className}
      {...props}
    />
  );
};

BannerAlert.displayName = 'BannerAlert';

// Inline Alert (smaller)


export const InlineAlert = ({
  type,
  message,
  className }) => {
  const colorClass = {
    success: 'text-green-600 bg-green-50',
    info: 'text-blue-600 bg-blue-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error: 'text-red-600 bg-red-50' }[type];

  return (
    <div className={cn('text-sm px-3 py-2 rounded', colorClass, className)}>
      {message}
    </div>
  );
};

InlineAlert.displayName = 'InlineAlert';

