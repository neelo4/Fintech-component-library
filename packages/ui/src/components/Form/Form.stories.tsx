import type { Meta, StoryObj } from "@storybook/react";
import { Form, FormFieldConfig } from "./Form";

const sampleFields: FormFieldConfig[] = [
  {
    name: "company",
    label: "Company name",
    type: "text",
    placeholder: "Acme Inc.",
    required: true,
    helperText: "Use the legal entity name.",
  },
  {
    name: "email",
    label: "Work email",
    type: "email",
    placeholder: "team@acme.com",
    required: true,
  },
  {
    name: "industry",
    label: "Industry",
    type: "select",
    placeholder: "Select industry",
    options: [
      { label: "Fintech", value: "fintech" },
      { label: "Cloud", value: "cloud" },
      { label: "Healthcare", value: "healthcare" },
    ],
    required: true,
  },
  {
    name: "message",
    label: "Project overview",
    type: "textarea",
    placeholder: "Share context for this request",
  },
  {
    name: "terms",
    label: "I agree to the terms of service",
    type: "checkbox",
    required: true,
  },
];

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  args: {
    fields: sampleFields,
    submitLabel: "Create workspace",
    onSubmit: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Basic: Story = {};

export const Horizontal: Story = {
  args: {
    layout: "horizontal",
  },
};

export const WithCustomValidation: Story = {
  args: {
    fields: sampleFields.map(field =>
      field.name === "email"
        ? {
            ...field,
            validate: value =>
              typeof value === "string" && !value.endsWith("@fintech.dev")
                ? "Use your fintech.dev account."
                : undefined,
          }
        : field
    ),
  },
};

export const CustomFieldRenderer: Story = {
  args: {
    fields: [
      sampleFields[0],
      {
        name: "budget",
        label: "Monthly budget",
        type: "number",
        helperText: "Choose a value between 5k and 50k USD.",
        component: ({ value, onChange, id }) => (
          <div className="flex flex-col gap-3">
            <input
              id={id}
              type="range"
              min={5000}
              max={50000}
              step={1000}
              value={Number(value) || 5000}
              onChange={event => onChange(event.target.value)}
              className="w-full accent-primary"
            />
            <div className="text-sm font-medium text-slate-700">
              {"$" + (Number(value) || 5000).toLocaleString()}
            </div>
          </div>
        ),
      },
      sampleFields[sampleFields.length - 1],
    ],
  },
};
