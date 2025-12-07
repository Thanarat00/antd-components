import React from 'react';
import { Pagination, PaginationProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomPaginationProps extends PaginationProps {
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  showInfo?: boolean;
  variant?: 'default' | 'simple' | 'mini';
  className?: string;
}

/**
 * CustomPagination - Enhanced Pagination with Thai locale
 */
export const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  showInfo = true,
  variant = 'default',
  className,
  ...props
}) => {
  const showTotal = (total: number, range: [number, number]) => {
    if (!showInfo) return null;
    return `${range[0]}-${range[1]} จาก ${total} รายการ`;
  };

  if (variant === 'simple') {
    return (
      <Pagination
        simple
        total={totalItems}
        pageSize={pageSize}
        current={currentPage}
        onChange={onPageChange}
        className={className}
        {...props}
      />
    );
  }

  if (variant === 'mini') {
    return (
      <Pagination
        size="small"
        total={totalItems}
        pageSize={pageSize}
        current={currentPage}
        onChange={onPageChange}
        showTotal={showTotal}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Pagination
      total={totalItems}
      pageSize={pageSize}
      current={currentPage}
      onChange={onPageChange}
      showSizeChanger
      showQuickJumper
      showTotal={showTotal}
      pageSizeOptions={['10', '20', '50', '100']}
      className={className}
      {...props}
    />
  );
};

CustomPagination.displayName = 'CustomPagination';

// Pagination Info
export interface PaginationInfoProps {
  current: number;
  pageSize: number;
  total: number;
  className?: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  current,
  pageSize,
  total,
  className,
}) => {
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <span className={cn('text-sm text-gray-500', className)}>
      แสดง {start}-{end} จาก {total} รายการ
    </span>
  );
};

PaginationInfo.displayName = 'PaginationInfo';

