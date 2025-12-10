import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Tag,
  Empty,
  Tooltip } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SettingOutlined,
  FilterOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';


/**
 * CustomTable - Enhanced Ant Design Table with built-in features
 *
 * Features:
 * - Built-in pagination, sorting, filtering
 * - Global search
 * - Row selection
 * - Export functionality
 * - Toolbar with actions
 * - Responsive design
 */
export function CustomTable({
  columns,
  dataSource,
  rowKey,
  loading = false,
  selectable = false,
  selectedRowKeys,
  onSelectionChange,
  searchable = false,
  searchPlaceholder = 'ค้นหา...',
  searchFields,
  onSearch,
  showRefresh = false,
  onRefresh,
  showExport = false,
  onExport,
  exportOptions,
  toolbarActions,
  showToolbar = true,
  title,
  className,
  cardStyle = true,
  emptyText = 'ไม่พบข้อมูล',
  stickyHeader = false,
  scroll,
  pagination,
  ...props
}) {
  const [searchText, setSearchText] = useState('');
  const [internalSelectedKeys, setInternalSelectedKeys] = useState([]);

  // Use controlled or internal selected keys
  const currentSelectedKeys = selectedRowKeys ?? internalSelectedKeys;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchText || !searchFields || searchFields.length === 0) {
      return dataSource;
    }

    const lowerSearch = searchText.toLowerCase();
    return dataSource.filter((record) =>
      searchFields.some((field) => {
        const value = record[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      })
    );
  }, [dataSource, searchText, searchFields]);

  // Handle search
  const handleSearch = useCallback(
    (value) => {
      setSearchText(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  // Handle selection change
  const handleSelectionChange = useCallback(
    (keys, rows) => {
      setInternalSelectedKeys(keys);
      onSelectionChange?.(keys, rows);
    },
    [onSelectionChange]
  );

  // Handle export
  const handleExport = useCallback(() => {
    onExport?.(filteredData);
  }, [onExport, filteredData]);

  // Transform columns
  const tableColumns = useMemo(() => {
    return columns
      .filter((col) => !col.hidden)
      .map((col) => {
        const column = {
          ...col,
        };
        
        if (col.sortable) {
          column.sorter = (a, b) => {
            const aVal = getNestedValue(a, col.dataIndex);
            const bVal = getNestedValue(b, col.dataIndex);
            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return aVal.localeCompare(bVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return aVal - bVal;
            }
            return 0;
          };
        }
        
        if (col.filterable && col.filters) {
          column.filters = col.filters;
          column.onFilter = (value, record) => {
            const recordValue = getNestedValue(record, col.dataIndex);
            return recordValue === value;
          };
        }
        
        return column;
      });
  }, [columns]);

  // Row selection config
  const rowSelection = selectable
    ? {
        selectedRowKeys: currentSelectedKeys,
        onChange: handleSelectionChange,
      }
    : undefined;

  // Pagination config
  const paginationConfig =
    pagination === false
      ? false
      : {
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          ...pagination,
        };

  // Export dropdown menu
  const exportMenu= {
    items: exportOptions || [
      { key: 'excel', label: 'Export to Excel' },
      { key: 'csv', label: 'Export to CSV' },
      { key: 'pdf', label: 'Export to PDF' },
    ],
    onClick: () => handleExport(),
  };

  return (
    <div
      className={cn(
        cardStyle && 'bg-white rounded-antd shadow-antd',
        className
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left side - Title and Search */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-800 m-0 flex-shrink-0">
                  {title}
                </h3>
              )}
              {searchable && (
                <Input
                  placeholder={searchPlaceholder}
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                  className="max-w-xs"
                />
              )}
              {selectable && currentSelectedKeys.length > 0 && (
                <Tag color="blue">
                  เลือก {currentSelectedKeys.length} รายการ
                </Tag>
              )}
            </div>

            {/* Right side - Actions */}
            <Space className="flex-shrink-0">
              {toolbarActions}
              {showRefresh && (
                <Tooltip title="รีเฟรช">
                  <Button
                    icon={<ReloadOutlined spin={loading} />}
                    onClick={onRefresh}
                  />
                </Tooltip>
              )}
              {showExport && (
                <Dropdown menu={exportMenu} trigger={['click']}>
                  <Button icon={<DownloadOutlined />}>Export</Button>
                </Dropdown>
              )}
            </Space>
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        columns={tableColumns}
        dataSource={filteredData}
        rowKey={rowKey}
        loading={loading}
        rowSelection={rowSelection}
        pagination={paginationConfig}
        scroll={scroll}
        sticky={stickyHeader}
        locale={{
          emptyText: <Empty description={emptyText} />,
        }}
        className="sgn-table"
        {...props}
      />
    </div>
  );
}

CustomTable.displayName = 'CustomTable';

// Utility function to get nested value
function getNestedValue(obj, path) {
  const keys = Array.isArray(path) ? path : [path];
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return undefined;
    result = result[key];
  }
  return result;
}

// Action Column helper
export function createActionColumn(
  actions,
  title = 'จัดการ'
) {
  return {
    key: 'actions',
    title,
    dataIndex: 'actions',
    width: 120,
    fixed: 'right',
    align: 'center',
    render: (_, record) => {
      const menuItems = actions.map((action) => ({
        key: action.key,
        label: action.label,
        icon: action.icon,
        danger: action.danger,
        disabled:
          typeof action.disabled === 'function'
            ? action.disabled(record)
            : action.disabled,
        onClick: () => action.onClick(record),
      }));

      return (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button type="text" icon={<SettingOutlined />} />
        </Dropdown>
      );
    },
  };
}

// Status Column helper
export function createStatusColumn(
  dataIndex,
  statuses,
  key = 'status'
) {
  return {
    key,
    title: 'สถานะ',
    dataIndex,
    filters: statuses.map((s) => ({ text: s.label, value: s.value })),
    render: (value) => {
      const status = statuses.find((s) => s.value === value);
      return status ? (
        <Tag color={status.color}>{status.label}</Tag>
      ) : (
        <Tag>{String(value)}</Tag>
      );
    },
  };
}

