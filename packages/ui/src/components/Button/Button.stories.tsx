import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { ButtonThemeProvider } from "./buttonTheme";

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    size: "md",
    disabled: false,
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "neutral"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    onClick: { action: "clicked" },
    iconLeft: { control: false },
    iconRight: { control: false },
    as: { control: false },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Neutral Button",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    "aria-label": "Save",
    children: "💾",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const WithIcons: Story = {
  args: {
    children: "Continue",
    iconRight: <ArrowIcon />,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingText: "Syncing...",
  },
};

export const AsLink: Story = {
  args: {
    as: "a",
    href: "#",
    children: "Anchor Button",
  },
};

export const CustomTheme: Story = {
  render: (args) => (
    <ButtonThemeProvider
      value={{
        variants: {
          fintech: "bg-emerald-600 hover:bg-emerald-500 text-white",
        },
        sizes: {
          xl: "px-8 py-4 text-xl",
        },
      }}
    >
      <Button {...args} variant="fintech" size="xl" />
    </ButtonThemeProvider>
  ),
  args: {
    children: "Fintech Action",
  },
};
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="success">
        Success
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
      <Button {...args} variant="neutral">
        Neutral
      </Button>
    </div>
  ),
};
