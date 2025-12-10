import React from 'react';
import { Tabs, Badge } from 'antd';
import { cn } from '../../utils/cn';





/**
 * CustomTabs - Enhanced Tabs component
 */
export const CustomTabs = ({
  items,
  activeKey,
  onChange,
  variant = 'default',
  position = 'top',
  centered = false,
  className,
  onAdd,
  onRemove,
  ...props
}) => {
  const tabItems = items.map((item) => ({
    key: item.key,
    label: (
      <span className="inline-flex items-center gap-2">
        {item.icon}
        <span>{item.label}</span>
        {item.badge !== undefined && (
          <Badge
            count={item.badge}
            size="small"
            style={{ marginLeft: 4 }}
          />
        )}
      </span>
    ),
    disabled: item.disabled,
    children: item.children,
    closable: item.closable,
  }));

  const handleEdit = (targetKey, action) => {
    if (action === 'add') {
      onAdd?.();
    } else if (typeof targetKey === 'string') {
      onRemove?.(targetKey);
    }
  };

  return (
    <Tabs
      type={variant === 'default' ? 'line' : undefined}
      tabPosition={position}
      centered={centered}
      activeKey={activeKey}
      onChange={onChange}
      items={tabItems}
      onEdit={variant === 'editable-card' ? handleEdit : undefined}
      className={className}
      {...props}
    />
  );
};

CustomTabs.displayName = 'CustomTabs';

// Tab Panel (for controlled usage)


export const TabPanel = ({
  children,
  className }) => {
  return (
    <div className={cn('py-4', className)}>
      {children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

// Simple Tab Bar (without content)
export const TabBar = ({
  items,
  activeKey,
  onChange,
  className }) => {
  return (
    <div className={cn('flex gap-1 border-b border-gray-200', className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors relative',
            activeKey === item.key
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <span className="inline-flex items-center gap-2">
            {item.icon}
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <Badge count={item.badge} size="small" />
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

TabBar.displayName = 'TabBar';

