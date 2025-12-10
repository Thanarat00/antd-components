import React from 'react';
import { Tooltip, TooltipProps, Popover, PopoverProps } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomTooltip - Enhanced Tooltip
 */
export const CustomTooltip = ({
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


export const InfoTooltip = ({
  content,
  iconType = 'info',
  placement = 'top',
  className,
}) => {
  const Icon = iconType === 'info' ? InfoCircleOutlined ;

  return (
    <Tooltip title={content} placement={placement}>
      <Icon className={cn('text-gray-400 hover:text-gray-600 cursor-help', className)} />
    </Tooltip>
  );
};

InfoTooltip.displayName = 'InfoTooltip';

// Custom Popover


export const CustomPopover = ({
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


export const HelpPopover = ({
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

