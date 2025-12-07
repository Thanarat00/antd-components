import React from 'react';
import type { Preview } from '@storybook/react';
import { ConfigProvider } from 'antd';
import thTH from 'antd/locale/th_TH';
import { CustomNotification } from '../src/components/Feedback/CustomNotification';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#1f1f1f' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider
        locale={thTH}
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
          },
        }}
      >
        <CustomNotification>
          <div style={{ padding: '20px' }}>
            <Story />
          </div>
        </CustomNotification>
      </ConfigProvider>
    ),
  ],
};

export default preview;

