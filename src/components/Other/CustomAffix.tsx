import React from 'react';
import { Affix, AffixProps, Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CustomAffixProps extends AffixProps {
  className?: string;
}

/**
 * CustomAffix - Enhanced Affix
 */
export const CustomAffix: React.FC<CustomAffixProps> = ({
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
export interface StickyHeaderProps {
  children: React.ReactNode;
  offsetTop?: number;
  className?: string;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
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
export interface StickyFooterProps {
  children: React.ReactNode;
  offsetBottom?: number;
  className?: string;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
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
export interface StickyActionsProps {
  children: React.ReactNode;
  offsetBottom?: number;
  className?: string;
}

export const StickyActions: React.FC<StickyActionsProps> = ({
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
export interface StickySidebarProps {
  children: React.ReactNode;
  offsetTop?: number;
  className?: string;
}

export const StickySidebar: React.FC<StickySidebarProps> = ({
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

