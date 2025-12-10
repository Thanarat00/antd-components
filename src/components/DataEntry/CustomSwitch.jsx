import React from 'react';
import { Switch } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomSwitch - Enhanced Switch
 */
export const CustomSwitch = ({
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


export const ConfirmSwitch = ({
  confirmTitle = 'ยืนยันการเปลี่ยนแปลง',
  confirmDescription,
  onConfirm,
  onChange,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleChange = async (checked.MouseEvent<HTMLButtonElement>) => {
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

