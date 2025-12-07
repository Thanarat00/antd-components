import React from 'react';
import { Splitter, SplitterProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomSplitterProps extends SplitterProps {
  className?: string;
}

/**
 * CustomSplitter - Enhanced Splitter
 */
export const CustomSplitter: React.FC<CustomSplitterProps> = ({
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
export interface CustomSplitterPanelProps {
  children: React.ReactNode;
  defaultSize?: number | string;
  min?: number | string;
  max?: number | string;
  collapsible?: boolean;
  resizable?: boolean;
  className?: string;
}

export const CustomSplitterPanel: React.FC<CustomSplitterPanelProps> = ({
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
export interface TwoPanelSplitterProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: number | string;
  leftMin?: number | string;
  leftMax?: number | string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const TwoPanelSplitter: React.FC<TwoPanelSplitterProps> = ({
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
export interface ThreePanelSplitterProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: number | string;
  rightWidth?: number | string;
  className?: string;
}

export const ThreePanelSplitter: React.FC<ThreePanelSplitterProps> = ({
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

