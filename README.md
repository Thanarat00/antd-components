# Antd Components

Custom Ant Design Component Library สำหรับ React พร้อมฟีเจอร์เสริมครบครัน

**รองรับ:** Vite, Next.js (App Router & Pages Router)  
**ภาษา:** TypeScript / JavaScript  
**Theme:** Custom Antd Theme + Custom Tailwind Theme

## ✨ Features

### Core Features
- ✅ Custom Ant Design Components
- ✅ Custom Tailwind CSS Theme
- ✅ Axios Instant Service (พร้อม Auth & Token Refresh)
- ✅ js-cookie Integration

### Optional Features (เลือกได้)
- 🔍 **Tanstack Query** - Data fetching สำหรับ Next.js
- 🛣️ **Routing** - Tanstack Router หรือ React Router DOM
- 🗄️ **State Management** - Zustand หรือ Redux
- 📋 **Form Library** - React Hook Form หรือ Olapat
- 📝 **Language** - TypeScript หรือ JavaScript

## 🚀 Installation

```bash
npx github:Thanarat00/antd-components init
```

**Interactive CLI** จะถามให้เลือก:
1. ภาษา (TypeScript/JavaScript)
2. Routing Library (None/Tanstack Router/React Router DOM)
3. State Management (None/Zustand/Redux)
4. Form Library (None/React Hook Form/Olapat)
5. Tanstack Query (Yes/No)

**ระบบจะ:**
- ✅ ตรวจจับ project type อัตโนมัติ
- ✅ สร้างไฟล์ components ทั้งหมด
- ✅ สร้างไฟล์ services, lib, hooks ตามที่เลือก
- ✅ ติดตั้ง dependencies อัตโนมัติ
- ✅ Setup Tailwind CSS
- ✅ สร้าง/อัพเดท `jsconfig.json` สำหรับโปรเจค JavaScript (รองรับ JSX syntax)

## 📖 Usage

### Basic Usage

```tsx
// main.tsx หรือ app/layout.tsx
import './styles/index.css';
import { CustomInput, CustomCard, CustomTable } from './components';
```

### Using Axios Instant Service

```tsx
import { axiosInstant } from './services';

// GET request
const { data } = await axiosInstant.get('/api/users');

// POST request
const { data } = await axiosInstant.post('/api/users', { name: 'John' });

// Set token after login
axiosInstant.setToken('your-access-token');
```

### Using Tanstack Query

```tsx
import { QueryProvider } from './lib/tanstack-query';
import { useApiQuery, useApiMutation } from './lib/tanstack-query-hooks';

// Wrap your app
<QueryProvider enableDevtools>
  <App />
</QueryProvider>

// Use in components
const { data, isLoading } = useApiQuery('users', '/api/users');
const createUser = useApiMutation('/api/users');
```

### Using Routing

#### Tanstack Router
```tsx
import { TanstackRouterProvider } from './lib/routing/tanstack-router';
```

#### React Router DOM
```tsx
import { ReactRouterProvider } from './lib/routing/react-router';

<ReactRouterProvider
  routes={[
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
  ]}
/>
```

### Using State Management

#### Zustand
```tsx
import { createZustandStore } from './lib/store/zustand-store';

const useStore = createZustandStore({
  name: 'app-store',
  initialState: { user: null },
  persist: true,
});
```

#### Redux
```tsx
import { createReduxSlice, createReduxStore, ReduxProvider } from './lib/store/redux-store';

const userSlice = createReduxSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },
  },
});
```

### Using Custom Form Hook

```tsx
import { useForm } from './hooks/useForm';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  library: 'react-hook-form',
  validationSchema: schema,
  resolver: 'zod',
});
```

## 📦 Components

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

## 🗂️ Project Structure

```
src/
├── components/        # Antd custom components
├── services/         # axiosInstant service (TS & JS)
├── lib/
│   ├── tanstack-query.ts/js
│   ├── routing/      # Tanstack Router & React Router
│   └── store/        # Zustand & Redux
├── hooks/
│   └── useForm.ts/js # Custom form hook
└── utils/            # Utility functions
```

## 🔧 Troubleshooting

### JSX Syntax Error

หากพบ error **"The JSX syntax extension is not currently enabled"** เมื่อใช้โปรเจค JavaScript:

**วิธีแก้:**
1. CLI จะสร้าง `jsconfig.json` อัตโนมัติเมื่อเลือก JavaScript
2. หากยังมี error ให้ตรวจสอบว่า `jsconfig.json` มีการตั้งค่า JSX:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

3. สำหรับ Vite projects: ตรวจสอบว่า `vite.config.js` มี `@vitejs/plugin-react`:

```js
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
};
```

## 📚 Documentation

ดูรายละเอียดเพิ่มเติมใน [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🔧 Dependencies

### Core (Always Installed)
- `antd` - Ant Design UI library
- `@ant-design/icons` - Icons
- `dayjs` - Date utilities
- `clsx` - Class name utility
- `axios` - HTTP client
- `js-cookie` - Cookie management

### Optional (Based on Selection)
- `@tanstack/react-query` - Data fetching
- `@tanstack/react-router` - Routing
- `react-router-dom` - Routing
- `zustand` - State management
- `@reduxjs/toolkit` - State management
- `react-hook-form` - Form handling
- `olapat` - Form handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
