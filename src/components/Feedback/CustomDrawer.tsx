import React from 'react';
import { Drawer, DrawerProps, Button, Space } from 'antd';
import { cn } from '../../utils/cn';

export interface CustomDrawerProps extends DrawerProps {
  showFooter?: boolean;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  className?: string;
}

/**
 * CustomDrawer - Enhanced Drawer
 */
export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  children,
  showFooter = false,
  footer,
  onClose,
  onConfirm,
  confirmText = 'บันทึก',
  cancelText = 'ยกเลิก',
  confirmLoading = false,
  className,
  ...props
}) => {
  const defaultFooter = showFooter ? (
    <Space className="w-full justify-end">
      <Button onClick={(e) => onClose?.(e)} disabled={confirmLoading}>
        {cancelText}
      </Button>
      {onConfirm && (
        <Button type="primary" loading={confirmLoading} onClick={onConfirm}>
          {confirmText}
        </Button>
      )}
    </Space>
  ) : null;

  return (
    <Drawer
      onClose={onClose}
      footer={footer !== undefined ? footer : defaultFooter}
      className={className}
      {...props}
    >
      {children}
    </Drawer>
  );
};

CustomDrawer.displayName = 'CustomDrawer';

// Filter Drawer
export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply?: () => void;
  onReset?: () => void;
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  onApply,
  onReset,
  children,
  title = 'ตัวกรอง',
  loading = false,
}) => {
  return (
    <CustomDrawer
      title={title}
      open={open}
      onClose={onClose}
      width={360}
      footer={
        <div className="flex justify-between">
          <Button onClick={onReset} disabled={loading}>
            ล้างตัวกรอง
          </Button>
          <Space>
            <Button onClick={onClose} disabled={loading}>
              ยกเลิก
            </Button>
            <Button type="primary" onClick={onApply} loading={loading}>
              ค้นหา
            </Button>
          </Space>
        </div>
      }
    >
      {children}
    </CustomDrawer>
  );
};

FilterDrawer.displayName = 'FilterDrawer';

// Detail Drawer
export interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  width?: number | string;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  onClose,
  title = 'รายละเอียด',
  children,
  extra,
  width = 480,
}) => {
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      extra={extra}
    >
      {children}
    </Drawer>
  );
};

DetailDrawer.displayName = 'DetailDrawer';

