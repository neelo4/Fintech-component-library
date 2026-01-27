import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DataTable } from "./DataTable";
import { DataTableColumn } from "./types";

type Row = {
  id: string;
  name: string;
  amount: number;
};

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "amount", header: "Amount", accessor: "amount", sortable: true },
];

const data: Row[] = [
  { id: "1", name: "Alpha", amount: 100 },
  { id: "2", name: "Beta", amount: 50 },
  { id: "3", name: "Gamma", amount: 75 },
];

describe("DataTable", () => {
  it("sorts rows when clicking headers", () => {
    render(<DataTable data={data} columns={columns} />);

    const getFirstAmount = () =>
      screen.getAllByRole("cell", { name: /[0-9]+/ })[0].textContent;

    expect(getFirstAmount()).toBe("100");

    fireEvent.click(screen.getByRole("button", { name: /sort by amount/i }));
    expect(getFirstAmount()).toBe("50");

    fireEvent.click(screen.getByRole("button", { name: /sort by amount/i }));
    expect(getFirstAmount()).toBe("100");
  });

  it("filters rows via search input", () => {
    render(<DataTable data={data} columns={columns} />);

    const filterInput = screen.getByPlaceholderText(/filter rows/i);
    fireEvent.change(filterInput, { target: { value: "Beta" } });

    expect(screen.getAllByRole("row")).toHaveLength(2); // header + filtered row
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
