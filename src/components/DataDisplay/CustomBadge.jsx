import React from 'react';
import { Badge, BadgeProps } from 'antd';
import { cn } from '../../utils/cn';

// Interface{
  variant?: 'default' | 'dot' | 'processing' | 'success' | 'warning' | 'error';
  className?;
}

/**
 * CustomBadge - Enhanced Badge
 */
export const CustomBadge.FC<CustomBadgeProps> = ({
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
// Interface{
  status: 'success' | 'processing' | 'warning' | 'error' | 'default';
  text?;
  className?;
}

export const StatusBadge.FC<StatusBadgeProps> = ({
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
// Interface{
  count;
  max?;
  showZero?;
  children?.ReactNode;
  className?;
}

export const CountBadge.FC<CountBadgeProps> = ({
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
// Interface{
  text;
  color?;
  placement?: 'start' | 'end';
  children.ReactNode;
  className?;
}

export const RibbonBadge.FC<RibbonBadgeProps> = ({
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

