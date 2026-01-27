import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import { DataTableColumn } from "./types";

type Customer = {
  id: string;
  name: string;
  region: string;
  plan: string;
  usage: number;
  mrr: number;
  status: "active" | "trialing" | "churned";
};

const customers: Customer[] = Array.from({ length: 42 }).map((_, index) => ({
  id: `cust-${index + 1}`,
  name: `Company ${index + 1}`,
  region: index % 2 === 0 ? "EMEA" : "US",
  plan: index % 3 === 0 ? "Enterprise" : index % 2 === 0 ? "Growth" : "Starter",
  usage: 50 + (index % 5) * 10,
  mrr: 5000 + index * 120,
  status: index % 4 === 0 ? "trialing" : index % 7 === 0 ? "churned" : "active",
}));

const columns: DataTableColumn<Customer>[] = [
  {
    id: "name",
    header: "Customer",
    accessor: "name",
    sortable: true,
    sticky: true,
    cell: ({ value, row }) => (
      <div>
        <p className="font-semibold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{row.region}</p>
      </div>
    ),
    minWidth: 200,
  },
  {
    id: "plan",
    header: "Plan",
    accessor: "plan",
    sortable: true,
  },
  {
    id: "usage",
    header: "Usage (GB)",
    accessor: "usage",
    sortable: true,
    align: "right",
  },
  {
    id: "mrr",
    header: "MRR",
    accessor: "mrr",
    sortable: true,
    align: "right",
    cell: ({ value }) => (
      <span className="font-medium">${Number(value).toLocaleString()}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    cell: ({ value }) => {
      const colorMap: Record<Customer["status"], string> = {
        active: "bg-emerald-100 text-emerald-700",
        trialing: "bg-blue-100 text-blue-700",
        churned: "bg-rose-100 text-rose-700",
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${colorMap[value as Customer["status"]]}`}
        >
          {value}
        </span>
      );
    },
  },
];

const meta: Meta<typeof DataTable<Customer>> = {
  title: "Components/DataTable",
  component: DataTable,
  args: {
    data: customers,
    columns,
    initialPageSize: 10,
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DataTable<Customer>>;

export const Default: Story = {};

export const CustomToolbar: Story = {
  args: {
    renderToolbar: ({ filterValue, setFilterValue }) => (
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search customers..."
          value={filterValue}
          onChange={event => setFilterValue(event.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
        />
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          onClick={() => setFilterValue("")}
        >
          Reset
        </button>
      </div>
    ),
  },
};
