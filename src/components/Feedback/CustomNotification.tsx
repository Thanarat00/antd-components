import React, { createContext, useContext, useCallback } from 'react';
import { notification, message } from 'antd';
import type { NotificationArgsProps } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationConfig {
  message: string;
  description?: string;
  duration?: number;
  placement?: NotificationArgsProps['placement'];
  onClick?: () => void;
}

interface NotificationContextType {
  notify: (type: NotificationType, config: NotificationConfig) => void;
  success: (config: NotificationConfig) => void;
  error: (config: NotificationConfig) => void;
  info: (config: NotificationConfig) => void;
  warning: (config: NotificationConfig) => void;
  toast: {
    success: (content: string, duration?: number) => void;
    error: (content: string, duration?: number) => void;
    info: (content: string, duration?: number) => void;
    warning: (content: string, duration?: number) => void;
    loading: (content: string, duration?: number) => void;
  };
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircleOutlined className="text-success-500" />,
  error: <CloseCircleOutlined className="text-error-500" />,
  info: <InfoCircleOutlined className="text-primary-500" />,
  warning: <ExclamationCircleOutlined className="text-warning-500" />,
};

interface CustomNotificationProviderProps {
  children: React.ReactNode;
}

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
export const CustomNotification: React.FC<CustomNotificationProviderProps> = ({
  children,
}) => {
  const [notificationApi, notificationHolder] = notification.useNotification();
  const [messageApi, messageHolder] = message.useMessage();

  const notify = useCallback(
    (type: NotificationType, config: NotificationConfig) => {
      notificationApi[type]({
        message: config.message,
        description: config.description,
        duration: config.duration ?? 4.5,
        placement: config.placement ?? 'topRight',
        icon: iconMap[type],
        onClick: config.onClick,
        className: 'sgn-notification',
      });
    },
    [notificationApi]
  );

  const success = useCallback(
    (config: NotificationConfig) => notify('success', config),
    [notify]
  );

  const error = useCallback(
    (config: NotificationConfig) => notify('error', config),
    [notify]
  );

  const info = useCallback(
    (config: NotificationConfig) => notify('info', config),
    [notify]
  );

  const warning = useCallback(
    (config: NotificationConfig) => notify('warning', config),
    [notify]
  );

  const toast = {
    success: (content: string, duration = 3) => {
      messageApi.success(content, duration);
    },
    error: (content: string, duration = 3) => {
      messageApi.error(content, duration);
    },
    info: (content: string, duration = 3) => {
      messageApi.info(content, duration);
    },
    warning: (content: string, duration = 3) => {
      messageApi.warning(content, duration);
    },
    loading: (content: string, duration = 0) => {
      messageApi.loading(content, duration);
    },
  };

  const contextValue: NotificationContextType = {
    notify,
    success,
    error,
    info,
    warning,
    toast,
  };

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
export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a CustomNotification provider');
  }

  return context;
}

// Static notification methods (for use outside React components)
export const showNotification = {
  success: (config: NotificationConfig) => {
    notification.success({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.success,
    });
  },
  error: (config: NotificationConfig) => {
    notification.error({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.error,
    });
  },
  info: (config: NotificationConfig) => {
    notification.info({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.info,
    });
  },
  warning: (config: NotificationConfig) => {
    notification.warning({
      message: config.message,
      description: config.description,
      duration: config.duration ?? 4.5,
      placement: config.placement ?? 'topRight',
      icon: iconMap.warning,
    });
  },
};

// Static toast methods (for use outside React components)
export const showToast = {
  success: (content: string, duration = 3) => message.success(content, duration),
  error: (content: string, duration = 3) => message.error(content, duration),
  info: (content: string, duration = 3) => message.info(content, duration),
  warning: (content: string, duration = 3) => message.warning(content, duration),
  loading: (content: string, duration = 0) => message.loading(content, duration),
};

