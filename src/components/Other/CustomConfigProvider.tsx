import React from 'react';
import { ConfigProvider, ConfigProviderProps, theme, App } from 'antd';
import thTH from 'antd/locale/th_TH';
import enUS from 'antd/locale/en_US';

export type LocaleType = 'th' | 'en';
export type ThemeType = 'light' | 'dark';

export interface CustomConfigProviderProps {
  children: React.ReactNode;
  locale?: LocaleType;
  themeMode?: ThemeType;
  primaryColor?: string;
  borderRadius?: number;
  compact?: boolean;
}

const localeMap = {
  th: thTH,
  en: enUS,
};

/**
 * CustomConfigProvider - Enhanced ConfigProvider with Thai locale
 */
export const CustomConfigProvider: React.FC<CustomConfigProviderProps> = ({
  children,
  locale = 'th',
  themeMode = 'light',
  primaryColor = '#1677ff',
  borderRadius = 6,
  compact = false,
}) => {
  const algorithm = themeMode === 'dark'
    ? [theme.darkAlgorithm]
    : compact
    ? [theme.compactAlgorithm]
    : undefined;

  return (
    <ConfigProvider
      locale={localeMap[locale]}
      theme={{
        algorithm,
        token: {
          colorPrimary: primaryColor,
          borderRadius,
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};

CustomConfigProvider.displayName = 'CustomConfigProvider';

// Theme Provider (simpler version)
export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: ThemeType;
  primaryColor?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: themeMode = 'light',
  primaryColor = '#1677ff',
}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : undefined,
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';

// Thai Locale Provider
export interface ThaiLocaleProviderProps {
  children: React.ReactNode;
}

export const ThaiLocaleProvider: React.FC<ThaiLocaleProviderProps> = ({
  children,
}) => {
  return (
    <ConfigProvider locale={thTH}>
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};

ThaiLocaleProvider.displayName = 'ThaiLocaleProvider';

// Preset themes
export const presetThemes = {
  blue: '#1677ff',
  green: '#52c41a',
  purple: '#722ed1',
  cyan: '#13c2c2',
  orange: '#fa8c16',
  red: '#f5222d',
  pink: '#eb2f96',
  volcano: '#fa541c',
  gold: '#faad14',
  lime: '#a0d911',
};

// Custom theme generator
export function createTheme(options: {
  primaryColor?: string;
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
  borderRadius?: number;
  fontSize?: number;
}): ConfigProviderProps['theme'] {
  return {
    token: {
      colorPrimary: options.primaryColor || presetThemes.blue,
      colorSuccess: options.successColor || '#52c41a',
      colorWarning: options.warningColor || '#faad14',
      colorError: options.errorColor || '#ff4d4f',
      borderRadius: options.borderRadius ?? 6,
      fontSize: options.fontSize ?? 14,
    },
  };
}

