import React from 'react';
import { Descriptions } from 'antd';
import { cn } from '../../utils/cn';





/**
 * CustomDescriptions - Enhanced Descriptions
 */
export const CustomDescriptions = ({
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
export const KeyValueList = ({
  items,
  direction = 'vertical',
  className }) => {
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


export const DetailCard = ({
  title,
  items,
  extra,
  className }) => {
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

