import type { Meta, StoryObj } from '@storybook/react';
import { CustomDatePicker, CustomRangePicker } from './CustomDatePicker';
import dayjs from 'dayjs';

const meta: Meta<typeof CustomDatePicker> = {
  title: 'Form/CustomDatePicker',
  component: CustomDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomDatePicker>;

export const Default: Story = {
  args: {
    style: { width: 300 },
  },
};

export const WithLabel: Story = {
  args: {
    label: 'วันเกิด',
    required: true,
    style: { width: 300 },
  },
};

export const WithError: Story = {
  args: {
    label: 'วันเริ่มต้น',
    error: 'กรุณาเลือกวันที่',
    required: true,
    style: { width: 300 },
  },
};

export const WithPresets: Story = {
  args: {
    label: 'วันที่',
    showPresets: true,
    style: { width: 300 },
  },
};

export const BuddhistEra: Story = {
  args: {
    label: 'วันที่ (พ.ศ.)',
    useBuddhistEra: true,
    style: { width: 300 },
  },
};

export const WithTime: Story = {
  args: {
    label: 'วันและเวลา',
    showTime: true,
    format: 'DD/MM/YYYY HH:mm',
    style: { width: 300 },
  },
};

export const Disabled: Story = {
  args: {
    label: 'วันที่',
    defaultValue: dayjs(),
    disabled: true,
    style: { width: 300 },
  },
};

export const RangePicker: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <CustomRangePicker
        label="ช่วงวันที่"
        showPresets
      />
    </div>
  ),
};

export const RangePickerWithTime: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <CustomRangePicker
        label="ช่วงวันที่และเวลา"
        showTime
        format="DD/MM/YYYY HH:mm"
      />
    </div>
  ),
};

