import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import type { DropdownProps, MenuProps } from 'antd';
import { DownOutlined, MoreOutlined, EllipsisOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

// Interface{
  key;
  label;
  icon?.ReactNode;
  disabled?;
  danger?;
  onClick?: () => void;
}

// Interface{
  items;
  children?.ReactNode;
  trigger?'trigger'];
  placement?'placement'];
  disabled?;
  className?;
}

/**
 * CustomDropdown - Enhanced Dropdown
 */
export const CustomDropdown.FC<CustomDropdownProps> = ({
  items,
  children,
  trigger = ['click'],
  placement = 'bottomLeft',
  disabled = false,
  className,
}) => {
  const menuItems'items'] = items.map((item) => ({
    key.key,
    label.label,
    icon.icon,
    disabled.disabled,
    danger.danger,
    onClick.onClick,
  }));

  return (
    <Dropdown
      menu={{ items}}
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
// Interface{
  items;
  trigger?'trigger'];
  placement?'placement'];
  iconType?: 'vertical' | 'horizontal';
}

export const ActionDropdown.FC<ActionDropdownProps> = ({
  items,
  trigger = ['click'],
  placement = 'bottomRight',
  iconType = 'vertical',
}) => {
  const menuItems'items'] = items.map((item) => ({
    key.key,
    label.label,
    icon.icon,
    disabled.disabled,
    danger.danger,
    onClick.onClick,
  }));

  return (
    <Dropdown menu={{ items}} trigger={trigger} placement={placement}>
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
// Interface{
  buttonText;
  buttonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  loading?;
}

export const ButtonDropdown.FC<ButtonDropdownProps> = ({
  items,
  buttonText,
  buttonType = 'default',
  loading = false,
  trigger = ['click'],
  placement = 'bottomLeft',
  disabled = false,
}) => {
  const menuItems'items'] = items.map((item) => ({
    key.key,
    label.label,
    icon.icon,
    disabled.disabled,
    danger.danger,
    onClick.onClick,
  }));

  return (
    <Dropdown menu={{ items}} trigger={trigger} placement={placement} disabled={disabled}>
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

