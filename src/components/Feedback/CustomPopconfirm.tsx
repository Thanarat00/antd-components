import React from 'react';
import { Popconfirm, PopconfirmProps, Button } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';

export interface CustomPopconfirmProps extends PopconfirmProps {
  variant?: 'default' | 'danger';
  className?: string;
}

/**
 * CustomPopconfirm - Enhanced Popconfirm
 */
export const CustomPopconfirm: React.FC<CustomPopconfirmProps> = ({
  variant = 'default',
  children,
  okText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  className,
  ...props
}) => {
  return (
    <Popconfirm
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: variant === 'danger' }}
      icon={<ExclamationCircleOutlined className={variant === 'danger' ? 'text-red-500' : 'text-yellow-500'} />}
      className={className}
      {...props}
    >
      {children}
    </Popconfirm>
  );
};

CustomPopconfirm.displayName = 'CustomPopconfirm';

// Delete Confirm Button
export interface DeleteConfirmButtonProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
}

export const DeleteConfirmButton: React.FC<DeleteConfirmButtonProps> = ({
  onConfirm,
  title = 'ยืนยันการลบ',
  description = 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
  buttonText,
  loading = false,
  disabled = false,
  size = 'middle',
}) => {
  return (
    <CustomPopconfirm
      variant="danger"
      title={title}
      description={description}
      onConfirm={onConfirm}
      okText="ลบ"
    >
      <Button
        danger
        icon={<DeleteOutlined />}
        loading={loading}
        disabled={disabled}
        size={size}
      >
        {buttonText}
      </Button>
    </CustomPopconfirm>
  );
};

DeleteConfirmButton.displayName = 'DeleteConfirmButton';

// Action Confirm
export interface ActionConfirmProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  children: React.ReactNode;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const ActionConfirm: React.FC<ActionConfirmProps> = ({
  title,
  description,
  onConfirm,
  children,
  okText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  danger = false,
}) => {
  return (
    <CustomPopconfirm
      variant={danger ? 'danger' : 'default'}
      title={title}
      description={description}
      onConfirm={onConfirm}
      okText={okText}
      cancelText={cancelText}
    >
      {children}
    </CustomPopconfirm>
  );
};

ActionConfirm.displayName = 'ActionConfirm';

