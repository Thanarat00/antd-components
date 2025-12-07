import React from 'react';
import { Space, SpaceProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomSpaceProps extends SpaceProps {
  fullWidth?: boolean;
  className?: string;
}

/**
 * CustomSpace - Enhanced Space
 */
export const CustomSpace: React.FC<CustomSpaceProps> = ({
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
export interface CompactSpaceProps extends SpaceProps {
  className?: string;
}

export const CompactSpace: React.FC<CompactSpaceProps> = ({
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
export interface ButtonGroupSpaceProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const ButtonGroupSpace: React.FC<ButtonGroupSpaceProps> = ({
  children,
  align = 'left',
  className,
}) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <Space className={cn('flex', alignClass, className)}>
      {children}
    </Space>
  );
};

ButtonGroupSpace.displayName = 'ButtonGroupSpace';

// Inline Space (for inline elements)
export interface InlineSpaceProps {
  children: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

export const InlineSpace: React.FC<InlineSpaceProps> = ({
  children,
  size = 'small',
  className,
}) => {
  return (
    <Space size={size} className={cn('inline-flex', className)}>
      {children}
    </Space>
  );
};

InlineSpace.displayName = 'InlineSpace';

