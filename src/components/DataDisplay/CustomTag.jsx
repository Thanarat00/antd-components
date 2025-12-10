import React from 'react';
import { Tag, TagProps } from 'antd';
import { CloseOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

// Interface{
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'default' | 'large';
  removable?;
  onRemove?: () => void;
  className?;
}

/**
 * CustomTag - Enhanced Tag
 */
export const CustomTag.FC<CustomTagProps> = ({
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
// Interface{
  status: 'success' | 'processing' | 'warning' | 'error' | 'default';
  text?;
  showIcon?;
  className?;
}

const statusConfig = {
  success: { color: 'success', icon: <CheckCircleOutlined /> },
  processing: { color: 'processing', icon: <ClockCircleOutlined /> },
  warning: { color: 'warning', icon: <ExclamationCircleOutlined /> },
  error: { color: 'error', icon: <CloseCircleOutlined /> },
  default: { color: 'default', icon},
};

export const StatusTag.FC<StatusTagProps> = ({
  status,
  text,
  showIcon = true,
  className,
}) => {
  const config = statusConfig[status];

  return (
    <Tag color={config.color} icon={showIcon ? config.icon } className={className}>
      {text}
    </Tag>
  );
};

StatusTag.displayName = 'StatusTag';

// Tag Group
// Interface{
  tags{
    key;
    label;
    color?;
    removable?;
  }>;
  onRemove?: (key) => void;
  className?;
}

export const TagGroup.FC<TagGroupProps> = ({
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

