import React from 'react';
import { Modal, Button, Space, Result } from 'antd';
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { cn } from '../../utils/cn';



const sizeMap = {
  small: 400,
  medium: 520,
  large: 720,
  fullscreen: '100%',
};

/**
 * CustomModal - Enhanced Ant Design Modal with additional features
 *
 * Features:
 * - Preset sizes
 * - Simplified props
 * - Loading state support
 * - Customizable footer
 */
export const CustomModal = ({
  title,
  children,
  open,
  onClose,
  onConfirm,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  showFooter = true,
  footer,
  confirmLoading = false,
  confirmDanger = false,
  hideCancel = false,
  size = 'medium',
  className,
  centered = true,
  maskClosable = true,
  ...props
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  const defaultFooter = showFooter ? (
    <Space className="w-full justify-end">
      {!hideCancel && (
        <Button onClick={onClose} disabled={confirmLoading}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button
          type="primary"
          danger={confirmDanger}
          loading={confirmLoading}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      )}
    </Space>
  ) : null;

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={footer !== undefined ? footer : defaultFooter}
      width={sizeMap[size]}
      centered={centered}
      maskClosable={maskClosable && !confirmLoading}
      closable={!confirmLoading}
      className={cn('sgn-modal', className)}
      {...props}
    >
      {children}
    </Modal>
  );
};

CustomModal.displayName = 'CustomModal';

// Confirm Modal types

const iconMap = {
  info: <InfoCircleOutlined className="text-blue-500 text-4xl" />,
  success: <CheckCircleOutlined className="text-green-500 text-4xl" />,
  warning: <ExclamationCircleOutlined className="text-yellow-500 text-4xl" />,
  error: <CloseCircleOutlined className="text-red-500 text-4xl" />,
  confirm: <QuestionCircleOutlined className="text-yellow-500 text-4xl" />,
};

/**
 * ConfirmModal - Modal for confirmation dialogs
 */
export const ConfirmModal = ({
  type = 'confirm',
  title,
  content,
  open,
  onClose,
  onConfirm,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  confirmLoading = false,
}) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      confirmDanger={type === 'error'}
      size="small"
      title={null}
      className="sgn-confirm-modal"
    >
      <div className="text-center py-4">
        <div className="mb-4">{iconMap[type]}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        {content && <p className="text-gray-500">{content}</p>}
      </div>
    </CustomModal>
  );
};

ConfirmModal.displayName = 'ConfirmModal';

// Delete Confirm Modal


export const DeleteConfirmModal = ({
  itemName,
  open,
  onClose,
  onConfirm,
  confirmLoading = false,
}) => {
  return (
    <ConfirmModal
      type="error"
      title="ยืนยันการลบ"
      content={
        itemName
          ? `คุณต้องการลบ "${itemName}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`
          : 'คุณต้องการลบรายการนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้'
      }
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="ลบ"
      confirmLoading={confirmLoading}
    />
  );
};

DeleteConfirmModal.displayName = 'DeleteConfirmModal';

// Result Modal


export const ResultModal = ({
  type,
  title,
  subtitle,
  open,
  onClose,
  extra,
}) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      showFooter={false}
      size="small"
      title={null}
    >
      <Result
        status={type}
        title={title}
        subTitle={subtitle}
        extra={
          extra || (
            <Button type="primary" onClick={onClose}>
              ตกลง
            </Button>
          )
        }
      />
    </CustomModal>
  );
};

ResultModal.displayName = 'ResultModal';

