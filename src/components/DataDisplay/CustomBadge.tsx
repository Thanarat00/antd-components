import React from 'react';
import { Badge, BadgeProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomBadgeProps extends BadgeProps {
  variant?: 'default' | 'dot' | 'processing' | 'success' | 'warning' | 'error';
  className?: string;
}

/**
 * CustomBadge - Enhanced Badge
 */
export const CustomBadge: React.FC<CustomBadgeProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const statusMap: Record<string, BadgeProps['status']> = {
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
export interface StatusBadgeProps {
  status: 'success' | 'processing' | 'warning' | 'error' | 'default';
  text?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
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
export interface CountBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
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
export interface RibbonBadgeProps {
  text: string;
  color?: string;
  placement?: 'start' | 'end';
  children: React.ReactNode;
  className?: string;
}

export const RibbonBadge: React.FC<RibbonBadgeProps> = ({
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

