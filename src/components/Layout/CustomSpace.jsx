import React from 'react';
import { Space, SpaceProps } from 'antd';
import { cn } from '../../utils/cn';

// Interface{
  fullWidth?;
  className?;
}

/**
 * CustomSpace - Enhanced Space
 */
export const CustomSpace.FC<CustomSpaceProps> = ({
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
// Interface{
  className?;
}

export const CompactSpace.FC<CompactSpaceProps> = ({
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
// Interface{
  children.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?;
}

export const ButtonGroupSpace.FC<ButtonGroupSpaceProps> = ({
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
// Interface{
  children.ReactNode;
  size?: 'small' | 'middle' | 'large';
  className?;
}

export const InlineSpace.FC<InlineSpaceProps> = ({
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

