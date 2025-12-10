import React from 'react';
import { Rate, RateProps } from 'antd';
import { StarFilled, HeartFilled, LikeFilled } from '@ant-design/icons';
import { cn } from '../../utils/cn';



const defaultTexts = ['แย่มาก', 'แย่', 'ปานกลาง', 'ดี', 'ดีมาก'];

/**
 * CustomRate - Enhanced Rate component
 */
export const CustomRate = ({
  label,
  showText = false,
  texts = defaultTexts,
  variant = 'star',
  size = 'default',
  className,
  value,
  ...props
}) => {
  const iconMap = {
    star: <StarFilled />,
    heart: <HeartFilled className="text-red-500" />,
    like: <LikeFilled className="text-blue-500" />,
  };

  const sizeClass = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-xl',
  }[size];

  const currentText = value ? texts[Math.ceil(value) - 1] : '';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <Rate
          character={variant !== 'star' ? iconMap[variant] }
          value={value}
          className={sizeClass}
          {...props}
        />
        {showText && value && (
          <span className="text-sm text-gray-500">{currentText}</span>
        )}
      </div>
    </div>
  );
};

CustomRate.displayName = 'CustomRate';

// Read-only Rating Display


export const RatingDisplay = ({
  value,
  total = 5,
  reviewCount,
  size = 'default',
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Rate
        disabled
        allowHalf
        value={value}
        count={total}
        className={size === 'small' ? 'text-sm' === 'large' ? 'text-xl' : 'text-base'}
      />
      <span className="text-sm text-gray-600">
        {value.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="text-gray-400 ml-1">({reviewCount} รีวิว)</span>
        )}
      </span>
    </div>
  );
};

RatingDisplay.displayName = 'RatingDisplay';

