import React from 'react';
import { Tooltip, TooltipProps, Popover, PopoverProps } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CustomTooltipProps extends TooltipProps {
  className?: string;
}

/**
 * CustomTooltip - Enhanced Tooltip
 */
export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Tooltip className={className} {...props}>
      {children}
    </Tooltip>
  );
};

CustomTooltip.displayName = 'CustomTooltip';

// Info Tooltip (with icon)
export interface InfoTooltipProps {
  content: React.ReactNode;
  iconType?: 'info' | 'question';
  placement?: TooltipProps['placement'];
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  iconType = 'info',
  placement = 'top',
  className,
}) => {
  const Icon = iconType === 'info' ? InfoCircleOutlined : QuestionCircleOutlined;

  return (
    <Tooltip title={content} placement={placement}>
      <Icon className={cn('text-gray-400 hover:text-gray-600 cursor-help', className)} />
    </Tooltip>
  );
};

InfoTooltip.displayName = 'InfoTooltip';

// Custom Popover
export interface CustomPopoverProps extends PopoverProps {
  className?: string;
}

export const CustomPopover: React.FC<CustomPopoverProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Popover className={className} {...props}>
      {children}
    </Popover>
  );
};

CustomPopover.displayName = 'CustomPopover';

// Help Popover
export interface HelpPopoverProps {
  title?: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const HelpPopover: React.FC<HelpPopoverProps> = ({
  title = 'ข้อมูลเพิ่มเติม',
  content,
  children,
  className,
}) => {
  return (
    <Popover title={title} content={content} trigger="click">
      {children || (
        <QuestionCircleOutlined className={cn('text-gray-400 hover:text-blue-500 cursor-pointer', className)} />
      )}
    </Popover>
  );
};

HelpPopover.displayName = 'HelpPopover';

