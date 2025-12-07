# Antd Components

Custom Ant Design Component Library ที่พัฒนาด้วย React + TypeScript + Tailwind CSS สำหรับใช้งานในโปรเจกต์ต่างๆ

**Version:** 0.6.0

## Features

- 🎨 **Custom Components** - ครบทุก Component ตาม Ant Design
- 🇹🇭 **Thai Support** - รองรับภาษาไทยและ Buddhist Era
- 💅 **Tailwind CSS** - Styling ด้วย Tailwind CSS ที่ทำงานร่วมกับ Antd
- 📦 **Tree-shakable** - Import เฉพาะ component ที่ใช้
- 🚀 **Easy Install** - ติดตั้งครั้งเดียว พร้อมใช้งาน

## Installation

### วิธีที่ 1: CLI (แนะนำ) - Copy ไฟล์ลงโปรเจกต์

รันคำสั่งเดียว จะสร้างไฟล์ component ทั้งหมด + ติดตั้ง dependencies อัตโนมัติ

```bash
npx github:Thanarat00/antd-components init
```

**เพียงคำสั่งเดียว!** ระบบจะ:
1. ✅ สร้างไฟล์ components ทั้งหมดใน `src/components/antd`
2. ✅ ติดตั้ง `antd`, `@ant-design/icons`, `dayjs`, `clsx` อัตโนมัติ

**โครงสร้างไฟล์หลังรัน CLI:**

```
src/
├── components/
│   ├── antd/           ← Components ทั้งหมด
│   │   ├── Form/       # CustomInput, CustomSelect, CustomDatePicker...
│   │   ├── Layout/     # CustomCard, CustomSidebar, CustomDivider...
│   │   ├── Table/      # CustomTable
│   │   ├── Feedback/   # CustomModal, CustomAlert, CustomDrawer...
│   │   ├── General/    # CustomButton, CustomTypography...
│   │   ├── Navigation/ # CustomMenu, CustomTabs, CustomSteps...
│   │   ├── DataEntry/  # CustomCheckbox, CustomRadio, CustomSwitch...
│   │   ├── DataDisplay/# CustomAvatar, CustomBadge, CustomTag...
│   │   └── Other/      # CustomAffix, CustomConfigProvider...
│   └── index.ts        ← Import จากไฟล์นี้
├── utils/
│   ├── cn.ts
│   └── dateUtils.ts
└── hooks/
    ├── useTableSearch.ts
    └── useLocalStorage.ts
```

### วิธีที่ 2: Install เป็น Package

```bash
npm install github:Thanarat00/antd-components#v0.5.0
```

---

## Quick Start

```tsx
// src/App.tsx
import { 
  CustomInput, 
  CustomButton,
  CustomCard,
  ThaiLocaleProvider,
} from './components';  // หรือ '@/components' ถ้าตั้ง alias

function App() {
  return (
    <ThaiLocaleProvider>
      <CustomCard title="ฟอร์มทดสอบ">
        <CustomInput 
          label="ชื่อผู้ใช้" 
          placeholder="กรอกชื่อผู้ใช้"
          required 
        />
        <CustomButton type="primary">
          บันทึก
        </CustomButton>
      </CustomCard>
    </ThaiLocaleProvider>
  );
}

export default App;
```

## Components

### General
| Component | Description |
|-----------|-------------|
| `CustomButton` | Button พร้อม variants และ loading state |
| `CustomFloatButton` | Float Action Button |
| `BackToTopButton` | ปุ่มกลับด้านบน |
| `CustomTitle` | Typography Title |
| `CustomText` | Typography Text |
| `CustomParagraph` | Typography Paragraph |

### Layout
| Component | Description |
|-----------|-------------|
| `CustomCard` | Card พร้อม loading, actions, menu |
| `StatsCard` | Card แสดงสถิติพร้อม trend |
| `CustomPageHeader` | Page header พร้อม breadcrumbs |
| `CustomSidebar` | Collapsible sidebar navigation |
| `CustomDivider` | Divider พร้อม variants |
| `CustomFlex` / `Row` / `Column` | Flex layout |
| `SimpleGrid` / `AutoGrid` | Grid layout |
| `CustomSpace` | Space layout |
| `CustomSplitter` | Resizable split panels |

### Navigation
| Component | Description |
|-----------|-------------|
| `CustomBreadcrumb` | Breadcrumb พร้อม home icon |
| `CustomMenu` | Menu navigation |
| `CustomDropdown` | Dropdown menu |
| `ActionDropdown` | Dropdown 3 dots menu |
| `CustomPagination` | Pagination พร้อมภาษาไทย |
| `CustomSteps` | Steps/Wizard |
| `CustomTabs` | Tabs พร้อม badges |

