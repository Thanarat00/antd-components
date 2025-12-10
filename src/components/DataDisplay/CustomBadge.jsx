import React from 'react';
import { Badge, BadgeProps } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomBadge - Enhanced Badge
 */
export const CustomBadge = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const statusMap'status']> = {
    processing: 'processing',
    success: 'success',
    warning: 'warning',
    error: 'error',
  };

  if (variant === 'dot') {
    return (
      <Badge dot className={className} {...props}>
        {children}
      </Badge>
    );
  }

  if (statusMap[variant]) {
    return (
      <Badge status={statusMap[variant]} className={className} {...props}>
        {children}
      </Badge>
    );
  }

  return (
    <Badge className={className} {...props}>
      {children}
    </Badge>
  );
};

CustomBadge.displayName = 'CustomBadge';

// Status Badge (standalone)


export const StatusBadge = ({
  status,
  text,
  className,
}) => {
  return (
    <Badge status={status} text={text} className={className} />
  );
};

StatusBadge.displayName = 'StatusBadge';

// Count Badge


export const CountBadge = ({
  count,
  max = 99,
  showZero = false,
  children,
  className,
}) => {
  return (
    <Badge
      count={count}
      overflowCount={max}
      showZero={showZero}
      className={className}
    >
      {children}
    </Badge>
  );
};

CountBadge.displayName = 'CountBadge';

// Ribbon Badge


export const RibbonBadge = ({
  text,
  color,
  placement = 'end',
  children,
  className,
}) => {
  return (
    <Badge.Ribbon text={text} color={color} placement={placement} className={className}>
      {children}
    </Badge.Ribbon>
  );
};

RibbonBadge.displayName = 'RibbonBadge';

