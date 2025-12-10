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



// Interface{
  message;
  description?;
  duration?;
  placement?'placement'];
  onClick?: () => void;
}

// Interface{
  notify: (type) => void;
  success: (config) => void;
  error: (config) => void;
  info: (config) => void;
  warning: (config) => void;
  toast: {
    success: (content?) => void;
    error: (content?) => void;
    info: (content?) => void;
    warning: (content?) => void;
    loading: (content?) => void;
  };
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const iconMap.ReactNode> = {
  success: <CheckCircleOutlined className="text-green-500" />,
  error: <CloseCircleOutlined className="text-red-500" />,
  info: <InfoCircleOutlined className="text-blue-500" />,
  warning: <ExclamationCircleOutlined className="text-yellow-500" />,
};

// Interface{
  children.ReactNode;
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
export const CustomNotification.FC<CustomNotificationProviderProps> = ({
  children,
}) => {
  const [notificationApi, notificationHolder] = notification.useNotification();
  const [messageApi, messageHolder] = message.useMessage();

  const notify = useCallback(
    (type) => {
      notificationApi[type]({
        message.message,
        description.description,
        duration.duration ?? 4.5,
        placement.placement ?? 'topRight',
        icon.onClick,
        className: 'sgn-notification',
      });
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
    success: (content= 3) => {
      messageApi.success(content, duration);
    },
    error: (content= 3) => {
      messageApi.error(content, duration);
    },
    info: (content= 3) => {
      messageApi.info(content, duration);
    },
    warning: (content= 3) => {
      messageApi.warning(content, duration);
    },
    loading: (content= 0) => {
      messageApi.loading(content, duration);
    },
  };

  const contextValue= {
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
export function useNotification(){
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
      message.message,
      description.description,
      duration.duration ?? 4.5,
      placement.placement ?? 'topRight',
      icon.success,
    });
  },
  error: (config) => {
    notification.error({
      message.message,
      description.description,
      duration.duration ?? 4.5,
      placement.placement ?? 'topRight',
      icon.error,
    });
  },
  info: (config) => {
    notification.info({
      message.message,
      description.description,
      duration.duration ?? 4.5,
      placement.placement ?? 'topRight',
      icon.info,
    });
  },
  warning: (config) => {
    notification.warning({
      message.message,
      description.description,
      duration.duration ?? 4.5,
      placement.placement ?? 'topRight',
      icon.warning,
    });
  },
};

// Static toast methods (for use outside React components)
export const showToast = {
  success: (content= 3) => message.success(content, duration),
  error: (content= 3) => message.error(content, duration),
  info: (content= 3) => message.info(content, duration),
  warning: (content= 3) => message.warning(content, duration),
  loading: (content= 0) => message.loading(content, duration),
};

