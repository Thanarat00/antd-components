import React from 'react';
import { Space } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomSpace - Enhanced Space
 */
export const CustomSpace = ({
  children,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <Space className={cn(fullWidth && 'w-full', className)} {...props}>
      {children}
    </Space>
  );
};

CustomSpace.displayName = 'CustomSpace';

// Compact Space


export const CompactSpace = ({
  children,
  className,
  ...props
}) => {
  return (
    <Space.Compact className={className} {...props}>
      {children}
    </Space.Compact>
  );
};

CompactSpace.displayName = 'CompactSpace';

// Button Group Space


export const ButtonGroupSpace = ({
  children,
  align = 'left',
  className }) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end' }[align];

  return (
    <Space className={cn('flex', alignClass, className)}>
      {children}
    </Space>
  );
};

ButtonGroupSpace.displayName = 'ButtonGroupSpace';

// Inline Space (for inline elements)


export const InlineSpace = ({
  children,
  size = 'small',
  className }) => {
  return (
    <Space size={size} className={cn('inline-flex', className)}>
      {children}
    </Space>
  );
};

InlineSpace.displayName = 'InlineSpace';

