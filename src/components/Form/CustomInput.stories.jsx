import type { Meta, StoryObj } from '@storybook/react';
import { CustomInput, CustomSearchInput, CustomPasswordInput, CustomTextArea } from './CustomInput';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

const meta= {
  title: 'Form/CustomInput',
  component: {
    layout: 'centered' },
  tags: ,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'] },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'borderless'] },
  },
};

export default meta;
type Story = StoryObj<typeof CustomInput>;

export const Default= {
  args: {
    placeholder: 'กรอกข้อความ...' },
};

export const WithLabel= {
  args: {
    label: 'ชื่อผู้ใช้',
    placeholder: 'กรอกชื่อผู้ใช้',
    required},
};

export const WithHelperText= {
  args: {
    label: 'อีเมล',
    placeholder: 'example@email.com',
    helperText: 'กรุณากรอกอีเมลที่ใช้งานได้จริง' },
};

export const WithError= {
  args: {
    label: 'รหัสผ่าน',
    placeholder: 'กรอกรหัสผ่าน',
    error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
    required},
};

export const WithSuccess= {
  args: {
    label: 'ชื่อผู้ใช้',
    placeholder: 'กรอกชื่อผู้ใช้',
    defaultValue: 'john_doe',
    success: 'ชื่อผู้ใช้นี้ใช้ได้' },
};

export const WithIcon= {
  args: {
    label: 'อีเมล',
    placeholder: 'กรอกอีเมล',
    prefix: <MailOutlined /> },
};

export const Disabled= {
  args: {
    label: 'ชื่อผู้ใช้',
    placeholder: 'กรอกชื่อผู้ใช้',
    defaultValue: 'readonly_user',
    disabled},
};

export const Sizes= {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <CustomInput size="small" placeholder="Small" label="Small Size" />
      <CustomInput size="middle" placeholder="Middle" label="Middle Size" />
      <CustomInput size="large" placeholder="Large" label="Large Size" />
    </div>
  ) };

export const SearchInput= {
  render: () => (
    <div className="w-80">
      <CustomSearchInput placeholder="ค้นหาสินค้า..." />
    </div>
  ) };

export const PasswordInput= {
  render: () => (
    <div className="w-80">
      <CustomPasswordInput
        label="รหัสผ่าน"
        placeholder="กรอกรหัสผ่าน"
        required
      />
    </div>
  ) };

export const TextArea= {
  render: () => (
    <div className="w-80">
      <CustomTextArea
        label="รายละเอียด"
        placeholder="กรอกรายละเอียด..."
        rows={4}
        showCount
        maxLength={500}
      />
    </div>
  ),
};

