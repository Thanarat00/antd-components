import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelect, CustomStatusSelect } from './CustomSelect';
import { UserOutlined, TeamOutlined, CrownOutlined } from '@ant-design/icons';

const meta: Meta<typeof CustomSelect> = {
  title: 'Form/CustomSelect',
  component: CustomSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

const basicOptions = [
  { label: 'ตัวเลือก 1', value: '1' },
  { label: 'ตัวเลือก 2', value: '2' },
  { label: 'ตัวเลือก 3', value: '3' },
  { label: 'ตัวเลือก 4 (ไม่สามารถเลือกได้)', value: '4', disabled: true },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'เลือกตัวเลือก',
    style: { width: 300 },
  },
};

export const WithLabel: Story = {
  args: {
    label: 'ประเภทสินค้า',
    options: basicOptions,
    required: true,
    style: { width: 300 },
  },
};

export const WithSearch: Story = {
  args: {
    label: 'เลือกจังหวัด',
    options: [
      { label: 'กรุงเทพมหานคร', value: 'bkk' },
      { label: 'เชียงใหม่', value: 'cm' },
      { label: 'ภูเก็ต', value: 'phuket' },
      { label: 'ขอนแก่น', value: 'kk' },
      { label: 'นครราชสีมา', value: 'korat' },
    ],
    showSearch: true,
    style: { width: 300 },
  },
};

export const WithError: Story = {
  args: {
    label: 'ประเภทสินค้า',
    options: basicOptions,
    error: 'กรุณาเลือกประเภทสินค้า',
    required: true,
    style: { width: 300 },
  },
};

export const Multiple: Story = {
  args: {
    label: 'เลือกหมวดหมู่',
    options: [
      { label: 'อิเล็กทรอนิกส์', value: 'electronics' },
      { label: 'เสื้อผ้า', value: 'clothing' },
      { label: 'อาหาร', value: 'food' },
      { label: 'หนังสือ', value: 'books' },
      { label: 'กีฬา', value: 'sports' },
    ],
    multiple: true,
    showSearch: true,
    style: { width: 300 },
  },
};

export const WithIcons: Story = {
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

export const WithDescription: Story = {
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

export const StatusSelect: Story = {
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

export const Disabled: Story = {
  args: {
    label: 'ประเภทสินค้า',
    options: basicOptions,
    defaultValue: '1',
    disabled: true,
    style: { width: 300 },
  },
};

