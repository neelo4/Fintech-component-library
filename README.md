## Button Flexibility Guide

This repository now ships the Button component as a fully themeable, polymorphic primitive that can adapt to many product verticals (fintech, cloud, internal tools, etc.). Below is a step-by-step summary of the changes and how to apply them in your own app.

### Step 1 – Introduce a Theme Layer
- `packages/ui/src/components/Button/buttonTheme.tsx` exports `ButtonThemeProvider`, `useButtonTheme`, and `defaultButtonTheme`.
- Every button reads its class structure (base, focus, variants, sizes) from context, so product teams can override tokens without rewriting the component.

```tsx
import { ButtonThemeProvider } from "fintech-component-library";

<ButtonThemeProvider
  value={{
    variants: { fintech: "bg-emerald-600 hover:bg-emerald-500 text-white" },
    sizes: { xl: "px-8 py-4 text-xl" },
  }}
>
  <Button variant="fintech" size="xl">Review transfer</Button>
</ButtonThemeProvider>
```

### Step 2 – Expand the Button API
- `packages/ui/src/components/Button/Button.tsx` now supports:
  - `as` prop for polymorphic rendering (e.g., `<Button as="a" href="/billing" />`).
  - Icon slots (`iconLeft`, `iconRight`), loading state (`isLoading`, `loadingText`), and `fullWidth`.
  - Custom variants/sizes provided via the theme layer.
- Icons and spinners are accessibility-friendly (aria attributes, busy state).

### Step 3 – Demonstrate & Test
- Stories (`Button.stories.tsx`) showcase icons, loading, custom themes, and the polymorphic anchor example.
- Tests (`Button.test.tsx`) cover the new behaviors plus the theme provider override to guard against regressions.

### Step 4 – Use & Iterate
- Keep Tailwind tokens inside `packages/ui/src/index.css` or inside your host app; the theme layer simply maps tokens to button variants.
- To add brand-specific styles, extend `variants`/`sizes` via the provider instead of forking the component.
- When adding new requirements (split buttons, destructive confirmations, etc.), treat this Button as the foundational primitive so other teams inherit accessibility and theme guardrails automatically.

### Local Commands
- `npm run dev:storybook` – develop components in isolation.
- `npm test` – verify Jest + a11y coverage.
- `npm run build-storybook` – ensure deploy builds pull the themed styles correctly.
