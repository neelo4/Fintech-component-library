import * as React from "react";

export type SortDirection = "asc" | "desc";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode | string | number | boolean);
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sticky?: boolean;
  align?: "left" | "center" | "right";
  cell?: (args: { value: any; row: T; rowIndex: number }) => React.ReactNode;
};

export type DataTableFilterFn<T> = (row: T, filterValue: string) => boolean;

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  globalFilter?: DataTableFilterFn<T>;
  stickyHeader?: boolean;
  className?: string;
  emptyMessage?: React.ReactNode;
  renderToolbar?: (controls: {
    filterValue: string;
    setFilterValue: (value: string) => void;
  }) => React.ReactNode;
  rowKey?: (row: T, index: number) => React.Key;
};

export type DataTableState<T> = {
  sort?: {
    columnId: string;
    direction: SortDirection;
  };
  filterValue: string;
  pageIndex: number;
  pageSize: number;
  columnWidths: Record<string, number | undefined>;
  paginatedData: T[];
  totalRows: number;
  pageCount: number;
};

export type DataTableActions<T> = {
  setSort: (columnId: string) => void;
  setFilterValue: (value: string) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setColumnWidth: (columnId: string, width: number) => void;
};

export type UseDataTableResult<T> = DataTableState<T> & DataTableActions<T>;
