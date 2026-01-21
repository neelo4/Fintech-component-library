import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    a11y: {
      element: "#root",
      manual: false,

      // 'todo'  → show issues in UI
      // 'error' → fail CI
      // 'off'   → disable checks
      test: "todo",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
