import React from 'react';
import { Upload, UploadProps, Button, message } from 'antd';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import {
  UploadOutlined,
  InboxOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { cn } from '../../utils/cn';

const { Dragger } = Upload;

export interface CustomUploadProps extends Omit<UploadProps, 'onChange'> {
  label?: string;
  hint?: string;
  error?: string;
  maxSize?: number; // MB
  variant?: 'button' | 'drag' | 'picture' | 'avatar';
  onChange?: (files: UploadFile[]) => void;
  className?: string;
}

/**
 * CustomUpload - Enhanced Upload component
 */
export const CustomUpload: React.FC<CustomUploadProps> = ({
  label,
  hint,
  error,
  maxSize = 5,
  variant = 'button',
  onChange,
  className,
  accept,
  maxCount,
  fileList,
  ...props
}) => {
  const [uploading, setUploading] = React.useState(false);

  const beforeUpload = (file: RcFile) => {
    const isLt = file.size / 1024 / 1024 < maxSize;
    if (!isLt) {
      message.error(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSize}MB!`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    setUploading(info.file.status === 'uploading');
    onChange?.(info.fileList);
  };

  const uploadButton = (
    <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} loading={uploading}>
      อัพโหลด
    </Button>
  );

  const pictureButton = (
    <div className="flex flex-col items-center justify-center p-4">
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2 text-sm">อัพโหลดรูป</div>
    </div>
  );

  const avatarButton = (
    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400 transition-colors">
      {uploading ? <LoadingOutlined /> : <PlusOutlined className="text-2xl text-gray-400" />}
    </div>
  );

  const renderUpload = () => {
    if (variant === 'drag') {
      return (
        <Dragger
          accept={accept}
          maxCount={maxCount}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          {...props}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">คลิกหรือลากไฟล์มาวางที่นี่</p>
          <p className="ant-upload-hint">
            {hint || `รองรับไฟล์ขนาดไม่เกิน ${maxSize}MB`}
          </p>
        </Dragger>
      );
    }

    if (variant === 'picture') {
      return (
        <Upload
          listType="picture-card"
          accept={accept || 'image/*'}
          maxCount={maxCount}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          {...props}
        >
          {(!maxCount || (fileList?.length ?? 0) < maxCount) && pictureButton}
        </Upload>
      );
    }

    if (variant === 'avatar') {
      return (
        <Upload
          listType="picture-circle"
          accept={accept || 'image/*'}
          maxCount={1}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          showUploadList={false}
          {...props}
        >
          {fileList && fileList.length > 0 ? (
            <img
              src={fileList[0].url || fileList[0].thumbUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            avatarButton
          )}
        </Upload>
      );
    }

    return (
      <Upload
        accept={accept}
        maxCount={maxCount}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        {...props}
      >
        {uploadButton}
      </Upload>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      {renderUpload()}
      {hint && variant !== 'drag' && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

CustomUpload.displayName = 'CustomUpload';

