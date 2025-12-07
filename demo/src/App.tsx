import React, { useState } from 'react';
import { Button, Space, Divider, Tag } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

// Import components from library
import { CustomInput, CustomSearchInput, CustomPasswordInput } from 'sgn-antd-components/components/Form/CustomInput';
import { CustomSelect, CustomStatusSelect } from 'sgn-antd-components/components/Form/CustomSelect';
import { CustomDatePicker, CustomRangePicker } from 'sgn-antd-components/components/Form/CustomDatePicker';
import { CustomCard, StatsCard } from 'sgn-antd-components/components/Layout/CustomCard';
import { CustomPageHeader } from 'sgn-antd-components/components/Layout/CustomPageHeader';
import { CustomSidebar, SidebarMenuItem } from 'sgn-antd-components/components/Layout/CustomSidebar';
import { CustomTable, createActionColumn, createStatusColumn } from 'sgn-antd-components/components/Table/CustomTable';
import { CustomModal, ConfirmModal, DeleteConfirmModal } from 'sgn-antd-components/components/Feedback/CustomModal';
import { CustomNotification, useNotification } from 'sgn-antd-components/components/Feedback/CustomNotification';

// Sample data
const sampleProducts = [
  { id: '1', name: 'iPhone 15 Pro', category: 'โทรศัพท์', price: 48900, stock: 25, status: 'active' },
  { id: '2', name: 'MacBook Pro 14"', category: 'คอมพิวเตอร์', price: 79900, stock: 10, status: 'active' },
  { id: '3', name: 'AirPods Pro', category: 'หูฟัง', price: 8990, stock: 0, status: 'out_of_stock' },
  { id: '4', name: 'iPad Air', category: 'แท็บเล็ต', price: 24900, stock: 15, status: 'active' },
  { id: '5', name: 'Apple Watch', category: 'นาฬิกา', price: 15900, stock: 5, status: 'low_stock' },
];

// Menu items
const menuItems: SidebarMenuItem[] = [
  { key: 'dashboard', label: 'แดชบอร์ด', icon: <DashboardOutlined /> },
  { 
    key: 'products', 
    label: 'สินค้า', 
    icon: <ShoppingOutlined />,
    children: [
      { key: 'products-list', label: 'รายการสินค้า' },
      { key: 'products-add', label: 'เพิ่มสินค้า' },
    ],
  },
  { key: 'customers', label: 'ลูกค้า', icon: <UserOutlined /> },
  { key: 'settings', label: 'ตั้งค่า', icon: <SettingOutlined /> },
];

// Table columns
const tableColumns = [
  { key: 'name', title: 'ชื่อสินค้า', dataIndex: 'name', sortable: true },
  { key: 'category', title: 'หมวดหมู่', dataIndex: 'category' },
  {
    key: 'price',
    title: 'ราคา',
    dataIndex: 'price',
    sortable: true,
    align: 'right' as const,
    render: (price: number) => `฿${price.toLocaleString()}`,
  },
  { key: 'stock', title: 'สต็อก', dataIndex: 'stock', align: 'center' as const },
  createStatusColumn('status', 'สถานะ', [
    { value: 'active', label: 'พร้อมขาย', color: 'green' },
    { value: 'low_stock', label: 'ใกล้หมด', color: 'orange' },
    { value: 'out_of_stock', label: 'หมด', color: 'red' },
  ]),
];

// Main App Content
function AppContent() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { success, toast } = useNotification();

  const handleSave = () => {
    toast.loading('กำลังบันทึก...');
    setTimeout(() => {
      success({ message: 'บันทึกสำเร็จ!', description: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว' });
    }, 1500);
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <CustomSidebar
        items={menuItems}
        selectedKey={selectedMenu}
        openKeys={openKeys}
        onSelect={setSelectedMenu}
        onOpenChange={setOpenKeys}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        user={{
          name: 'สมชาย ใจดี',
          role: 'ผู้ดูแลระบบ',
        }}
        onLogout={() => toast.info('ออกจากระบบ')}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Page Header */}
        <CustomPageHeader
          title="แดชบอร์ด"
          subtitle="ภาพรวมระบบจัดการสินค้า"
          breadcrumbs={[{ title: 'แดชบอร์ด' }]}
          actions={
            <>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpen(true)}>
                เพิ่มสินค้า
              </Button>
            </>
          }
        />

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="ยอดขายวันนี้"
              value="฿125,000"
              icon={<ShoppingOutlined />}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatsCard
              title="ผู้ใช้ใหม่"
              value="1,234"
              icon={<UserOutlined />}
              trend={{ value: 5.2, isPositive: true }}
            />
            <StatsCard
              title="สินค้าทั้งหมด"
              value="150"
              icon={<ShoppingOutlined />}
            />
            <StatsCard
              title="คำสั่งซื้อใหม่"
              value="89"
              icon={<DashboardOutlined />}
              trend={{ value: 3.1, isPositive: false }}
            />
          </div>

          {/* Form Demo */}
          <CustomCard title="ทดสอบ Form Components" subtitle="ตัวอย่าง Input, Select, DatePicker">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CustomInput
                label="ชื่อสินค้า"
                placeholder="กรอกชื่อสินค้า"
                required
              />
              <CustomPasswordInput
                label="รหัสผ่าน"
                placeholder="กรอกรหัสผ่าน"
              />
              <CustomSearchInput placeholder="ค้นหา..." />
              <CustomSelect
                label="หมวดหมู่"
                options={[
                  { label: 'อิเล็กทรอนิกส์', value: 'electronics' },
                  { label: 'เสื้อผ้า', value: 'clothing' },
                  { label: 'อาหาร', value: 'food' },
                ]}
                showSearch
              />
              <CustomStatusSelect
                label="สถานะ"
                options={[
                  { label: 'พร้อมขาย', value: 'active', color: '#52c41a' },
                  { label: 'หมด', value: 'out_of_stock', color: '#ff4d4f' },
                ]}
              />
              <CustomDatePicker
                label="วันที่"
                showPresets
              />
              <div className="lg:col-span-2">
                <CustomRangePicker
                  label="ช่วงวันที่"
                  showPresets
                />
              </div>
            </div>
          </CustomCard>

          {/* Table Demo */}
          <CustomTable
            title="รายการสินค้า"
            columns={tableColumns}
            dataSource={sampleProducts}
            rowKey="id"
            searchable
            searchFields={['name', 'category']}
            selectable
            showRefresh
            onRefresh={() => toast.success('รีเฟรชข้อมูลแล้ว')}
            showExport
            onExport={() => toast.info('กำลัง export...')}
            toolbarActions={
              <Button danger onClick={() => setDeleteModalOpen(true)}>
                ลบที่เลือก
              </Button>
            }
          />
        </div>
      </div>

      {/* Modal Demo */}
      <CustomModal
        title="เพิ่มสินค้าใหม่"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSave}
        confirmText="บันทึก"
      >
        <div className="space-y-4">
          <CustomInput label="ชื่อสินค้า" placeholder="กรอกชื่อสินค้า" required />
          <CustomSelect
            label="หมวดหมู่"
            options={[
              { label: 'อิเล็กทรอนิกส์', value: 'electronics' },
              { label: 'เสื้อผ้า', value: 'clothing' },
            ]}
          />
          <CustomInput label="ราคา" placeholder="0.00" type="number" />
        </div>
      </CustomModal>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        itemName="รายการที่เลือก"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          toast.success('ลบสำเร็จ');
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

// App with Notification Provider
function App() {
  return (
    <CustomNotification>
      <AppContent />
    </CustomNotification>
  );
}

export default App;

