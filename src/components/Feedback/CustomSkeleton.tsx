import React from 'react';
import { Skeleton, SkeletonProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomSkeletonProps extends SkeletonProps {
  variant?: 'text' | 'avatar' | 'button' | 'input' | 'image';
  className?: string;
}

/**
 * CustomSkeleton - Enhanced Skeleton
 */
export const CustomSkeleton: React.FC<CustomSkeletonProps> = ({
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
export interface CardSkeletonProps {
  showAvatar?: boolean;
  rows?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
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
export interface ListSkeletonProps {
  count?: number;
  showAvatar?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 3,
  showAvatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
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
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton.Input key={i} active size="small" className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton.Input key={colIndex} active size="small" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.displayName = 'TableSkeleton';

// Form Skeleton
export interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, index) => (
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

