import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import { DownOutlined, MoreOutlined, EllipsisOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';





/**
 * CustomDropdown - Enhanced Dropdown
 */
export const CustomDropdown = ({
  items,
  children,
  trigger = ['click'],
  placement = 'bottomLeft',
  disabled = false,
  className }) => {
  const menuItems = items.map((item) => ({
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


export const ActionDropdown = ({
  items,
  trigger = ['click'],
  placement = 'bottomRight',
  iconType = 'vertical' }) => {
  const menuItems = items.map((item) => ({
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
        icon={iconType === 'horizontal' ? <MoreOutlined /> : <EllipsisOutlined />}
        className="text-gray-500 hover:text-gray-700"
      />
    </Dropdown>
  );
};

ActionDropdown.displayName = 'ActionDropdown';

// Button Dropdown


export const ButtonDropdown = ({
  items,
  buttonText,
  buttonType = 'default',
  loading = false,
  trigger = ['click'],
  placement = 'bottomLeft',
  disabled = false }) => {
  const menuItems = items.map((item) => ({
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

