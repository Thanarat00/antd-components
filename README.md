# Antd Components

Custom Ant Design Component Library สำหรับ React + TypeScript

**รองรับ:** Vite, Next.js (App Router & Pages Router)

## Installation

```bash
npx github:Thanarat00/antd-components init
```

**เพียงคำสั่งเดียว!** ระบบจะ:
- ✅ ตรวจจับ project type อัตโนมัติ
- ✅ สร้างไฟล์ components ทั้งหมด
- ✅ ติดตั้ง dependencies
- ✅ Setup Tailwind CSS

## Usage

### Vite

```tsx
// main.tsx
import './styles/index.css';
import { CustomInput, CustomCard } from './components';
```

### Next.js

```tsx
// app/layout.tsx หรือ pages/_app.tsx
import '@/styles/index.css';
import { CustomInput, CustomCard } from '@/components';
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
