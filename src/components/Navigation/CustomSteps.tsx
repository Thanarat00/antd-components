import React from 'react';
import { Steps, StepsProps } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface StepItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
}

export interface CustomStepsProps extends Omit<StepsProps, 'items'> {
  items: StepItem[];
  currentStep?: number;
  onChange?: (step: number) => void;
  variant?: 'default' | 'navigation' | 'inline';
  clickable?: boolean;
  className?: string;
}

/**
 * CustomSteps - Enhanced Steps component
 */
export const CustomSteps: React.FC<CustomStepsProps> = ({
  items,
  currentStep = 0,
  onChange,
  variant = 'default',
  clickable = false,
  className,
  ...props
}) => {
  const stepsItems = items.map((item, index) => ({
    title: item.title,
    description: item.description,
    icon: item.icon,
    status: item.status,
    disabled: item.disabled,
  }));

  const handleChange = clickable ? onChange : undefined;

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
export interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  className,
}) => {
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
export interface StatusStep {
  title: string;
  description?: string;
  time?: string;
  status: 'completed' | 'current' | 'pending' | 'error';
}

export interface StatusStepsProps {
  steps: StatusStep[];
  className?: string;
}

export const StatusSteps: React.FC<StatusStepsProps> = ({
  steps,
  className,
}) => {
  const getStatus = (status: StatusStep['status']): StepsProps['items'][0]['status'] => {
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

  const getIcon = (status: StatusStep['status']) => {
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
      current={currentIndex >= 0 ? currentIndex : steps.length}
      items={steps.map((step) => ({
        title: step.title,
        description: (
          <div>
            {step.description && <div>{step.description}</div>}
            {step.time && <div className="text-xs text-gray-400 mt-1">{step.time}</div>}
          </div>
        ),
        status: getStatus(step.status),
        icon: getIcon(step.status),
      }))}
      className={className}
    />
  );
};

StatusSteps.displayName = 'StatusSteps';

