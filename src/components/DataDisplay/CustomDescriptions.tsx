import React from 'react';
import { Descriptions, DescriptionsProps } from 'antd';
import { cn } from '../../utils/cn';

export interface DescriptionItem {
  key: string;
  label: string;
  children: React.ReactNode;
  span?: number;
}

export interface CustomDescriptionsProps extends Omit<DescriptionsProps, 'items'> {
  items: DescriptionItem[];
  title?: string;
  variant?: 'default' | 'bordered';
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * CustomDescriptions - Enhanced Descriptions
 */
export const CustomDescriptions: React.FC<CustomDescriptionsProps> = ({
  items,
  title,
  variant = 'default',
  columns = 2,
  className,
  ...props
}) => {
  const descItems = items.map((item) => ({
    key: item.key,
    label: item.label,
    children: item.children,
    span: item.span,
  }));

  return (
    <Descriptions
      title={title}
      items={descItems}
      bordered={variant === 'bordered'}
      column={columns}
      className={className}
      {...props}
    />
  );
};

CustomDescriptions.displayName = 'CustomDescriptions';

// Simple Key-Value List
export interface KeyValueListProps {
  items: Array<{
    label: string;
    value: React.ReactNode;
  }>;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const KeyValueList: React.FC<KeyValueListProps> = ({
  items,
  direction = 'vertical',
  className,
}) => {
  if (direction === 'horizontal') {
    return (
      <div className={cn('flex flex-wrap gap-x-6 gap-y-2', className)}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-500">{item.label}:</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <dl className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <dt className="text-gray-500">{item.label}</dt>
          <dd className="font-medium text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

KeyValueList.displayName = 'KeyValueList';

// Detail Card (Card with descriptions)
export interface DetailCardProps {
  title?: string;
  items: DescriptionItem[];
  extra?: React.ReactNode;
  className?: string;
}

export const DetailCard: React.FC<DetailCardProps> = ({
  title,
  items,
  extra,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      {(title || extra) && (
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
          {extra}
        </div>
      )}
      <CustomDescriptions items={items} bordered={false} column={1} />
    </div>
  );
};

DetailCard.displayName = 'DetailCard';

