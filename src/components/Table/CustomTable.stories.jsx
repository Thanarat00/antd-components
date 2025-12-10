import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CustomTable, createActionColumn, createStatusColumn } from './CustomTable';
import { Button, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const meta= {
  title: 'Table/CustomTable',
  component: {
    layout: 'fullscreen' },
  tags: ,
};

export default meta;



const sampleData= [
  { id: '1', name: 'iPhone 15 Pro', category: 'โทรศัพท์', price: 48900, stock: 25, status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'MacBook Pro 14"', category: 'คอมพิวเตอร์', price: 79900, stock: 10, status: 'active', createdAt: '2024-01-14' },
  { id: '3', name: 'AirPods Pro', category: 'หูฟัง', price: 8990, stock: 0, status: 'out_of_stock', createdAt: '2024-01-13' },
  { id: '4', name: 'iPad Air', category: 'แท็บเล็ต', price: 24900, stock: 15, status: 'active', createdAt: '2024-01-12' },
  { id: '5', name: 'Apple Watch', category: 'นาฬิกา', price: 15900, stock: 5, status: 'low_stock', createdAt: '2024-01-11' },
  { id: '6', name: 'Samsung Galaxy S24', category: 'โทรศัพท์', price: 39900, stock: 30, status: 'active', createdAt: '2024-01-10' },
  { id: '7', name: 'Sony WH-1000XM5', category: 'หูฟัง', price: 12900, stock: 8, status: 'active', createdAt: '2024-01-09' },
  { id: '8', name: 'Dell XPS 15', category: 'คอมพิวเตอร์', price: 59900, stock: 0, status: 'discontinued', createdAt: '2024-01-08' },
];

const columns = [
  {
    key: 'name',
    title: 'ชื่อสินค้า',
    dataIndex: 'name',
    sortable},
  {
    key: 'category',
    title: 'หมวดหมู่',
    dataIndex: 'category',
    filterable: [
      { text: 'โทรศัพท์', value: 'โทรศัพท์' },
      { text: 'คอมพิวเตอร์', value: 'คอมพิวเตอร์' },
      { text: 'หูฟัง', value: 'หูฟัง' },
      { text: 'แท็บเล็ต', value: 'แท็บเล็ต' },
      { text: 'นาฬิกา', value: 'นาฬิกา' },
    ],
  },
  {
    key: 'price',
    title: 'ราคา',
    dataIndex: 'price',
    sortable: 'right': (price) => `฿${price.toLocaleString()}`,
  },
  {
    key: 'stock',
    title: 'สต็อก',
    dataIndex: 'stock',
    sortable: 'center'},
  createStatusColumn<Product>('status', 'สถานะ', [
    { value: 'active', label: 'พร้อมขาย', color: 'green' },
    { value: 'low_stock', label: 'สินค้าใกล้หมด', color: 'orange' },
    { value: 'out_of_stock', label: 'หมด', color: 'red' },
    { value: 'discontinued', label: 'เลิกขาย', color: 'default' },
  ]),
];

const columnsWithActions = [
  ...columns,
  createActionColumn<Product>([
    { key: 'view', label: 'ดูรายละเอียด', icon: <EyeOutlined />, onClick: (record) => console.log('View', record) },
    { key: 'edit', label: 'แก้ไข', icon: <EditOutlined />, onClick: (record) => console.log('Edit', record) },
    { key: 'delete', label: 'ลบ', icon: <DeleteOutlined />, danger: (record) => console.log('Delete', record) },
  ]),
];

export const Default= {
  render: () => (
    <div className="p-4">
      <CustomTable
        columns={columns}
        dataSource={sampleData}
        rowKey="id"
      />
    </div>
  ),
};

export const WithTitle= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={sampleData}
        rowKey="id"
      />
    </div>
  ),
};

export const WithSearch= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={sampleData}
        rowKey="id"
        searchable
        searchFields={['name', 'category']}
        searchPlaceholder="ค้นหาชื่อสินค้าหรือหมวดหมู่..."
      />
    </div>
  ),
};

export const WithSelection= {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    
    return (
      <div className="p-4">
        <CustomTable
          title="รายการสินค้า"
          columns={columns}
          dataSource={sampleData}
          rowKey="id"
          selectable
          selectedRowKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(keys)}
          toolbarActions={
            selectedKeys.length > 0 && (
              <Button danger>ลบที่เลือก ({selectedKeys.length})</Button>
            )
          }
        />
      </div>
    );
  },
};

export const WithActions= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columnsWithActions}
        dataSource={sampleData}
        rowKey="id"
        scroll={{ x: 1000 }}
      />
    </div>
  ),
};

export const WithToolbar= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={sampleData}
        rowKey="id"
        searchable
        searchFields={['name', 'category']}
        showRefresh
        onRefresh={() => console.log('Refresh')}
        showExport
        onExport={(data) => console.log('Export', data)}
        toolbarActions={
          <Button type="primary" icon={<PlusOutlined />}>
            เพิ่มสินค้า
          </Button>
        }
      />
    </div>
  ),
};

export const Loading= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={[]}
        rowKey="id"
        loading
        showRefresh
      />
    </div>
  ),
};

export const Empty= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={[]}
        rowKey="id"
        emptyText="ยังไม่มีสินค้าในระบบ"
        toolbarActions={
          <Button type="primary" icon={<PlusOutlined />}>
            เพิ่มสินค้าใหม่
          </Button>
        }
      />
    </div>
  ),
};

export const WithoutCard= {
  render: () => (
    <div className="p-4 bg-white">
      <CustomTable
        columns={columns}
        dataSource={sampleData}
        rowKey="id"
        cardStyle={false}
        showToolbar={false}
      />
    </div>
  ),
};

export const CustomPagination= {
  render: () => (
    <div className="p-4">
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={sampleData}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger}}
      />
    </div>
  ),
};

export const StickyHeader= {
  render: () => (
    <div className="p-4" style={{ height: 400 }}>
      <CustomTable
        title="รายการสินค้า"
        columns={columns}
        dataSource={[...sampleData, ...sampleData, ...sampleData]}
        rowKey={(record, index) => `${record.id}-${index}`}
        stickyHeader
        scroll={{ y: 300 }}
        pagination={false}
      />
    </div>
  ),
};

