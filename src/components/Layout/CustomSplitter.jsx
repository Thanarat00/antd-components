import React from 'react';
import { Splitter, SplitterProps } from 'antd';
import { cn } from '../../utils/cn';

// Interface{
  className?;
}

/**
 * CustomSplitter - Enhanced Splitter
 */
export const CustomSplitter.FC<CustomSplitterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Splitter className={className} {...props}>
      {children}
    </Splitter>
  );
};

CustomSplitter.displayName = 'CustomSplitter';

// Splitter Panel
// Interface{
  children.ReactNode;
  defaultSize?;
  min?;
  max?;
  collapsible?;
  resizable?;
  className?;
}

export const CustomSplitterPanel.FC<CustomSplitterPanelProps> = ({
  children,
  defaultSize,
  min,
  max,
  collapsible = false,
  resizable = true,
  className,
}) => {
  return (
    <Splitter.Panel
      defaultSize={defaultSize}
      min={min}
      max={max}
      collapsible={collapsible}
      resizable={resizable}
      className={className}
    >
      {children}
    </Splitter.Panel>
  );
};

CustomSplitterPanel.displayName = 'CustomSplitterPanel';

// Two Panel Splitter (common pattern)
// Interface{
  left.ReactNode;
  right.ReactNode;
  leftWidth?;
  leftMin?;
  leftMax?;
  direction?: 'horizontal' | 'vertical';
  className?;
}

export const TwoPanelSplitter.FC<TwoPanelSplitterProps> = ({
  left,
  right,
  leftWidth = '30%',
  leftMin = '20%',
  leftMax = '50%',
  direction = 'horizontal',
  className,
}) => {
  return (
    <Splitter layout={direction} className={cn('h-full', className)}>
      <Splitter.Panel defaultSize={leftWidth} min={leftMin} max={leftMax}>
        {left}
      </Splitter.Panel>
      <Splitter.Panel>
        {right}
      </Splitter.Panel>
    </Splitter>
  );
};

TwoPanelSplitter.displayName = 'TwoPanelSplitter';

// Three Panel Splitter
// Interface{
  left.ReactNode;
  center.ReactNode;
  right.ReactNode;
  leftWidth?;
  rightWidth?;
  className?;
}

export const ThreePanelSplitter.FC<ThreePanelSplitterProps> = ({
  left,
  center,
  right,
  leftWidth = '20%',
  rightWidth = '20%',
  className,
}) => {
  return (
    <Splitter className={cn('h-full', className)}>
      <Splitter.Panel defaultSize={leftWidth} min="10%" max="40%">
        {left}
      </Splitter.Panel>
      <Splitter.Panel>
        {center}
      </Splitter.Panel>
      <Splitter.Panel defaultSize={rightWidth} min="10%" max="40%">
        {right}
      </Splitter.Panel>
    </Splitter>
  );
};

ThreePanelSplitter.displayName = 'ThreePanelSplitter';

