import * as React from "react";
import {
  DataTableColumn,
  DataTableFilterFn,
  SortDirection,
  UseDataTableResult,
} from "./types";

type UseDataTableOptions<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  initialPageSize: number;
  globalFilter?: DataTableFilterFn<T>;
};

const defaultFilter = <T,>(row: T, filterValue: string) => {
  if (!filterValue) return true;
  const normalized = filterValue.toLowerCase();
  return Object.values(row ?? {}).some(value =>
    String(value ?? "")
      .toLowerCase()
      .includes(normalized)
  );
};

export function useDataTable<T>({
  data,
  columns,
  initialPageSize,
  globalFilter,
}: UseDataTableOptions<T>): UseDataTableResult<T> {
  const [sort, setSortState] = React.useState<
    UseDataTableResult<T>["sort"]
  >(undefined);
  const [filterValue, setFilterValue] = React.useState("");
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSizeState] = React.useState(initialPageSize);
  const [columnWidths, setColumnWidths] = React.useState<
    Record<string, number | undefined>
  >(() =>
    columns.reduce((acc, column) => {
      acc[column.id] = column.width;
      return acc;
    }, {} as Record<string, number | undefined>)
  );

  const filterFn = globalFilter ?? defaultFilter<T>;

  const filteredData = React.useMemo(() => {
    if (!filterValue) return data;
    return data.filter(row => filterFn(row, filterValue));
  }, [data, filterFn, filterValue]);

  const sortedData = React.useMemo(() => {
    if (!sort) return filteredData;
    const column = columns.find(col => col.id === sort.columnId);
    if (!column) return filteredData;

    const accessor = column.accessor;
    const directionMultiplier = sort.direction === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const getValue = (row: T) => {
        if (typeof accessor === "function") {
          return accessor(row);
        }
        return (row as Record<string, unknown>)[accessor as string];
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (valueA === valueB) return 0;
      if (valueA == null) return -1 * directionMultiplier;
      if (valueB == null) return 1 * directionMultiplier;

      return valueA > valueB ? directionMultiplier : -directionMultiplier;
    });
  }, [filteredData, sort, columns]);

  const totalRows = sortedData.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));

  const paginatedData = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [pageIndex, pageSize, sortedData]);

  const setSort = React.useCallback(
    (columnId: string) => {
      setSortState(prev => {
        if (prev?.columnId === columnId) {
          const nextDirection: SortDirection =
            prev.direction === "asc" ? "desc" : "asc";
          return { columnId, direction: nextDirection };
        }
        return { columnId, direction: "asc" };
      });
    },
    []
  );

  const setPageSize = React.useCallback((size: number) => {
    setPageSizeState(size);
    setPageIndex(0);
  }, []);

  const setColumnWidth = React.useCallback((columnId: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: Math.max(width, 64),
    }));
  }, []);

  const nextPage = React.useCallback(() => {
    setPageIndex(prev => Math.min(prev + 1, pageCount - 1));
  }, [pageCount]);

  const previousPage = React.useCallback(() => {
    setPageIndex(prev => Math.max(prev - 1, 0));
  }, []);

  return {
    sort,
    filterValue,
    pageIndex,
    pageSize,
    columnWidths,
    paginatedData,
    totalRows,
    pageCount,
    setSort,
    setFilterValue: value => {
      setFilterValue(value);
      setPageIndex(0);
    },
    setPageIndex,
    setPageSize,
    setColumnWidth,
    nextPage,
    previousPage,
  };
}
