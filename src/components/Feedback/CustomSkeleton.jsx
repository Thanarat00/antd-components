import React from 'react';
import { Skeleton, SkeletonProps } from 'antd';
import { cn } from '../../utils/cn';

// Interface{
  variant?: 'text' | 'avatar' | 'button' | 'input' | 'image';
  className?;
}

/**
 * CustomSkeleton - Enhanced Skeleton
 */
export const CustomSkeleton.FC<CustomSkeletonProps> = ({
  variant = 'text',
  className,
  ...props
}) => {
  if (variant === 'avatar') {
    return <Skeleton.Avatar active className={className} {...props} />;
  }

  if (variant === 'button') {
    return <Skeleton.Button active className={className} {...props} />;
  }

  if (variant === 'input') {
    return <Skeleton.Input active className={className} {...props} />;
  }

  if (variant === 'image') {
    return <Skeleton.Image active className={className} />;
  }

  return <Skeleton active className={className} {...props} />;
};

CustomSkeleton.displayName = 'CustomSkeleton';

// Card Skeleton
// Interface{
  showAvatar?;
  rows?;
  className?;
}

export const CardSkeleton.FC<CardSkeletonProps> = ({
  showAvatar = true,
  rows = 4,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg p-4 border border-gray-200', className)}>
      <Skeleton
        active
        avatar={showAvatar}
        paragraph={{ rows }}
      />
    </div>
  );
};

CardSkeleton.displayName = 'CardSkeleton';

// List Skeleton
// Interface{
  count?;
  showAvatar?;
  className?;
}

export const ListSkeleton.FC<ListSkeletonProps> = ({
  count = 3,
  showAvatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length}).map((_, index) => (
        <Skeleton
          key={index}
          active
          avatar={showAvatar}
          paragraph={{ rows: 2 }}
        />
      ))}
    </div>
  );
};

ListSkeleton.displayName = 'ListSkeleton';

// Table Skeleton
// Interface{
  rows?;
  columns?;
  className?;
}

export const TableSkeleton.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length}).map((_, i) => (
          <Skeleton.Input key={i} active size="small" className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length}).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length}).map((_, colIndex) => (
            <Skeleton.Input key={colIndex} active size="small" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.displayName = 'TableSkeleton';

// Form Skeleton
// Interface{
  fields?;
  className?;
}

export const FormSkeleton.FC<FormSkeletonProps> = ({
  fields = 4,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length}).map((_, index) => (
        <div key={index}>
          <Skeleton.Input active size="small" className="w-24 mb-2" />
          <Skeleton.Input active className="w-full" />
        </div>
      ))}
      <div className="flex gap-2 justify-end mt-6">
        <Skeleton.Button active />
        <Skeleton.Button active />
      </div>
    </div>
  );
};

FormSkeleton.displayName = 'FormSkeleton';

