import React, { createContext, useContext, useCallback } from 'react';
import { notification, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined } from '@ant-design/icons';


const NotificationContext = createContext(null);

const iconMap = {
  success: <CheckCircleOutlined className="text-green-500" />,
  error: <CloseCircleOutlined className="text-red-500" />,
  info: <InfoCircleOutlined className="text-blue-500" />,
  warning: <ExclamationCircleOutlined className="text-yellow-500" /> };



/**
 * CustomNotification Provider
 *
 * Wrap your app with this provider to use notifications throughout your app.
 *
 * Features:
 * - Notification with icons
 * - Toast messages
 * - Customizable placement and duration
 */
export const CustomNotification = ({
  children }) => {
  const [notificationApi, notificationHolder] = notification.useNotification();
  const [messageApi, messageHolder] = message.useMessage();

  const notify = useCallback(
    (type, config) => {
      notificationApi[type]({
        message: config.message,
        description: config.description,
        duration: config.duration ?? 4.5,
        placement: config.placement ?? 'topRight',
        icon: iconMap[type],
        onClick: config.onClick,
        className: 'sgn-notification' });
    },
    [notificationApi]
  );

  const success = useCallback(
    (config) => notify('success', config),
    [notify]
  );

  const error = useCallback(
    (config) => notify('error', config),
    [notify]
  );

  const info = useCallback(
    (config) => notify('info', config),
    [notify]
  );

  const warning = useCallback(
    (config) => notify('warning', config),
    [notify]
  );

  const toast = {
    success: (content, duration = 3) => {
      messageApi.success(content, duration);
    },
    error: (content, duration = 3) => {
      messageApi.error(content, duration);
    },
    info: (content, duration = 3) => {
      messageApi.info(content, duration);
    },
    warning: (content, duration = 3) => {
      messageApi.warning(content, duration);
    },
    loading: (content, duration = 0) => {
      messageApi.loading(content, duration);
    },
  };

  const contextValue = {
    notify,
    success,
    error,
    info,
    warning,
    toast };

  return (
    <NotificationContext.Provider value={contextValue}>
      {notificationHolder}
      {messageHolder}
      {children}
    </NotificationContext.Provider>
  );
};

CustomNotification.displayName = 'CustomNotification';

/**
 * useNotification hook
 *
 * Use this hook to access notification functions.
 *
 * @example
 * ```tsx
 * const { success, error, toast } = useNotification();
 *
 * // Show notification
 * success({ message: 'สำเร็จ!', description: 'บันทึกข้อมูลเรียบร้อย' });
 *
 * // Show toast
 * toast.success('บันทึกสำเร็จ');
 * ```
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a CustomNotification provider');
  }

  return context;
}

// Static notification methods (for use outside React components)
export const showNotification = {
  success: (config) => {
    notification.success({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.success });
  },
  error: (config) => {
    notification.error({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.error });
  },
  info: (config) => {
    notification.info({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.info });
  },
  warning: (config) => {
    notification.warning({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.warning });
  },
};

// Static toast methods (for use outside React components)
export const showToast = {
  success: (content, duration = 3) => message.success(content, duration),
  error: (content, duration = 3) => message.error(content, duration),
  info: (content, duration = 3) => message.info(content, duration),
  warning: (content, duration = 3) => message.warning(content, duration),
  loading: (content, duration = 0) => message.loading(content, duration) };

