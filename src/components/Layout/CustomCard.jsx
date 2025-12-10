import React from 'react';
import { Card, Skeleton, Button, Dropdown } from 'antd';
import { MoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomCard - Enhanced Ant Design Card with additional features
 *
 * Features:
 * - Loading skeleton state
 * - Header actions and dropdown menu
 * - Footer support
 * - Multiple variants
 * - Refresh button
 */
export const CustomCard = ({
  title,
  subtitle,
  loading = false,
  className,
  children,
  headerActions,
  footer,
  menuItems,
  onMenuClick,
  showRefresh = false,
  onRefresh,
  hoverable = false,
  variant = 'default',
  fullHeight = false,
  padding = 'medium',
  ...props
}) => {
  const variantStyles = {
    default: 'sgn-card',
    bordered: 'sgn-card border border-gray-200',
    elevated: 'sgn-card shadow-antd-md' };

  const paddingStyles = {
    none: '[&_.ant-card-body]:p-0',
    small: '[&_.ant-card-body]:p-3',
    medium: '[&_.ant-card-body]:p-4',
    large: '[&_.ant-card-body]:p-6' };

  // Build extra content
  const extra = (
    <div className="flex items-center gap-2">
      {headerActions}
      {showRefresh && (
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined spin={loading} />}
          onClick={onRefresh}
          className="text-gray-500 hover:text-blue-500"
        />
      )}
      {menuItems && menuItems.length > 0 && (
        <Dropdown
          menu={{ items}}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="text-gray-500 hover:text-blue-500"
          />
        </Dropdown>
      )}
    </div>
  );

  // Custom title with subtitle
  const cardTitle = title ? (
    <div className="flex flex-col">
      <span className="text-base font-semibold text-gray-800">{title}</span>
      {subtitle && (
        <span className="text-xs font-normal text-gray-500 mt-0.5">{subtitle}</span>
      )}
    </div>
  ) : undefined;

  return (
    <Card
      title={cardTitle}
      extra={extra}
      hoverable={hoverable}
      className={cn(
        variantStyles[variant],
        paddingStyles[padding],
        fullHeight && 'h-full flex flex-col [&_.ant-card-body]:flex-1',
        className
      )}
      {...props}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          {children}
          {footer && (
            <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>
          )}
        </>
      )}
    </Card>
  );
};

CustomCard.displayName = 'CustomCard';

// Stats Card variant


export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  className,
  loading = false }) => {
  return (
    <CustomCard className={className} loading={loading} padding="medium">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-sm',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-400">จากเดือนที่แล้ว</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500 text-xl">
            {icon}
          </div>
        )}
      </div>
    </CustomCard>
  );
};

StatsCard.displayName = 'StatsCard';

