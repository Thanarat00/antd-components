import React from 'react';
import { Progress, ProgressProps } from 'antd';
import { cn } from '../../utils/cn';

// Interface{
  label?;
  showValue?;
  className?;
}

/**
 * CustomProgress - Enhanced Progress
 */
export const CustomProgress.FC<CustomProgressProps> = ({
  label,
  showValue = true,
  className,
  percent = 0,
  ...props
}) => {
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showValue && <span className="text-sm font-medium">{percent}%</span>}
        </div>
      )}
      <Progress percent={percent} showInfo={false} {...props} />
    </div>
  );
};

CustomProgress.displayName = 'CustomProgress';

// Circle Progress
// Interface{
  percent;
  size?;
  strokeWidth?;
  label?;
  className?;
}

export const CircleProgress.FC<CircleProgressProps> = ({
  percent,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}) => {
  return (
    <div className={cn('text-center', className)}>
      <Progress
        type="circle"
        percent={percent}
        size={size}
        strokeWidth={strokeWidth}
      />
      {label && <p className="mt-2 text-sm text-gray-500">{label}</p>}
    </div>
  );
};

CircleProgress.displayName = 'CircleProgress';

// Steps Progress
// Interface{
  current;
  total;
  label?;
  className?;
}

export const StepsProgress.FC<StepsProgressProps> = ({
  current,
  total,
  label,
  className,
}) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-medium">{current}/{total}</span>
        </div>
      )}
      <Progress
        percent={percent}
        steps={total}
        showInfo={false}
      />
    </div>
  );
};

StepsProgress.displayName = 'StepsProgress';

// Dashboard Progress (multiple circles)
// Interface{
  label;
  percent;
  color?;
}

// Interface{
  items;
  size?;
  className?;
}

export const DashboardProgress.FC<DashboardProgressProps> = ({
  items,
  size = 80,
  className,
}) => {
  return (
    <div className={cn('flex gap-6 flex-wrap', className)}>
      {items.map((item, index) => (
        <div key={index} className="text-center">
          <Progress
            type="dashboard"
            percent={item.percent}
            size={size}
            strokeColor={item.color}
          />
          <p className="mt-1 text-xs text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

DashboardProgress.displayName = 'DashboardProgress';

