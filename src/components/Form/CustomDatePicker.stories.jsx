import type { Meta, StoryObj } from '@storybook/react';
import { CustomDatePicker, CustomRangePicker } from './CustomDatePicker';
import dayjs from 'dayjs';

const meta= {
  title: 'Form/CustomDatePicker',
  component: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomDatePicker>;

export const Default= {
  args: {
    style: { width: 300 },
  },
};

export const WithLabel= {
  args: {
    label: 'วันเกิด',
    required: { width: 300 },
  },
};

export const WithError= {
  args: {
    label: 'วันเริ่มต้น',
    error: 'กรุณาเลือกวันที่',
    required: { width: 300 },
  },
};

export const WithPresets= {
  args: {
    label: 'วันที่',
    showPresets: { width: 300 },
  },
};

export const BuddhistEra= {
  args: {
    label: 'วันที่ (พ.ศ.)',
    useBuddhistEra: { width: 300 },
  },
};

export const WithTime= {
  args: {
    label: 'วันและเวลา',
    showTime: 'DD/MM/YYYY HH:mm',
    style: { width: 300 },
  },
};

export const Disabled= {
  args: {
    label: 'วันที่',
    defaultValue(),
    disabled: { width: 300 },
  },
};

export const RangePicker= {
  render: () => (
    <div style={{ width: 400 }}>
      <CustomRangePicker
        label="ช่วงวันที่"
        showPresets
      />
    </div>
  ),
};

export const RangePickerWithTime= {
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

