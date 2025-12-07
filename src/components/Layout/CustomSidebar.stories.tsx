import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CustomSidebar } from './CustomSidebar';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  ShopOutlined,
} from '@ant-design/icons';

const meta: Meta<typeof CustomSidebar> = {
  title: 'Layout/CustomSidebar',
  component: CustomSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomSidebar>;

const menuItems = [
  {
    key: 'dashboard',
    label: 'แดชบอร์ด',
    icon: <DashboardOutlined />,
  },
  {
    key: 'products',
    label: 'สินค้า',
    icon: <ShoppingOutlined />,
    children: [
      { key: 'products-list', label: 'รายการสินค้า' },
      { key: 'products-add', label: 'เพิ่มสินค้า' },
      { key: 'products-categories', label: 'หมวดหมู่' },
    ],
  },
  {
    key: 'orders',
    label: 'คำสั่งซื้อ',
    icon: <FileTextOutlined />,
  },
  {
    key: 'customers',
    label: 'ลูกค้า',
    icon: <TeamOutlined />,
  },
  {
    key: 'reports',
    label: 'รายงาน',
    icon: <BarChartOutlined />,
    children: [
      { key: 'reports-sales', label: 'ยอดขาย' },
      { key: 'reports-products', label: 'สินค้า' },
      { key: 'reports-customers', label: 'ลูกค้า' },
    ],
  },
  {
    key: 'settings',
    label: 'ตั้งค่า',
    icon: <SettingOutlined />,
  },
];

const InteractiveSidebar = (props: Partial<React.ComponentProps<typeof CustomSidebar>>) => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  return (
    <div className="flex h-[600px]">
      <CustomSidebar
        items={menuItems}
        selectedKey={selectedKey}
        openKeys={openKeys}
        onSelect={setSelectedKey}
        onOpenChange={setOpenKeys}
        user={{
          name: 'สมชาย ใจดี',
          role: 'ผู้ดูแลระบบ',
        }}
        onLogout={() => console.log('Logout')}
        {...props}
      />
      <div className="flex-1 bg-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">เนื้อหาหลัก</h2>
        <p>Selected: {selectedKey}</p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveSidebar />,
};

export const LightTheme: Story = {
  render: () => <InteractiveSidebar theme="light" />,
};

export const InitiallyCollapsed: Story = {
  render: () => <InteractiveSidebar defaultCollapsed />,
};

export const WithCustomLogo: Story = {
  render: () => (
    <InteractiveSidebar
      logo={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShopOutlined className="text-xl" />
          </div>
          <div>
            <span className="text-lg font-bold">SGN Shop</span>
            <span className="block text-xs text-gray-400">Admin Panel</span>
          </div>
        </div>
      }
      collapsedLogo={
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white">
          <ShopOutlined className="text-xl" />
        </div>
      }
    />
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <InteractiveSidebar
      user={{
        name: 'สมชาย ใจดี',
        role: 'ผู้ดูแลระบบ',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      }}
    />
  ),
};

export const WithoutCollapseToggle: Story = {
  render: () => <InteractiveSidebar showCollapseToggle={false} />,
};

export const WithoutUser: Story = {
  render: () => (
    <div className="flex h-[600px]">
      <CustomSidebar
        items={menuItems}
        selectedKey="dashboard"
      />
      <div className="flex-1 bg-gray-100 p-6">
        <h2 className="text-xl font-semibold">เนื้อหาหลัก</h2>
      </div>
    </div>
  ),
};

export const CustomWidth: Story = {
  render: () => <InteractiveSidebar width={280} collapsedWidth={72} />,
};

