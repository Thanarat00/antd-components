import React from 'react';
import { Tag } from 'antd';
import { CloseOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomTag - Enhanced Tag
 */
export const CustomTag = ({
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
    large: 'text-base px-3 py-1' }[size];

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


const statusConfig = {
  success: { color: 'success', icon: <CheckCircleOutlined /> },
  processing: { color: 'processing', icon: <ClockCircleOutlined /> },
  warning: { color: 'warning', icon: <ExclamationCircleOutlined /> },
  error: { color: 'error', icon: <CloseCircleOutlined /> },
  default: { color: 'default', icon: undefined },
};

export const StatusTag = ({
  status,
  text,
  showIcon = true,
  className }) => {
  const config = statusConfig[status];

  return (
    <Tag color={config.color} icon={showIcon ? config.icon : undefined} className={className}>
      {text}
    </Tag>
  );
};

StatusTag.displayName = 'StatusTag';

// Tag Group
export const TagGroup = ({
  tags,
  onRemove,
  className }) => {
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

