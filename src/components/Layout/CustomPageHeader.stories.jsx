import type { Meta, StoryObj } from '@storybook/react';
import { CustomPageHeader, CompactPageHeader } from './CustomPageHeader';
import { Button, Tag } from 'antd';
import { PlusOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons';

const meta= {
  title: 'Layout/CustomPageHeader',
  component: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomPageHeader>;

export const Default= {
  args: {
    title: 'รายการสินค้า',
  },
};

export const WithSubtitle= {
  args: {
    title: 'รายการสินค้า',
    subtitle: 'จัดการสินค้าทั้งหมดในระบบ',
  },
};

export const WithBreadcrumbs= {
  args: {
    title: 'รายละเอียดสินค้า',
    subtitle: 'สินค้า SKU-12345',
    breadcrumbs: [
      { title: 'สินค้า', href: '/products' },
      { title: 'รายละเอียด' },
    ],
  },
};

export const WithActions= {
  args: {
    title: 'รายการสินค้า',
    subtitle: 'สินค้าทั้งหมด 1,234 รายการ',
    actions: (
      <>
        <Button icon={<DownloadOutlined />}>Export</Button>
        <Button type="primary" icon={<PlusOutlined />}>
          เพิ่มสินค้า
        </Button>
      </>
    ),
  },
};

export const WithBackButton= {
  args: {
    title: 'รายละเอียดสินค้า',
    subtitle: 'iPhone 15 Pro Max 256GB',
    showBack: () => console.log('Go back'),
    breadcrumbs: [
      { title: 'สินค้า', href: '/products' },
      { title: 'iPhone 15 Pro Max' },
    ],
    actions: (
      <>
        <Button icon={<SettingOutlined />}>แก้ไข</Button>
      </>
    ),
  },
};

export const WithTags= {
  args: {
    title: 'คำสั่งซื้อ #ORD-2024001',
    subtitle: 'สั่งซื้อเมื่อ 1 ธ.ค. 2567',
    showBack: (
      <>
        <Tag color="processing">กำลังดำเนินการ</Tag>
        <Tag color="gold">ด่วน</Tag>
      </>
    ),
    breadcrumbs: [
      { title: 'คำสั่งซื้อ', href: '/orders' },
      { title: '#ORD-2024001' },
    ],
  },
};

export const WithExtra= {
  args: {
    title: 'แดชบอร์ด',
    subtitle: 'ภาพรวมธุรกิจ',
    extra: (
      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-gray-500">ยอดขายวันนี้:</span>
          <span className="ml-2 font-semibold text-green-500">฿125,000</span>
        </div>
        <div>
          <span className="text-gray-500">คำสั่งซื้อ:</span>
          <span className="ml-2 font-semibold">89</span>
        </div>
        <div>
          <span className="text-gray-500">ผู้ใช้ออนไลน์:</span>
          <span className="ml-2 font-semibold text-blue-500">234</span>
        </div>
      </div>
    ),
  },
};

export const Sticky= {
  render: () => (
    <div className="h-[500px] overflow-auto bg-gray-100">
      <CustomPageHeader
        title="หน้าที่ Sticky"
        subtitle="เลื่อนลงเพื่อดู header คงที่"
        sticky
        actions={
          <Button type="primary" icon={<PlusOutlined />}>
            เพิ่ม
          </Button>
        }
      />
      <div className="p-6 space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            Content {i + 1}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const CompactHeader= {
  render: () => (
    <CompactPageHeader
      title="รายการย่อ"
      actions={
        <>
          <Button size="small">ยกเลิก</Button>
          <Button size="small" type="primary">บันทึก</Button>
        </>
      }
    />
  ),
};

