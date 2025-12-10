import React from 'react';
import { Statistic, StatisticProps, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

// Interface{
  trend?;
  trendSuffix?;
  className?;
}

/**
 * CustomStatistic - Enhanced Statistic
 */
export const CustomStatistic.FC<CustomStatisticProps> = ({
  trend,
  trendSuffix = '%',
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <Statistic {...props} />
      {trend !== undefined && (
        <div
          className={cn(
            'flex items-center gap-1 mt-1 text-sm',
            trend >= 0 ? 'text-green-500' : 'text-red-500'
          )}
        >
          {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span>{Math.abs(trend)}{trendSuffix}</span>
        </div>
      )}
    </div>
  );
};

CustomStatistic.displayName = 'CustomStatistic';

// Statistic Card
// Interface{
  title;
  value;
  prefix?.ReactNode;
  suffix?;
  trend?;
  icon?.ReactNode;
  className?;
}

export const StatisticCard.FC<StatisticCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  icon,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg p-4 border border-gray-200', className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {prefix}{value}{suffix}
          </p>
          {trend !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-sm',
                trend >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{Math.abs(trend)}% จากเดือนที่แล้ว</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500 text-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

StatisticCard.displayName = 'StatisticCard';

// Progress Statistic
// Interface{
  title;
  value;
  total;
  unit?;
  className?;
}

export const ProgressStatistic.FC<ProgressStatisticProps> = ({
  title,
  value,
  total,
  unit = '',
  className,
}) => {
  const percent = Math.round((value / total) * 100);

  return (
    <div className={cn('bg-white rounded-lg p-4 border border-gray-200', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-sm font-medium">
          {value}{unit} / {total}{unit}
        </span>
      </div>
      <Progress percent={percent} showInfo={false} />
      <div className="text-right mt-1">
        <span className="text-xs text-gray-400">{percent}%</span>
      </div>
    </div>
  );
};

ProgressStatistic.displayName = 'ProgressStatistic';

// Countdown
// Interface'value'> {
  targetDate;
  onFinish?: () => void;
  className?;
}

export const CustomCountdown.FC<CustomCountdownProps> = ({
  targetDate,
  onFinish,
  className,
  ...props
}) => {
  return (
    <Statistic.Countdown
      value={targetDate}
      onFinish={onFinish}
      className={className}
      {...props}
    />
  );
};

CustomCountdown.displayName = 'CustomCountdown';

