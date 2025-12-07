# Antd Components

Custom Ant Design Component Library สำหรับ React + TypeScript

## Installation

```bash
npx github:Thanarat00/antd-components init
```

**เพียงคำสั่งเดียว!** ระบบจะ:
- ✅ สร้างไฟล์ components ทั้งหมด
- ✅ ติดตั้ง dependencies อัตโนมัติ

## Usage

```tsx
import { 
  CustomInput, 
  CustomButton,
  CustomCard,
  CustomTable,
  ThaiLocaleProvider,
} from './components';

function App() {
  return (
    <ThaiLocaleProvider>
      <CustomCard title="ฟอร์มทดสอบ">
        <CustomInput label="ชื่อ" placeholder="กรอกชื่อ" required />
        <CustomButton type="primary">บันทึก</CustomButton>
      </CustomCard>
    </ThaiLocaleProvider>
  );
}
```

## Components

| Category | Components |
|----------|------------|
| **General** | Button, FloatButton, Typography |
| **Layout** | Card, PageHeader, Sidebar, Divider, Flex, Grid, Space, Splitter |
| **Navigation** | Breadcrumb, Menu, Dropdown, Pagination, Steps, Tabs |
| **Data Entry** | Input, Select, DatePicker, Checkbox, Radio, Switch, Slider, Rate, Upload, Form |
| **Data Display** | Avatar, Badge, Tag, Collapse, Descriptions, Statistic, Empty, Tooltip |
| **Table** | CustomTable (pagination, sorting, filtering, export) |
| **Feedback** | Modal, Alert, Drawer, Progress, Skeleton, Spin, Popconfirm, Notification |
| **Other** | Affix, ConfigProvider, ThemeProvider |

## License

MIT
