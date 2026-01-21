import type { StorybookConfig } from "@storybook/react";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  stories: ["../src/**/*.stories.@(ts|tsx)", "../src/docs/**/*.mdx"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],

  framework: "@storybook/react-vite",
};

export default config;