### Data Entry
| Component | Description |
|-----------|-------------|
| `CustomInput` | Input พร้อม label, validation |
| `CustomPasswordInput` | Password input |
| `CustomSearchInput` | Search input |
| `CustomTextArea` | Textarea พร้อม character count |
| `CustomSelect` | Select พร้อม search |
| `CustomDatePicker` | DatePicker ภาษาไทย + presets |
| `CustomRangePicker` | Date range picker |
| `CustomCheckbox` | Checkbox |
| `CustomRadio` | Radio พร้อม card variant |
| `CustomSwitch` | Toggle switch |
| `CustomSlider` | Slider พร้อม input |
| `CustomRate` | Rating stars |
| `CustomUpload` | File upload |
| `CustomInputNumber` | Number input |
| `CurrencyInput` | Currency input (฿) |
| `CustomForm` | Form wrapper |

### Data Display
| Component | Description |
|-----------|-------------|
| `CustomAvatar` | Avatar พร้อม online status |
| `UserAvatar` | Avatar พร้อมชื่อ |
| `CustomBadge` | Badge |
| `StatusBadge` | Status indicator |
| `CustomTag` | Tag |
| `StatusTag` | Status tag |
| `CustomCollapse` | Accordion |
| `FAQAccordion` | FAQ layout |
| `CustomDescriptions` | Key-value display |
| `CustomStatistic` | Statistic พร้อม trend |
| `StatisticCard` | Statistic card |
| `CustomEmpty` | Empty state |
| `CustomTooltip` | Tooltip |
| `InfoTooltip` | Info icon tooltip |

### Table
| Component | Description |
|-----------|-------------|
| `CustomTable` | Table พร้อม pagination, sorting, filtering, search, export |
| `createActionColumn` | Helper สร้าง action column |
| `createStatusColumn` | Helper สร้าง status column |

### Feedback
| Component | Description |
|-----------|-------------|
| `CustomModal` | Modal |
| `ConfirmModal` | Confirmation dialog |
| `DeleteConfirmModal` | Delete confirmation |
| `ResultModal` | Result display |
| `CustomNotification` | Notification provider |
| `useNotification` | Notification hook |
| `CustomAlert` | Alert message |
| `CustomDrawer` | Drawer panel |
| `FilterDrawer` | Filter drawer |
| `CustomProgress` | Progress bar |
| `CircleProgress` | Circle progress |
| `CustomSkeleton` | Loading skeleton |
| `CardSkeleton` / `ListSkeleton` / `TableSkeleton` | Preset skeletons |
| `CustomSpin` | Loading spinner |
| `PageLoading` | Full page loading |
| `CustomPopconfirm` | Popconfirm |
| `DeleteConfirmButton` | Delete button with confirm |

### Other
| Component | Description |
|-----------|-------------|
| `CustomAffix` | Sticky element |
| `StickyHeader` / `StickyFooter` | Sticky layouts |
| `CustomConfigProvider` | Config provider |
| `ThaiLocaleProvider` | Thai locale wrapper |
| `ThemeProvider` | Theme wrapper |
| `createTheme` | Theme generator |

### Hooks
| Hook | Description |
|------|-------------|
| `useNotification` | Notification functions |
| `useTableSearch` | Table search/filter |
| `useLocalStorage` | LocalStorage state |
| `useForm` | Form instance |

### Utilities
| Utility | Description |
|---------|-------------|
| `formatDate` | Format date |
| `formatThaiDate` | Format Thai Buddhist Era |
| `cn` | Classname utility |
| `presetThemes` | Preset color themes |

## Versions

| Version | Features |
|---------|----------|
| v0.1.0 | Initial - Form, Layout, Table, Feedback |
| v0.1.1 | Easier installation |
| v0.2.0 | All Ant Design components |
| v0.3.0 | Complete - Layout & Other |
| v0.4.0 | Update antd to v6.0.1 |
| v0.5.0 | CLI Support - รันคำสั่งเดียวสร้างไฟล์ทั้งหมด |
| v0.6.0 | **Auto Install** - ติดตั้ง dependencies อัตโนมัติ |

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

```
dist/
├── antd-components.js       # ES Module
├── antd-components.umd.cjs  # UMD
├── style.css                # Styles
└── *.d.ts                   # Type definitions
```

## License

MIT
