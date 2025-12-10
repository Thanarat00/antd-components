import React from 'react';
import { Drawer, Button, Space } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomDrawer - Enhanced Drawer
 */
export const CustomDrawer = ({
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
  ) ;

  return (
    <Drawer
      onClose={onClose}
      footer={footer !== undefined ? footer }
      className={className}
      {...props}
    >
      {children}
    </Drawer>
  );
};

CustomDrawer.displayName = 'CustomDrawer';

// Filter Drawer


export const FilterDrawer = ({
  open,
  onClose,
  onApply,
  onReset,
  children,
  title = 'ตัวกรอง',
  loading = false }) => {
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


export const DetailDrawer = ({
  open,
  onClose,
  title = 'รายละเอียด',
  children,
  extra,
  width = 480 }) => {
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

