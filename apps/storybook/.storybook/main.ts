import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  stories: [
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../../../packages/ui/src/docs/**/*.mdx"
  ],
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
