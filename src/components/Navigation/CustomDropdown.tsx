import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import type { DropdownProps, MenuProps } from 'antd';
import { DownOutlined, MoreOutlined, EllipsisOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface DropdownMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface CustomDropdownProps {
  items: DropdownMenuItem[];
  children?: React.ReactNode;
  trigger?: DropdownProps['trigger'];
  placement?: DropdownProps['placement'];
  disabled?: boolean;
  className?: string;
}

/**
 * CustomDropdown - Enhanced Dropdown
 */
export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  children,
  trigger = ['click'],
  placement = 'bottomLeft',
  disabled = false,
  className,
}) => {
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    disabled: item.disabled,
    danger: item.danger,
    onClick: item.onClick,
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={trigger}
      placement={placement}
      disabled={disabled}
      className={className}
    >
      {children || (
        <Button>
          <Space>
            ตัวเลือก
            <DownOutlined />
          </Space>
        </Button>
      )}
    </Dropdown>
  );
};

CustomDropdown.displayName = 'CustomDropdown';

// Action Dropdown (3 dots menu)
export interface ActionDropdownProps {
  items: DropdownMenuItem[];
  trigger?: DropdownProps['trigger'];
  placement?: DropdownProps['placement'];
  iconType?: 'vertical' | 'horizontal';
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  items,
  trigger = ['click'],
  placement = 'bottomRight',
  iconType = 'vertical',
}) => {
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    disabled: item.disabled,
    danger: item.danger,
    onClick: item.onClick,
  }));

  return (
    <Dropdown menu={{ items: menuItems }} trigger={trigger} placement={placement}>
      <Button
        type="text"
        icon={iconType === 'vertical' ? <MoreOutlined /> : <EllipsisOutlined />}
        className="text-gray-500 hover:text-gray-700"
      />
    </Dropdown>
  );
};

ActionDropdown.displayName = 'ActionDropdown';

// Button Dropdown
export interface ButtonDropdownProps extends CustomDropdownProps {
  buttonText: string;
  buttonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  loading?: boolean;
}

export const ButtonDropdown: React.FC<ButtonDropdownProps> = ({
  items,
  buttonText,
  buttonType = 'default',
  loading = false,
  trigger = ['click'],
  placement = 'bottomLeft',
  disabled = false,
}) => {
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    disabled: item.disabled,
    danger: item.danger,
    onClick: item.onClick,
  }));

  return (
    <Dropdown menu={{ items: menuItems }} trigger={trigger} placement={placement} disabled={disabled}>
      <Button type={buttonType} loading={loading}>
        <Space>
          {buttonText}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

ButtonDropdown.displayName = 'ButtonDropdown';

