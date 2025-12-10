import React from 'react';
import { Divider, DividerProps } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomDivider - Enhanced Divider
 */
export const CustomDivider = ({
  variant = 'solid',
  spacing = 'medium',
  className,
  children,
  ...props
}) => {
  const spacingClass = {
    small: 'my-2',
    medium: 'my-4',
    large: 'my-6',
  }[spacing];

  return (
    <Divider
      dashed={variant === 'dashed'}
      className={cn(spacingClass, className)}
      style={variant === 'dotted' ? { borderStyle: 'dotted' } }
      {...props}
    >
      {children}
    </Divider>
  );
};

CustomDivider.displayName = 'CustomDivider';

// Section Divider (with title)


export const SectionDivider = ({
  title,
  subtitle,
  orientation = 'left',
  className,
}) => {
  return (
    <Divider orientation={orientation} className={cn('my-6', className)}>
      <div className={cn(orientation === 'center' && 'text-center')}>
        <span className="font-semibold text-gray-700">{title}</span>
        {subtitle && (
          <span className="block text-xs text-gray-400 mt-0.5">{subtitle}</span>
        )}
      </div>
    </Divider>
  );
};

SectionDivider.displayName = 'SectionDivider';

