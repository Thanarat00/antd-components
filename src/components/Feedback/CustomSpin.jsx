import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomSpin - Enhanced Spin/Loading
 */
export const CustomSpin = ({
  fullscreen = false,
  text,
  children,
  className,
  ...props
}) => {
  const spinner = (
    <Spin
      indicator={<LoadingOutlined spin />}
      {...props}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        <div className="text-center">
          {spinner}
          {text && <p className="mt-3 text-gray-500">{text}</p>}
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <Spin
        indicator={<LoadingOutlined spin />}
        tip={text}
        className={className}
        {...props}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {spinner}
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

CustomSpin.displayName = 'CustomSpin';

// Loading Overlay


export const LoadingOverlay = ({
  loading,
  text = 'กำลังโหลด...',
  children,
  className }) => {
  return (
    <Spin
      spinning={loading}
      tip={text}
      indicator={<LoadingOutlined spin />}
      className={className}
    >
      {children}
    </Spin>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

// Page Loading


export const PageLoading = ({
  text = 'กำลังโหลด...' }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <Spin size="large" indicator={<LoadingOutlined spin />} />
        <p className="mt-4 text-gray-500">{text}</p>
      </div>
    </div>
  );
};

PageLoading.displayName = 'PageLoading';

// Button Loading


export const ButtonLoading = ({
  size = 'default' }) => {
  const sizeClass = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg' }[size];

  return <LoadingOutlined className={sizeClass} spin />;
};

ButtonLoading.displayName = 'ButtonLoading';

