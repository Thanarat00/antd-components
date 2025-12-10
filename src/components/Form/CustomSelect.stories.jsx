import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelect, CustomStatusSelect } from './CustomSelect';
import { UserOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';

const meta= {
  title: 'Form/CustomSelect',
  component: {
    layout: 'centered' },
  tags: ,
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

const basicOptions = [
  { label: 'ตัวเลือก 1', value: '1' },
  { label: 'ตัวเลือก 2', value: '2' },
  { label: 'ตัวเลือก 3', value: '3' },
  { label: 'ตัวเลือก 4 (ไม่สามารถเลือกได้)', value: '4', disabled},
];

export const Default= {
  args: {
    options: basicOptions,
    placeholder: 'เลือกตัวเลือก',
    style: { width: 300 },
  },
};

export const WithLabel= {
  args: {
    label: 'ประเภทสินค้า',
    options: { width: 300 },
  },
};

export const WithSearch= {
  args: {
    label: 'เลือกจังหวัด',
    options: [
      { label: 'กรุงเทพมหานคร', value: 'bkk' },
      { label: 'เชียงใหม่', value: 'cm' },
      { label: 'ภูเก็ต', value: 'phuket' },
      { label: 'ขอนแก่น', value: 'kk' },
      { label: 'นครราชสีมา', value: 'korat' },
    ],
    showSearch: { width: 300 },
  },
};

export const WithError= {
  args: {
    label: 'ประเภทสินค้า',
    options: 'กรุณาเลือกประเภทสินค้า',
    required: { width: 300 },
  },
};

export const Multiple= {
  args: {
    label: 'เลือกหมวดหมู่',
    options: [
      { label: 'อิเล็กทรอนิกส์', value: 'electronics' },
      { label: 'เสื้อผ้า', value: 'clothing' },
      { label: 'อาหาร', value: 'food' },
      { label: 'หนังสือ', value: 'books' },
      { label: 'กีฬา', value: 'sports' },
    ],
    multiple: { width: 300 },
  },
};

export const WithIcons= {
  args: {
    label: 'เลือกบทบาท',
    options: [
      { label: 'ผู้ใช้ทั่วไป', value: 'user', icon: <UserOutlined /> },
      { label: 'ทีมงาน', value: 'team', icon: <TeamOutlined /> },
      { label: 'ผู้ดูแลระบบ', value: 'admin', icon: <CrownOutlined /> },
    ],
    style: { width: 300 },
  },
};

export const WithDescription= {
  args: {
    label: 'เลือกแผน',
    options: [
      { label: 'Free', value: 'free', description: 'ฟรี ไม่มีค่าใช้จ่าย' },
      { label: 'Pro', value: 'pro', description: '199 บาท/เดือน' },
      { label: 'Enterprise', value: 'enterprise', description: 'ติดต่อฝ่ายขาย' },
    ],
    style: { width: 300 },
  },
};

export const StatusSelect= {
  render: () => (
    <div style={{ width: 300 }}>
      <CustomStatusSelect
        label="สถานะ"
        options={[
          { label: 'รอดำเนินการ', value: 'pending', color: '#faad14' },
          { label: 'กำลังดำเนินการ', value: 'processing', color: '#1677ff' },
          { label: 'สำเร็จ', value: 'completed', color: '#52c41a' },
          { label: 'ยกเลิก', value: 'cancelled', color: '#ff4d4f' },
        ]}
      />
    </div>
  ),
};

export const Disabled= {
  args: {
    label: 'ประเภทสินค้า',
    options: '1',
    disabled: { width: 300 },
  },
};

