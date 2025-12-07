import React from 'react';
import { Tag, TagProps } from 'antd';
import { CloseOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CustomTagProps extends TagProps {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'default' | 'large';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

/**
 * CustomTag - Enhanced Tag
 */
export const CustomTag: React.FC<CustomTagProps> = ({
  variant = 'default',
  size = 'default',
  removable = false,
  onRemove,
  children,
  className,
  ...props
}) => {
  const sizeClass = {
    small: 'text-xs px-1.5 py-0',
    default: 'text-sm px-2 py-0.5',
    large: 'text-base px-3 py-1',
  }[size];

  return (
    <Tag
      bordered={variant === 'outlined'}
      closable={removable}
      onClose={onRemove}
      className={cn(sizeClass, className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

CustomTag.displayName = 'CustomTag';

// Status Tag
export interface StatusTagProps {
  status: 'success' | 'processing' | 'warning' | 'error' | 'default';
  text?: string;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  success: { color: 'success', icon: <CheckCircleOutlined /> },
  processing: { color: 'processing', icon: <ClockCircleOutlined /> },
  warning: { color: 'warning', icon: <ExclamationCircleOutlined /> },
  error: { color: 'error', icon: <CloseCircleOutlined /> },
  default: { color: 'default', icon: null },
};

export const StatusTag: React.FC<StatusTagProps> = ({
  status,
  text,
  showIcon = true,
  className,
}) => {
  const config = statusConfig[status];

  return (
    <Tag color={config.color} icon={showIcon ? config.icon : undefined} className={className}>
      {text}
    </Tag>
  );
};

StatusTag.displayName = 'StatusTag';

// Tag Group
export interface TagGroupProps {
  tags: Array<{
    key: string;
    label: string;
    color?: string;
    removable?: boolean;
  }>;
  onRemove?: (key: string) => void;
  className?: string;
}

export const TagGroup: React.FC<TagGroupProps> = ({
  tags,
  onRemove,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {tags.map((tag) => (
        <CustomTag
          key={tag.key}
          color={tag.color}
          removable={tag.removable}
          onRemove={() => onRemove?.(tag.key)}
        >
          {tag.label}
        </CustomTag>
      ))}
    </div>
  );
};

TagGroup.displayName = 'TagGroup';

