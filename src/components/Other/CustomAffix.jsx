import React from 'react';
import { Affix, AffixProps, Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

// Interface{
  className?;
}

/**
 * CustomAffix - Enhanced Affix
 */
export const CustomAffix.FC<CustomAffixProps> = ({
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
// Interface{
  children.ReactNode;
  offsetTop?;
  className?;
}

export const StickyHeader.FC<StickyHeaderProps> = ({
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
// Interface{
  children.ReactNode;
  offsetBottom?;
  className?;
}

export const StickyFooter.FC<StickyFooterProps> = ({
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
// Interface{
  children.ReactNode;
  offsetBottom?;
  className?;
}

export const StickyActions.FC<StickyActionsProps> = ({
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
// Interface{
  children.ReactNode;
  offsetTop?;
  className?;
}

export const StickySidebar.FC<StickySidebarProps> = ({
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

