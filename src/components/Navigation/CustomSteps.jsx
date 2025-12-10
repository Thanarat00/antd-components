import React from 'react';
import { Steps } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';





/**
 * CustomSteps - Enhanced Steps component
 */
export const CustomSteps = ({
  items,
  currentStep = 0,
  onChange,
  variant = 'default',
  clickable = false,
  className,
  ...props
}) => {
  const stepsItems = items.map((item, index) => ({
    title.title,
    description.description,
    icon.icon,
    status.status,
    disabled.disabled }));

  const handleChange = clickable ? onChange ;

  if (variant === 'navigation') {
    return (
      <Steps
        type="navigation"
        current={currentStep}
        onChange={handleChange}
        items={stepsItems}
        className={cn('site-navigation-steps', className)}
        {...props}
      />
    );
  }

  if (variant === 'inline') {
    return (
      <Steps
        type="inline"
        current={currentStep}
        onChange={handleChange}
        items={stepsItems}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Steps
      current={currentStep}
      onChange={handleChange}
      items={stepsItems}
      className={className}
      {...props}
    />
  );
};

CustomSteps.displayName = 'CustomSteps';

// Progress Steps (with percentage)


export const ProgressSteps = ({
  steps,
  currentStep,
  className }) => {
  const percent = Math.round((currentStep / (steps.length - 1)) * 100);

  return (
    <div className={cn('w-full', className)}>
      <Steps
        current={currentStep}
        percent={percent}
        items={steps.map((title) => ({ title }))}
      />
    </div>
  );
};

ProgressSteps.displayName = 'ProgressSteps';

// Status Steps (Order tracking style)




export const StatusSteps = ({
  steps,
  className }) => {
  const getStatus = (status'status'])'items'][0] => {
    switch (status) {
      case 'completed':
        return 'finish';
      case 'current':
        return 'process';
      case 'error':
        return 'error';
      default:
        return 'wait';
    }
  };

  const getIcon = (status'status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'current':
        return <ClockCircleOutlined />;
      case 'error':
        return <CloseCircleOutlined />;
      default:
        return undefined;
    }
  };

  const currentIndex = steps.findIndex((s) => s.status === 'current');

  return (
    <Steps
      direction="vertical"
      current={currentIndex >= 0 ? currentIndex .length}
      items={steps.map((step) => ({
        title.title,
        description: (
          <div>
            {step.description && <div>{step.description}</div>}
            {step.time && <div className="text-xs text-gray-400 mt-1">{step.time}</div>}
          </div>
        ),
        status(step.status),
        icon(step.status),
      }))}
      className={className}
    />
  );
};

StatusSteps.displayName = 'StatusSteps';

