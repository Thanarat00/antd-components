import type { Meta, StoryObj } from '@storybook/react';
import { CustomCard, StatsCard } from './CustomCard';
import { Button, Avatar, Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const meta: Meta<typeof CustomCard> = {
  title: 'Layout/CustomCard',
  component: CustomCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated'],
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomCard>;

export const Default: Story = {
  args: {
    title: 'การ์ดตัวอย่าง',
    children: (
      <p className="text-gray-600">
        นี่คือเนื้อหาภายในการ์ด สามารถใส่เนื้อหาอะไรก็ได้ตามต้องการ
      </p>
    ),
    style: { width: 350 },
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'ยอดขายประจำเดือน',
    subtitle: 'อัพเดทล่าสุด: วันนี้ 10:30',
    children: (
      <p className="text-gray-600">
        ข้อมูลยอดขายประจำเดือนธันวาคม 2567
      </p>
    ),
    style: { width: 350 },
  },
};

export const WithActions: Story = {
  args: {
    title: 'รายการสินค้า',
    headerActions: (
      <Button type="primary" size="small">
        เพิ่มสินค้า
      </Button>
    ),
    children: (
      <p className="text-gray-600">
        รายการสินค้าทั้งหมด 150 รายการ
      </p>
    ),
    style: { width: 350 },
  },
};

export const WithMenu: Story = {
  args: {
    title: 'การตั้งค่า',
    menuItems: [
      { key: 'edit', label: 'แก้ไข', icon: <EditOutlined /> },
      { key: 'delete', label: 'ลบ', icon: <DeleteOutlined />, danger: true },
    ],
    onMenuClick: ({ key }) => console.log('Menu clicked:', key),
    children: (
      <p className="text-gray-600">
        คลิกที่ไอคอน ... เพื่อดูเมนู
      </p>
    ),
    style: { width: 350 },
  },
};

export const WithRefresh: Story = {
  args: {
    title: 'ข้อมูลสด',
    showRefresh: true,
    onRefresh: () => console.log('Refreshing...'),
    children: (
      <p className="text-gray-600">
        คลิกปุ่มรีเฟรชเพื่ออัพเดทข้อมูล
      </p>
    ),
    style: { width: 350 },
  },
};

export const Loading: Story = {
  args: {
    title: 'กำลังโหลด...',
    loading: true,
    showRefresh: true,
    children: <div>Content here</div>,
    style: { width: 350 },
  },
};

export const WithFooter: Story = {
  args: {
    title: 'สินค้า #12345',
    children: (
      <div>
        <p className="text-gray-600">รายละเอียดสินค้า</p>
        <Tag color="blue">ใหม่</Tag>
      </div>
    ),
    footer: (
      <div className="flex gap-2">
        <Button type="primary">ซื้อเลย</Button>
        <Button>เพิ่มลงตะกร้า</Button>
      </div>
    ),
    style: { width: 350 },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <CustomCard title="Default" variant="default" style={{ width: 200 }}>
        <p className="text-sm text-gray-500">Default style</p>
      </CustomCard>
      <CustomCard title="Bordered" variant="bordered" style={{ width: 200 }}>
        <p className="text-sm text-gray-500">With border</p>
      </CustomCard>
      <CustomCard title="Elevated" variant="elevated" style={{ width: 200 }}>
        <p className="text-sm text-gray-500">With shadow</p>
      </CustomCard>
    </div>
  ),
};

export const Hoverable: Story = {
  args: {
    title: 'Hover Me',
    hoverable: true,
    children: (
      <p className="text-gray-600">
        เลื่อนเมาส์มาเพื่อดู hover effect
      </p>
    ),
    style: { width: 350 },
  },
};

export const StatsCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatsCard
        title="ยอดขายวันนี้"
        value="฿125,000"
        icon={<DollarOutlined />}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatsCard
        title="ผู้ใช้ใหม่"
        value="1,234"
        icon={<UserOutlined />}
        trend={{ value: 5.2, isPositive: true }}
      />
      <StatsCard
        title="คำสั่งซื้อ"
        value="89"
        icon={<ShoppingCartOutlined />}
        trend={{ value: 3.1, isPositive: false }}
      />
      <StatsCard
        title="อัตราการแปลง"
        value="3.2%"
        icon={<LineChartOutlined />}
        trend={{ value: 0.8, isPositive: true }}
      />
    </div>
  ),
};

