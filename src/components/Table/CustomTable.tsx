import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Tag,
  Empty,
  Tooltip,
} from 'antd';
import type { TableProps, ColumnType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SettingOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { cn } from '../../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomTableColumn<T = any> extends Omit<ColumnType<T>, 'render'> {
  /** Column key */
  key: string;
  /** Column title */
  title: string;
  /** Data index */
  dataIndex: string | string[];
  /** Enable sorting */
  sortable?: boolean;
  /** Enable filtering */
  filterable?: boolean;
  /** Filter options */
  filters?: { text: string; value: string | number | boolean }[];
  /** Custom render function */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  /** Column width */
  width?: number | string;
  /** Fixed column */
  fixed?: 'left' | 'right';
  /** Hide column */
  hidden?: boolean;
  /** Ellipsis */
  ellipsis?: boolean;
  /** Align */
  align?: 'left' | 'center' | 'right';
}

export interface CustomTableProps<T extends object> extends Omit<TableProps<T>, 'columns'> {
  /** Table columns configuration */
  columns: CustomTableColumn<T>[];
  /** Data source */
  dataSource: T[];
  /** Row key */
  rowKey: keyof T | ((record: T) => string);
  /** Loading state */
  loading?: boolean;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedRowKeys?: React.Key[];
  /** On selection change */
  onSelectionChange?: (keys: React.Key[], rows: T[]) => void;
  /** Enable global search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Fields to search */
  searchFields?: (keyof T)[];
  /** On search */
  onSearch?: (value: string) => void;
  /** Show refresh button */
  showRefresh?: boolean;
  /** On refresh */
  onRefresh?: () => void;
  /** Show export button */
  showExport?: boolean;
  /** On export */
  onExport?: (data: T[]) => void;
  /** Export options */
  exportOptions?: MenuProps['items'];
  /** Custom toolbar actions */
  toolbarActions?: React.ReactNode;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Table title */
  title?: string;
  /** Custom class name */
  className?: string;
  /** Card style wrapper */
  cardStyle?: boolean;
  /** Empty text */
  emptyText?: string;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Scroll config */
  scroll?: { x?: number | string; y?: number | string };
}

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
export function CustomTable<T extends object>({
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
}: CustomTableProps<T>) {
  const [searchText, setSearchText] = useState('');
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<React.Key[]>([]);

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
    (value: string) => {
      setSearchText(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  // Handle selection change
  const handleSelectionChange = useCallback(
    (keys: React.Key[], rows: T[]) => {
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
        const column: ColumnType<T> = {
          ...col,
          sorter: col.sortable
            ? (a: T, b: T) => {
                const aVal = getNestedValue(a, col.dataIndex);
                const bVal = getNestedValue(b, col.dataIndex);
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                  return aVal.localeCompare(bVal);
                }
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                  return aVal - bVal;
                }
                return 0;
              }
            : undefined,
          filters: col.filterable ? col.filters : undefined,
          onFilter: col.filterable
            ? (value: React.Key | boolean, record: T) => {
                const recordValue = getNestedValue(record, col.dataIndex);
                return recordValue === value;
              }
            : undefined,
        };
        return column;
      });
  }, [columns]);

  // Row selection config
  const rowSelection = selectable
    ? {
        selectedRowKeys: currentSelectedKeys,
        onChange: handleSelectionChange,
        preserveSelectedRowKeys: true,
      }
    : undefined;

  // Pagination config
  const paginationConfig: TablePaginationConfig | false =
    pagination === false
      ? false
      : {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} จาก ${total} รายการ`,
          pageSizeOptions: ['10', '20', '50', '100'],
          ...pagination,
        };

  // Export dropdown menu
  const exportMenu: MenuProps = {
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
        rowKey={rowKey as string}
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
function getNestedValue<T>(obj: T, path: string | string[]): unknown {
  const keys = Array.isArray(path) ? path : [path];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return undefined;
    result = result[key];
  }
  return result;
}

// Action Column helper
interface ActionItem<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  danger?: boolean;
  disabled?: boolean | ((record: T) => boolean);
}

export function createActionColumn<T>(
  actions: ActionItem<T>[],
  title: string = 'จัดการ'
): CustomTableColumn<T> {
  return {
    key: 'actions',
    title,
    dataIndex: 'actions',
    width: 120,
    fixed: 'right',
    align: 'center',
    render: (_: unknown, record: T) => {
      const menuItems: MenuProps['items'] = actions.map((action) => ({
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
interface StatusConfig {
  value: string | number | boolean;
  label: string;
  color: string;
}

export function createStatusColumn<T>(
  dataIndex: string,
  title: string,
  statuses: StatusConfig[]
): CustomTableColumn<T> {
  return {
    key: dataIndex,
    title,
    dataIndex,
    filterable: true,
    filters: statuses.map((s) => ({ text: s.label, value: s.value })),
    render: (value: unknown) => {
      const status = statuses.find((s) => s.value === value);
      return status ? (
        <Tag color={status.color}>{status.label}</Tag>
      ) : (
        <Tag>{String(value)}</Tag>
      );
    },
  };
}

