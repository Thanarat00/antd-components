import React from 'react';
import { Breadcrumb, Button, Space, Divider } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface CustomPageHeaderProps {
  /** Page title */
  title: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Show home icon in breadcrumb */
  showHomeInBreadcrumb?: boolean;
  /** On home click */
  onHomeClick?: () => void;
  /** Show back button */
  showBack?: boolean;
  /** On back click */
  onBack?: () => void;
  /** Header actions (buttons) */
  actions?: React.ReactNode;
  /** Extra content below title */
  extra?: React.ReactNode;
  /** Tags next to title */
  tags?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Sticky header */
  sticky?: boolean;
}

/**
 * CustomPageHeader - Enhanced page header with breadcrumbs and actions
 *
 * Features:
 * - Breadcrumb navigation
 * - Back button
 * - Action buttons
 * - Sticky positioning option
 * - Extra content area
 */
export const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showHomeInBreadcrumb = true,
  onHomeClick,
  showBack = false,
  onBack,
  actions,
  extra,
  tags,
  className,
  sticky = false,
}) => {
  // Build breadcrumb items
  const breadcrumbItems = React.useMemo(() => {
    const items: BreadcrumbItem[] = [];

    if (showHomeInBreadcrumb) {
      items.push({
        title: 'หน้าแรก',
        icon: <HomeOutlined />,
        onClick: onHomeClick,
        href: onHomeClick ? undefined : '/',
      });
    }

    if (breadcrumbs) {
      items.push(...breadcrumbs);
    }

    return items;
  }, [breadcrumbs, showHomeInBreadcrumb, onHomeClick]);

  return (
    <div
      className={cn(
        'bg-white px-6 py-4',
        sticky && 'sticky top-0 z-10 shadow-sm',
        className
      )}
    >
      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && (
        <Breadcrumb
          className="mb-3"
          items={breadcrumbItems.map((item, index) => ({
            key: index,
            title: (
              <span
                className={cn(
                  'flex items-center gap-1',
                  (item.href || item.onClick) &&
                    'cursor-pointer hover:text-primary-500 transition-colors'
                )}
                onClick={item.onClick}
              >
                {item.icon}
                {item.title}
              </span>
            ),
            href: item.href,
          }))}
        />
      )}

      {/* Header content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Back button */}
          {showBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="flex-shrink-0 mt-0.5 text-gray-500 hover:text-primary-500"
            />
          )}

          {/* Title section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-800 m-0 truncate">
                {title}
              </h1>
              {tags && <div className="flex items-center gap-2">{tags}</div>}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1 m-0">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <Space className="flex-shrink-0" wrap>
            {actions}
          </Space>
        )}
      </div>

      {/* Extra content */}
      {extra && (
        <>
          <Divider className="my-4" />
          <div>{extra}</div>
        </>
      )}
    </div>
  );
};

CustomPageHeader.displayName = 'CustomPageHeader';

// Compact header variant
export interface CompactPageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CompactPageHeader: React.FC<CompactPageHeaderProps> = ({
  title,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 bg-white border-b border-gray-100',
        className
      )}
    >
      <h2 className="text-lg font-medium text-gray-800 m-0">{title}</h2>
      {actions && <Space>{actions}</Space>}
    </div>
  );
};

CompactPageHeader.displayName = 'CompactPageHeader';

