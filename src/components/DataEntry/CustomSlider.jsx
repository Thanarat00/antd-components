import React from 'react';
import { Slider, InputNumber, Space } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomSlider - Enhanced Slider
 */
export const CustomSlider = ({
  label,
  showValue = false,
  showInput = false,
  unit = '',
  error,
  className,
  value,
  onChange,
  min = 0,
  max = 100,
  ...props
}) => {
  const displayValue = value ?? min;

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {showValue && (
            <span className="text-sm text-gray-500">
              {displayValue}{unit}
            </span>
          )}
        </div>
      )}
      
      {showInput ? (
        <Space.Compact className="w-full">
          <Slider
            min={min}
            max={max}
            value={typeof displayValue === 'number' ? displayValue : 0}
            onChange={onChange}
            className="flex-1"
            {...props}
          />
          <InputNumber
            min={min}
            max={max}
            value={displayValue}
            onChange={(val) => onChange?.(val ?? min)}
            className="w-20"
          />
        </Space.Compact>
      ) : (
        <Slider
          min={min}
          max={max}
          value={typeof displayValue === 'number' ? displayValue : 0}
          onChange={onChange}
          {...props}
        />
      )}
      
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

CustomSlider.displayName = 'CustomSlider';

// Range Slider


export const CustomRangeSlider = ({
  label,
  min = 0,
  max = 100,
  value = [min, max],
  onChange,
  unit = '',
  className }) => {
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm text-gray-500">
            {value[0]}{unit} - {value[1]}{unit}
          </span>
        </div>
      )}
      <Slider
        range
        min={min}
        max={max}
        value={value}
        onChange={(val) => onChange?.(val)}
      />
    </div>
  );
};

CustomRangeSlider.displayName = 'CustomRangeSlider';

