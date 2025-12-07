# Antd Components

Custom Ant Design Component Library ที่พัฒนาด้วย React + TypeScript + Tailwind CSS สำหรับใช้งานในโปรเจกต์ต่างๆ

**Version:** 0.1.0

## Features

- 🎨 **Custom Components** - Form, Layout, Table, Feedback components ที่ customize แล้ว
- 🇹🇭 **Thai Support** - รองรับภาษาไทยและ Buddhist Era
- 💅 **Tailwind CSS** - Styling ด้วย Tailwind CSS ที่ทำงานร่วมกับ Antd
- 📦 **Tree-shakable** - Import เฉพาะ component ที่ใช้
- 📚 **Storybook** - Documentation และ Playground

## Installation

```bash
# From GitHub (แนะนำ)
npm install github:Thanarat00/antd-components#v0.1.0

# From local path
npm install ../And-compents
```

**หมายเหตุ:** Library นี้จะติดตั้ง `antd` และ dependencies อื่นๆ ให้อัตโนมัติ  
ต้องมี `react` และ `react-dom` ในโปรเจกต์อยู่แล้ว (ซึ่งโปรเจกต์ React ทุกตัวมีอยู่แล้ว)

## Usage

```tsx
import { 
  CustomInput, 
  CustomSelect, 
  CustomTable, 
  CustomCard,
  CustomModal,
  CustomNotification 
} from 'antd-components';
import 'antd-components/styles';

// Wrap your app with CustomNotification provider
function App() {
  return (
    <CustomNotification>
      <YourApp />
    </CustomNotification>
  );
}

// Use components
function YourApp() {
  return (
    <CustomCard title="My Card">
      <CustomInput 
        label="Username" 
        placeholder="Enter username"
        required 
      />
      <CustomSelect
        label="Category"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
      />
    </CustomCard>
  );
}
```

## Components

### Form Components
- `CustomInput` - Enhanced input with label, validation, icons
- `CustomSearchInput` - Search input with icon
- `CustomPasswordInput` - Password input with toggle
- `CustomTextArea` - Textarea with character count
- `CustomSelect` - Select with search, multi-select, custom render
- `CustomStatusSelect` - Select with status indicators
- `CustomDatePicker` - DatePicker with Thai locale and presets
- `CustomRangePicker` - Date range picker

### Layout Components
- `CustomCard` - Card with loading, actions, menu
- `StatsCard` - Statistics card with trend
- `CustomPageHeader` - Page header with breadcrumbs
- `CompactPageHeader` - Compact header
- `CustomSidebar` - Collapsible sidebar navigation

### Table Components
- `CustomTable` - Table with pagination, sorting, filtering, search, export

### Feedback Components
- `CustomModal` - Modal with simplified props
- `ConfirmModal` - Confirmation dialog
- `DeleteConfirmModal` - Delete confirmation
- `ResultModal` - Result display
- `CustomNotification` - Notification provider
- `useNotification` - Hook for notifications

### Hooks
- `useTableSearch` - Table search/filter hook
- `useLocalStorage` - LocalStorage state hook
- `useNotification` - Notification hook

### Utilities
- `formatDate` - Format date
- `formatThaiDate` - Format Thai Buddhist Era date
- `cn` - Classname utility

## Development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Build library
npm run build
```

## Build Output

After running `npm run build`, the library will be built to `dist/` folder:

```
dist/
├── antd-components.js       # ES Module
├── antd-components.umd.cjs  # UMD
├── style.css                # Styles
└── *.d.ts                   # Type definitions
```

## License

MIT

