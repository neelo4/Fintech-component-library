import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Form, FormFieldConfig } from "./Form";

const baseFields: FormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validate: value =>
      typeof value === "string" && !value.includes("@") ? "Email must be valid." : undefined,
  },
  {
    name: "terms",
    label: "Accept terms",
    type: "checkbox",
    required: true,
  },
];

describe("Form", () => {
  it("renders fields and submits values", async () => {
    const handleSubmit = jest.fn();

    render(<Form fields={baseFields} onSubmit={handleSubmit} submitLabel="Save" />);

    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.click(screen.getByLabelText("Accept terms"));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          name: "Jane",
          email: "jane@example.com",
          terms: true,
        },
        expect.any(Object)
      )
    );
  });

  it("shows validation errors", async () => {
    const handleSubmit = jest.fn();

    render(<Form fields={baseFields} onSubmit={handleSubmit} submitLabel="Save" />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findAllByText(/is required/)).toHaveLength(2);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("applies custom validation", async () => {
    render(<Form fields={baseFields} onSubmit={jest.fn()} submitLabel="Save" />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText("Email must be valid.")).toBeInTheDocument();
  });

  it("resets values via helper", async () => {
    const handleSubmit = jest.fn((_, helpers) => helpers.reset());

    render(<Form fields={baseFields} onSubmit={handleSubmit} submitLabel="Save" />);

    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.click(screen.getByLabelText("Accept terms"));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

    expect(screen.getByLabelText(/^Name/)).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Accept terms")).not.toBeChecked();
  });
});
