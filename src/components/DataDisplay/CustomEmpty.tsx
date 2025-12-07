import React from 'react';
import { Empty, EmptyProps, Button } from 'antd';
import { InboxOutlined, SearchOutlined, FileOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CustomEmptyProps extends EmptyProps {
  variant?: 'default' | 'simple' | 'search' | 'data' | 'folder';
  title?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig = {
  default: {
    image: Empty.PRESENTED_IMAGE_DEFAULT,
    description: 'ไม่มีข้อมูล',
  },
  simple: {
    image: Empty.PRESENTED_IMAGE_SIMPLE,
    description: 'ไม่มีข้อมูล',
  },
  search: {
    icon: <SearchOutlined className="text-4xl text-gray-300" />,
    description: 'ไม่พบผลการค้นหา',
  },
  data: {
    icon: <InboxOutlined className="text-4xl text-gray-300" />,
    description: 'ยังไม่มีข้อมูล',
  },
  folder: {
    icon: <FolderOpenOutlined className="text-4xl text-gray-300" />,
    description: 'โฟลเดอร์ว่างเปล่า',
  },
};

/**
 * CustomEmpty - Enhanced Empty state
 */
export const CustomEmpty: React.FC<CustomEmptyProps> = ({
  variant = 'default',
  title,
  description,
  actionText,
  onAction,
  className,
  children,
  ...props
}) => {
  const config = variantConfig[variant];
  const hasIcon = 'icon' in config;

  return (
    <Empty
      image={hasIcon ? config.icon : config.image}
      imageStyle={hasIcon ? { height: 60 } : undefined}
      description={
        <div>
          {title && <p className="font-medium text-gray-700 mb-1">{title}</p>}
          <p className="text-gray-500">{description || config.description}</p>
        </div>
      }
      className={cn('py-8', className)}
      {...props}
    >
      {actionText && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
      {children}
    </Empty>
  );
};

CustomEmpty.displayName = 'CustomEmpty';

// Empty State with illustration
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="mb-4 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

