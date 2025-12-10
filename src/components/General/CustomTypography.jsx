import React from 'react';
import { Typography } from 'antd';
import { cn } from '../../utils/cn';

const { Title, Text, Paragraph, Link } = Typography;

// Custom Title
export const CustomTitle = ({
  level = 1,
  className,
  gradient = false,
  gradientColors = ['#1677ff', '#722ed1'],
  style,
  children,
  ...props
}) => {
  const gradientStyle = gradient
    ? {
        background: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : {};

  return (
    <Title
      level={level}
      className={className}
      style={{ ...gradientStyle, ...style }}
      {...props}
    >
      {children}
    </Title>
  );
};

CustomTitle.displayName = 'CustomTitle';

// Custom Text
export const CustomText = ({
  variant = 'default',
  size = 'base',
  weight = 'normal',
  className,
  children,
  ...props
}) => {
  const variantClass = {
    default: '',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    muted: 'text-gray-400',
  }[variant];

  const sizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[size];

  const weightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }[weight];

  return (
    <Text className={cn(variantClass, sizeClass, weightClass, className)} {...props}>
      {children}
    </Text>
  );
};

CustomText.displayName = 'CustomText';

// Custom Paragraph
export const CustomParagraph = ({
  size = 'base',
  muted = false,
  className,
  children,
  ...props
}) => {
  const sizeClass = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }[size];

  return (
    <Paragraph
      className={cn(sizeClass, muted && 'text-gray-500', className)}
      {...props}
    >
      {children}
    </Paragraph>
  );
};

CustomParagraph.displayName = 'CustomParagraph';

// Custom Link
export const CustomLink = ({
  href,
  target,
  children,
  className,
  underline = true,
  onClick,
}) => {
  return (
    <Link
      href={href}
      target={target}
      className={cn(!underline && 'no-underline', className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

CustomLink.displayName = 'CustomLink';

// Label component
export const Label = ({
  children,
  required = false,
  htmlFor,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-gray-700 mb-1', className)}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

Label.displayName = 'Label';

// Helper Text
export const HelperText = ({
  children,
  error = false,
  className,
}) => {
  return (
    <p
      className={cn(
        'mt-1 text-xs',
        error ? 'text-red-500' : 'text-gray-500',
        className
      )}
    >
      {children}
    </p>
  );
};

HelperText.displayName = 'HelperText';

