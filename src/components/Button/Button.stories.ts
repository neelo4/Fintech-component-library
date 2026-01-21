import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
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
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: {
    "aria-label": "Save",
    children: "💾",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
