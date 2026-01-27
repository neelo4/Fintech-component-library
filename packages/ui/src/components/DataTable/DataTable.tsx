import * as React from "react";
import { DataTableProps } from "./types";
import { useDataTable } from "./useDataTable";
import { Button } from "../Button";
import { cn } from "../../utils/cn";

const alignClassMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const DataTable = <T,>({
  data,
  columns,
  pageSizeOptions = [10, 25, 50],
  initialPageSize = pageSizeOptions[0] ?? 10,
  globalFilter,
  stickyHeader = true,
  className,
  emptyMessage = "No data to display.",
  renderToolbar,
  rowKey,
}: DataTableProps<T>) => {
  const table = useDataTable<T>({
    data,
    columns,
    initialPageSize,
    globalFilter,
  });

  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);
  const dragX = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (dragX.current == null) {
        dragX.current = event.clientX;
        return;
      }

      const delta = event.clientX - dragX.current;
      dragX.current = event.clientX;

      table.setColumnWidth(
        resizingColumn,
        (table.columnWidths[resizingColumn] ?? 0) + delta
      );
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      dragX.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, table]);

  const toolbar =
    renderToolbar?.({
      filterValue: table.filterValue,
      setFilterValue: table.setFilterValue,
    }) ?? (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Filter rows..."
          value={table.filterValue}
          onChange={event => table.setFilterValue(event.target.value)}
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
        />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          Showing {table.paginatedData.length} of {table.totalRows} rows
        </div>
      </div>
    );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {toolbar}
      <div className="relative">
        <div className="overflow-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full border-collapse" role="grid">
            <thead
              className={cn(
                "bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500",
                stickyHeader && "sticky top-0 z-10"
              )}
            >
              <tr>
                {columns.map(column => {
                  const isSorted = table.sort?.columnId === column.id;
                  const ariaSort = isSorted
                    ? table.sort?.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none";
                  const width = table.columnWidths[column.id];

                  return (
                    <th
                      key={column.id}
                      scope="col"
                      aria-sort={ariaSort}
                      style={
                        width
                          ? { width, minWidth: column.minWidth, maxWidth: column.maxWidth }
                          : {
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                            }
                      }
                      className={cn(
                        "group relative select-none border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600",
                        column.align ? alignClassMap[column.align] : "text-left",
                        column.sticky && "sticky left-0 bg-slate-50"
                      )}
                    >
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1 text-inherit",
                          column.sortable && "cursor-pointer"
                        )}
                        onClick={() => column.sortable && table.setSort(column.id)}
                        aria-label={
                          column.sortable
                            ? `Sort by ${column.id}`
                            : undefined
                        }
                      >
                        {column.header}
                        {column.sortable && (
                          <span className="text-xs text-slate-400">
                            {isSorted
                              ? table.sort?.direction === "asc"
                                ? "▲"
                                : "▼"
                              : "⇅"}
                          </span>
                        )}
                      </button>
                      <span
                        role="separator"
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize opacity-0 transition group-hover:opacity-100"
                        onMouseDown={() => setResizingColumn(column.id)}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white text-sm text-slate-700">
              {table.paginatedData.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-slate-500"
                    colSpan={columns.length}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowKey?.(row, rowIndex) ?? rowIndex}
                    className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/30"
                  >
                    {columns.map(column => {
                      const value =
                        typeof column.accessor === "function"
                          ? column.accessor(row)
                          : (row as Record<string, unknown>)[column.accessor as string];
                      return (
                        <td
                          key={column.id}
                          className={cn(
                            "px-4 py-3 align-middle",
                            column.align ? alignClassMap[column.align] : "text-left"
                          )}
                        >
                          {column.cell
                            ? column.cell({ value, row, rowIndex })
                            : String(value ?? "—")}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={table.pageSize}
            onChange={event => table.setPageSize(Number(event.target.value))}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={table.previousPage}
            disabled={table.pageIndex === 0}
          >
            Previous
          </Button>
          <span className="px-2 text-xs font-medium">
            Page {table.pageIndex + 1} of {table.pageCount}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={table.nextPage}
            disabled={table.pageIndex + 1 >= table.pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

DataTable.displayName = "DataTable";
