import React from 'react';
import { Menu } from 'antd';
import { cn } from '../../utils/cn';





/**
 * CustomMenu - Enhanced Menu component
 */
export const CustomMenu = ({
  items,
  variant = 'vertical',
  collapsed = false,
  selectedKey,
  openKeys,
  onSelect,
  onOpenChange,
  className,
  ...props
}) => {
  // Transform items
  const menuItems = React.useMemo(() => {
    const transform = (items) => {
      return items.map((item) => {
        if (item.type === 'divider') {
          return { type: 'divider', key: item.key };
        }
        if (item.type === 'group') {
          return {
            type: 'group',
            key: item.key,
            label: item.label,
            children: item.children ? transform(item.children) : undefined,
          };
        }
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          disabled: item.disabled,
          danger: item.danger,
          children: item.children ? transform(item.children) : undefined,
        };
      });
    };
    return transform(items);
  }, [items]);

  const handleClick = ({ key }) => {
    // Find item and call its onClick
    const findItem = (items)=> {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const clickedItem = findItem(items);
    clickedItem?.onClick?.();
    onSelect?.(key);
  };

  return (
    <Menu
      mode={variant === 'horizontal' ? 'horizontal' : variant === 'vertical' ? 'vertical' : 'inline'}
      inlineCollapsed={collapsed}
      items={menuItems}
      selectedKeys={selectedKey ? [selectedKey] : []}
      openKeys={collapsed ? [] : openKeys}
      onClick={handleClick}
      onOpenChange={onOpenChange}
      className={cn(className)}
      {...props}
    />
  );
};

CustomMenu.displayName = 'CustomMenu';

