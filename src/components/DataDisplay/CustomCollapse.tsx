import React from 'react';
import { Collapse, CollapseProps } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CollapseItem {
  key: string;
  label: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  disabled?: boolean;
}

export interface CustomCollapseProps extends Omit<CollapseProps, 'items'> {
  items: CollapseItem[];
  variant?: 'default' | 'borderless' | 'ghost';
  className?: string;
}

/**
 * CustomCollapse - Enhanced Collapse/Accordion
 */
export const CustomCollapse: React.FC<CustomCollapseProps> = ({
  items,
  variant = 'default',
  className,
  ...props
}) => {
  const collapseItems = items.map((item) => ({
    key: item.key,
    label: item.label,
    children: item.children,
    extra: item.extra,
    collapsible: item.disabled ? ('disabled' as const) : undefined,
  }));

  return (
    <Collapse
      items={collapseItems}
      bordered={variant !== 'borderless'}
      ghost={variant === 'ghost'}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      className={className}
      {...props}
    />
  );
};

CustomCollapse.displayName = 'CustomCollapse';

// Single Collapsible Panel
export interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  extra?: React.ReactNode;
  className?: string;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  children,
  defaultOpen = false,
  extra,
  className,
}) => {
  return (
    <Collapse
      defaultActiveKey={defaultOpen ? ['1'] : []}
      ghost
      items={[
        {
          key: '1',
          label: title,
          children,
          extra,
        },
      ]}
      className={className}
    />
  );
};

CollapsiblePanel.displayName = 'CollapsiblePanel';

// FAQ Accordion
export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  className,
}) => {
  const collapseItems = items.map((item, index) => ({
    key: String(index),
    label: <span className="font-medium">{item.question}</span>,
    children: <div className="text-gray-600">{item.answer}</div>,
  }));

  return (
    <Collapse
      accordion
      items={collapseItems}
      bordered={false}
      className={cn('bg-transparent', className)}
      expandIconPosition="end"
    />
  );
};

FAQAccordion.displayName = 'FAQAccordion';

