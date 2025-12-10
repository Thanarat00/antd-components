import React from 'react';
import { Menu, MenuProps } from 'antd';
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
  const menuItems= React.useMemo(() => {
    const transform = (items)=> {
      return items.map((item) => {
        if (item.type === 'divider') {
          return { type: 'divider', key.key };
        }
        if (item.type === 'group') {
          return {
            type: 'group',
            key.key,
            label.label,
            children.children ? transform(item.children) };
        }
        return {
          key.key,
          icon.icon,
          label.label,
          disabled.disabled,
          danger.danger,
          children.children ? transform(item.children) };
      });
    };
    return transform(items);
  }, [items]);

  const handleClick'onClick'] = ({ key }) => {
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
      mode={variant === 'horizontal' ? 'horizontal' ? 'vertical' : 'inline'}
      inlineCollapsed={collapsed}
      items={menuItems}
      selectedKeys={selectedKey ? [selectedKey] : []}
      openKeys={collapsed ? [] }
      onClick={handleClick}
      onOpenChange={onOpenChange}
      className={cn(className)}
      {...props}
    />
  );
};

CustomMenu.displayName = 'CustomMenu';

