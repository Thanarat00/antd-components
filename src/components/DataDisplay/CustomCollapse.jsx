import React from 'react';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';





/**
 * CustomCollapse - Enhanced Collapse/Accordion
 */
export const CustomCollapse = ({
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
    collapsible: item.disabled ? 'disabled' : undefined,
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


export const CollapsiblePanel = ({
  title,
  children,
  defaultOpen = false,
  extra,
  className }) => {
  return (
    <Collapse
      defaultActiveKey={defaultOpen ? ['1'] : []}
      ghost
      items={[
        {
          key: '1',
          label: title,
          children: children,
          extra: extra,
        },
      ]}
      className={className}
    />
  );
};

CollapsiblePanel.displayName = 'CollapsiblePanel';

// FAQ Accordion




export const FAQAccordion = ({
  items,
  className }) => {
  const collapseItems = items.map((item, index) => ({
    key: `faq-${index}`,
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

