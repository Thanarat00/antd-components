import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';





/**
 * CustomBreadcrumb - Enhanced Breadcrumb with home icon
 */
export const CustomBreadcrumb = ({
  items,
  showHome = true,
  homeHref = '/',
  onHomeClick,
  separator = <RightOutlined className="text-xs text-gray-400" />,
  className,
  ...props
}) => {
  const breadcrumbItems = React.useMemo(() => {
    const result = [];

    if (showHome) {
      result.push({
        title: 'หน้าแรก',
        icon: <HomeOutlined />,
        href: undefined,
      });
    }

    result.push(...items);

    return result.map((item, index) => ({
      key: (
        <span
          className={cn(
            'inline-flex items-center gap-1',
            (item.href || item.onClick) && 'cursor-pointer hover:text-blue-500 transition-colors'
          )}
          onClick={item.onClick}
        >
          {item.icon}
          <span>{item.title}</span>
        </span>
      ),
      href: item.href,
    }));
  }, [items, showHome, homeHref, onHomeClick]);

  return (
    <Breadcrumb
      items={breadcrumbItems}
      separator={separator}
      className={cn('text-sm', className)}
      {...props}
    />
  );
};

CustomBreadcrumb.displayName = 'CustomBreadcrumb';

