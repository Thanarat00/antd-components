import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { cn } from '../../utils/cn';
import { getDatePresets, getDateRangePresets } from '../../utils/dateUtils';

dayjs.extend(buddhistEra);
dayjs.locale('th');

const { RangePicker } = DatePicker;





// Thai locale configuration
const thaiLocale = {
  lang: {
    locale: 'th_TH',
    placeholder: 'เลือกวันที่',
    rangePlaceholder: ['วันเริ่มต้น', 'วันสิ้นสุด'],
    today: 'วันนี้',
    now: 'ตอนนี้',
    backToToday: 'กลับไปวันนี้',
    ok: 'ตกลง',
    clear: 'ล้าง',
    month: 'เดือน',
    year: 'ปี',
    timeSelect: 'เลือกเวลา',
    dateSelect: 'เลือกวันที่',
    monthSelect: 'เลือกเดือน',
    yearSelect: 'เลือกปี',
    decadeSelect: 'เลือกทศวรรษ',
    yearFormat: 'BBBB',
    dateFormat: 'D/M/BBBB',
    dayFormat: 'D',
    dateTimeFormat: 'D/M/BBBB HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: 'เดือนก่อนหน้า',
    nextMonth: 'เดือนถัดไป',
    previousYear: 'ปีก่อนหน้า',
    nextYear: 'ปีถัดไป',
    previousDecade: 'ทศวรรษก่อนหน้า',
    nextDecade: 'ทศวรรษถัดไป',
    previousCentury: 'ศตวรรษก่อนหน้า',
    nextCentury: 'ศตวรรษถัดไป',
    shortWeekDays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    shortMonths: [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ] },
  timePickerLocale: {
    placeholder: 'เลือกเวลา' },
};

/**
 * CustomDatePicker - Enhanced Ant Design DatePicker with Thai locale support
 *
 * Features:
 * - Thai Buddhist Era support
 * - Preset date options
 * - Label and helper text support
 * - Error states
 */
export const CustomDatePicker = ({
  label,
  helperText,
  error,
  required,
  className,
  useBuddhistEra = false,
  showPresets = false,
  disabled,
  format,
  ...props
}) => {
  const dateFormat = format || (useBuddhistEra ? 'DD/MM/BBBB' : 'DD/MM/YYYY');
  const presets = showPresets ? getDatePresets() : undefined;

  return (
    <div className={cn('sgn-datepicker-wrapper', className)}>
      {label && (
        <label
          className={cn(
            'block mb-1.5 text-sm font-medium text-gray-700',
            disabled && 'text-gray-400',
            error && 'text-red-500'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <DatePicker
        locale={thaiLocale}
        format={dateFormat}
        status={error ? 'error' : undefined}
        disabled={disabled}
        presets={presets}
        className="w-full"
        {...props}
      />

      {(helperText || error) && (
        <p
          className={cn(
            'mt-1.5 text-xs',
            error ? 'text-red-500' : 'text-gray-500'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

CustomDatePicker.displayName = 'CustomDatePicker';

/**
 * CustomRangePicker - Enhanced Ant Design RangePicker with Thai locale support
 */
export const CustomRangePicker = ({
  label,
  helperText,
  error,
  required,
  className,
  useBuddhistEra = false,
  showPresets = false,
  disabled,
  format,
  ...props
}) => {
  const dateFormat = format || (useBuddhistEra ? 'DD/MM/BBBB' : 'DD/MM/YYYY');
  const presets = showPresets ? getDateRangePresets() : undefined;

  return (
    <div className={cn('sgn-rangepicker-wrapper', className)}>
      {label && (
        <label
          className={cn(
            'block mb-1.5 text-sm font-medium text-gray-700',
            disabled && 'text-gray-400',
            error && 'text-red-500'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <RangePicker
        locale={thaiLocale}
        format={dateFormat}
        status={error ? 'error' : undefined}
        disabled={disabled}
        presets={presets}
        className="w-full"
        {...props}
      />

      {(helperText || error) && (
        <p
          className={cn(
            'mt-1.5 text-xs',
            error ? 'text-red-500' : 'text-gray-500'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

CustomRangePicker.displayName = 'CustomRangePicker';

// Utility function to disable dates
export const disableFutureDates = (current) => {
  return current && current > dayjs().endOf('day');
};

export const disablePastDates = (current) => {
  return current && current < dayjs().startOf('day');
};

