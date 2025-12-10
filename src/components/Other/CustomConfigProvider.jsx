import React from 'react';
import { ConfigProvider, ConfigProviderProps, theme, App } from 'antd';
import thTH from 'antd/locale/th_TH';
import enUS from 'antd/locale/en_US';






const localeMap = {
  th};

/**
 * CustomConfigProvider - Enhanced ConfigProvider with Thai locale
 */
export const CustomConfigProvider = ({
  children,
  locale = 'th',
  themeMode = 'light',
  primaryColor = '#1677ff',
  borderRadius = 6,
  compact = false,
}) => {
  const algorithm = themeMode === 'dark'
    ? [theme.darkAlgorithm]
    ? [theme.compactAlgorithm]
    ;

  return (
    <ConfigProvider
      locale={localeMap[locale]}
      theme={{
        algorithm,
        token: {
          colorPrimary},
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


export const ThemeProvider = ({
  children,
  theme= 'light',
  primaryColor = '#1677ff',
}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm=== 'dark' ? theme.darkAlgorithm : undefined,
        token: {
          colorPrimary},
      }}
    >
      {children}
    </ConfigProvider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';

// Thai Locale Provider


export const ThaiLocaleProvider = ({
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
  primaryColor?;
  successColor?;
  warningColor?;
  errorColor?;
  borderRadius?;
  fontSize?;
})'theme'] {
  return {
    token: {
      colorPrimary.primaryColor || presetThemes.blue,
      colorSuccess.successColor || '#52c41a',
      colorWarning.warningColor || '#faad14',
      colorError.errorColor || '#ff4d4f',
      borderRadius.borderRadius ?? 6,
      fontSize.fontSize ?? 14,
    },
  };
}

