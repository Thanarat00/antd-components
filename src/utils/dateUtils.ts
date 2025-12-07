import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

/**
 * Format date to string
 */
export function formatDate(
  date: Date | Dayjs | string | null | undefined,
  format: string = 'DD/MM/YYYY'
): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * Format date to Thai Buddhist Era format
 */
export function formatThaiDate(
  date: Date | Dayjs | string | null | undefined,
  format: string = 'DD/MM/BBBB'
): string {
  if (!date) return '';
  return dayjs(date).locale('th').format(format);
}

/**
 * Get date presets for date picker
 */
export function getDatePresets(): { label: string; value: Dayjs }[] {
  return [
    { label: 'วันนี้', value: dayjs() },
    { label: 'เมื่อวาน', value: dayjs().subtract(1, 'day') },
    { label: '7 วันที่แล้ว', value: dayjs().subtract(7, 'day') },
    { label: '30 วันที่แล้ว', value: dayjs().subtract(30, 'day') },
    { label: 'เดือนนี้', value: dayjs().startOf('month') },
    { label: 'เดือนที่แล้ว', value: dayjs().subtract(1, 'month').startOf('month') },
  ];
}

/**
 * Get date range presets
 */
export function getDateRangePresets(): { label: string; value: [Dayjs, Dayjs] }[] {
  return [
    {
      label: 'วันนี้',
      value: [dayjs().startOf('day'), dayjs().endOf('day')],
    },
    {
      label: 'สัปดาห์นี้',
      value: [dayjs().startOf('week'), dayjs().endOf('week')],
    },
    {
      label: 'เดือนนี้',
      value: [dayjs().startOf('month'), dayjs().endOf('month')],
    },
    {
      label: '7 วันที่แล้ว',
      value: [dayjs().subtract(7, 'day'), dayjs()],
    },
    {
      label: '30 วันที่แล้ว',
      value: [dayjs().subtract(30, 'day'), dayjs()],
    },
    {
      label: 'ปีนี้',
      value: [dayjs().startOf('year'), dayjs().endOf('year')],
    },
  ];
}

