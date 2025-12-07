import React from 'react';
import { Switch, SwitchProps } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomSwitchProps extends SwitchProps {
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  className?: string;
}

/**
 * CustomSwitch - Enhanced Switch
 */
export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  description,
  labelPosition = 'right',
  className,
  ...props
}) => {
  const switchElement = <Switch {...props} />;
  const labelElement = (
    <div className={cn(labelPosition === 'left' ? 'mr-3' : 'ml-3')}>
      {label && <span className="text-sm text-gray-700">{label}</span>}
      {description && (
        <span className="block text-xs text-gray-400">{description}</span>
      )}
    </div>
  );

  return (
    <label className={cn('inline-flex items-center cursor-pointer', className)}>
      {labelPosition === 'left' && labelElement}
      {switchElement}
      {labelPosition === 'right' && labelElement}
    </label>
  );
};

CustomSwitch.displayName = 'CustomSwitch';

// Switch with confirmation
export interface ConfirmSwitchProps extends CustomSwitchProps {
  confirmTitle?: string;
  confirmDescription?: string;
  onConfirm?: (checked: boolean) => Promise<boolean> | boolean;
}

export const ConfirmSwitch: React.FC<ConfirmSwitchProps> = ({
  confirmTitle = 'ยืนยันการเปลี่ยนแปลง',
  confirmDescription,
  onConfirm,
  onChange,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleChange = async (checked: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
    if (onConfirm) {
      setLoading(true);
      try {
        const confirmed = await onConfirm(checked);
        if (confirmed) {
          onChange?.(checked, event);
        }
      } finally {
        setLoading(false);
      }
    } else {
      onChange?.(checked, event);
    }
  };

  return (
    <CustomSwitch
      loading={loading}
      onChange={handleChange}
      {...props}
    />
  );
};

ConfirmSwitch.displayName = 'ConfirmSwitch';

