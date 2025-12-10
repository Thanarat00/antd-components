import React from 'react';
import { Form, FormProps, FormItemProps, Button, Space } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomForm - Enhanced Form wrapper
 */
export const CustomForm = ({
  children,
  className,
  layout = 'vertical',
  ...props
}) => {
  return (
    <Form
      layout={layout}
      className={className}
      scrollToFirstError
      {...props}
    >
      {children}
    </Form>
  );
};

CustomForm.displayName = 'CustomForm';

// Form Item


export const CustomFormItem = ({
  children,
  ...props
}) => {
  return (
    <Form.Item {...props}>
      {children}
    </Form.Item>
  );
};

CustomFormItem.displayName = 'CustomFormItem';

// Form Actions (Submit/Cancel buttons)


export const FormActions = ({
  submitText = 'บันทึก',
  cancelText = 'ยกเลิก',
  onCancel,
  loading = false,
  disabled = false,
  showCancel = true,
  align = 'right',
  className,
}) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <Form.Item className={cn('mb-0 mt-6', className)}>
      <div className={cn('flex gap-3', alignClass)}>
        {showCancel && (
          <Button onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={disabled}
        >
          {submitText}
        </Button>
      </div>
    </Form.Item>
  );
};

FormActions.displayName = 'FormActions';

// Form Section


export const FormSection = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

FormSection.displayName = 'FormSection';

// Form Grid


export const FormGrid = ({
  children,
  columns = 2,
  gap = 'medium',
  className,
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const gapClass = {
    small: 'gap-3',
    medium: 'gap-4',
    large: 'gap-6',
  }[gap];

  return (
    <div className={cn('grid', colsClass, gapClass, className)}>
      {children}
    </div>
  );
};

FormGrid.displayName = 'FormGrid';

// useForm hook re-export
export const useForm = Form.useForm;


