import React from 'react';
import { Popconfirm, PopconfirmProps, Button } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomPopconfirm - Enhanced Popconfirm
 */
export const CustomPopconfirm = ({
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
      okButtonProps={{ danger=== 'danger' }}
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


export const DeleteConfirmButton = ({
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


export const ActionConfirm = ({
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

