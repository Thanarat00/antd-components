import React from 'react';
import { Affix, AffixProps, Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomAffix - Enhanced Affix
 */
export const CustomAffix = ({
  children,
  className,
  ...props
}) => {
  return (
    <Affix className={className} {...props}>
      {children}
    </Affix>
  );
};

CustomAffix.displayName = 'CustomAffix';

// Sticky Header


export const StickyHeader = ({
  children,
  offsetTop = 0,
  className,
}) => {
  return (
    <Affix offsetTop={offsetTop}>
      <div className={cn('bg-white shadow-sm', className)}>
        {children}
      </div>
    </Affix>
  );
};

StickyHeader.displayName = 'StickyHeader';

// Sticky Footer


export const StickyFooter = ({
  children,
  offsetBottom = 0,
  className,
}) => {
  return (
    <Affix offsetBottom={offsetBottom}>
      <div className={cn('bg-white shadow-sm', className)}>
        {children}
      </div>
    </Affix>
  );
};

StickyFooter.displayName = 'StickyFooter';

// Sticky Actions (for form actions)


export const StickyActions = ({
  children,
  offsetBottom = 0,
  className,
}) => {
  return (
    <Affix offsetBottom={offsetBottom}>
      <div className={cn('bg-white border-t border-gray-200 py-3 px-4', className)}>
        {children}
      </div>
    </Affix>
  );
};

StickyActions.displayName = 'StickyActions';

// Sticky Sidebar


export const StickySidebar = ({
  children,
  offsetTop = 80,
  className,
}) => {
  return (
    <Affix offsetTop={offsetTop}>
      <div className={className}>
        {children}
      </div>
    </Affix>
  );
};

StickySidebar.displayName = 'StickySidebar';

