import React, { useState, useCallback } from 'react';
import { Menu, Button, Tooltip, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: SidebarMenuItem[];
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface CustomSidebarProps {
  /** Menu items */
  items: SidebarMenuItem[];
  /** Currently selected key */
  selectedKey?: string;
  /** Currently open keys (for submenus) */
  openKeys?: string[];
  /** On menu item click */
  onSelect?: (key: string) => void;
  /** On submenu open/close */
  onOpenChange?: (keys: string[]) => void;
  /** Logo/brand component */
  logo?: React.ReactNode;
  /** Collapsed logo (shown when sidebar is collapsed) */
  collapsedLogo?: React.ReactNode;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** On collapse change */
  onCollapse?: (collapsed: boolean) => void;
  /** Show collapse toggle */
  showCollapseToggle?: boolean;
  /** User info for footer */
  user?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  /** On logout click */
  onLogout?: () => void;
  /** Custom class name */
  className?: string;
  /** Sidebar width */
  width?: number;
  /** Collapsed width */
  collapsedWidth?: number;
  /** Theme */
  theme?: 'dark' | 'light';
}

/**
 * CustomSidebar - Collapsible sidebar navigation
 *
 * Features:
 * - Collapsible with smooth animation
 * - Nested menu support
 * - User info footer
 * - Dark/light theme
 * - Logo support
 */
export const CustomSidebar: React.FC<CustomSidebarProps> = ({
  items,
  selectedKey,
  openKeys,
  onSelect,
  onOpenChange,
  logo,
  collapsedLogo,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapse,
  showCollapseToggle = true,
  user,
  onLogout,
  className,
  width = 256,
  collapsedWidth = 80,
  theme = 'dark',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  }, [isCollapsed, onCollapse]);

  // Transform items to Ant Design Menu format
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    disabled: item.disabled,
    danger: item.danger,
    children: item.children?.map((child) => ({
      key: child.key,
      icon: child.icon,
      label: child.label,
      disabled: child.disabled,
      danger: child.danger,
    })),
  }));

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    // Find the clicked item
    const findItem = (items: SidebarMenuItem[]): SidebarMenuItem | undefined => {
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

  const themeStyles = {
    dark: 'bg-slate-900 text-white',
    light: 'bg-white text-gray-800 border-r border-gray-200',
  };

  return (
    <aside
      className={cn(
        'sgn-sidebar flex flex-col h-screen transition-all duration-300',
        themeStyles[theme],
        className
      )}
      style={{ width: isCollapsed ? collapsedWidth : width }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}
      >
        {isCollapsed ? (
          collapsedLogo || (
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
          )
        ) : (
          logo || (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-lg font-semibold">SGN Admin</span>
            </div>
          )
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <Menu
          mode="inline"
          theme={theme}
          inlineCollapsed={isCollapsed}
          selectedKeys={selectedKey ? [selectedKey] : []}
          openKeys={isCollapsed ? [] : openKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenuClick}
          items={menuItems}
          className="border-none"
        />
      </div>

      {/* Collapse toggle */}
      {showCollapseToggle && (
        <div
          className={cn(
            'px-4 py-2 border-t',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}
        >
          <Button
            type="text"
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleCollapse}
            className={cn(
              'w-full flex items-center justify-center',
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            )}
          >
            {!isCollapsed && <span className="ml-2">ย่อเมนู</span>}
          </Button>
        </div>
      )}

      {/* User footer */}
      {user && (
        <div
          className={cn(
            'px-4 py-3 border-t',
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar}
              className={cn(
                'flex-shrink-0',
                !user.avatar && 'bg-blue-500'
              )}
            >
              {!user.avatar && user.name.charAt(0).toUpperCase()}
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate m-0">{user.name}</p>
                {user.role && (
                  <p
                    className={cn(
                      'text-xs truncate m-0',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    {user.role}
                  </p>
                )}
              </div>
            )}
            {!isCollapsed && onLogout && (
              <Tooltip title="ออกจากระบบ">
                <Button
                  type="text"
                  size="small"
                  icon={<LogoutOutlined />}
                  onClick={onLogout}
                  className={cn(
                    'flex-shrink-0',
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-red-400'
                      : 'text-gray-500 hover:text-red-500'
                  )}
                />
              </Tooltip>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

CustomSidebar.displayName = 'CustomSidebar';

