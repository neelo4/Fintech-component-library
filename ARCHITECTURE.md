## Component Library Architecture Guide

This document breaks down how the monorepo is organized, why each piece exists, and how everything works together. It is written so you can explain the system to an interviewer or deepen your own understanding of the foundations you're building.

---

### 1. Goals and Philosophy

1. **Reusable building blocks** – Expose React components (currently Button + Form) that can be consumed in any product without copy/paste.
2. **Type-safe APIs** – Everything is implemented in TypeScript so consumers get autocomplete, linting, and compile-time safety.
3. **Story-driven development** – Storybook provides interactive documentation and doubles as the deployment artifact for Vercel.
4. **Automated releases** – Changesets + npm workspaces manage versioning and publishing, so shipping a new component is predictable.
5. **Future theming** – The architecture is ready for finance/cloud themes by using providers, tokens, and Storybook stories grouped by vertical.

---

### 2. Repository Layout

```
/apps
  /storybook         → Standalone Storybook app (development + Vercel deploy)
/packages
  /ui                → Publishable component library
.changeset           → Release metadata managed by Changesets
.github/workflows    → CI pipeline (lint/test/build/storybook/publish)
package.json         → npm workspace root + shared scripts
tsconfig.base.json   → Shared TypeScript compiler options
tsconfig.json        → Project references pointing to the workspace packages
```

- **apps/storybook** – Depends on `fintech-component-library`, renders stories, and builds `storybook-static` for Vercel. It has its own `package.json`, `tsconfig`, and `.storybook` configuration.
- **packages/ui** – The actual npm package (`fintech-component-library`). Contains source code, tests, styling pipeline, build/test configs, and exports.

---

### 3. Tooling Stack

| Tool | Role |
| --- | --- |
| **React + TypeScript** | Component implementation with strong typing. |
| **Vite** | Library bundler (ESM + UMD outputs) and test runner configuration for Storybook/Vitest integration. |
| **Storybook** | Component playground + documentation, deployed to Vercel via `npm run build-storybook`. |
| **Jest** | Unit + accessibility tests (uses `@testing-library/react` and `jest-axe`). |
| **Tailwind CSS / PostCSS** | Utility-first styling. PostCSS config lives in the package to keep bundler warnings away from the monorepo root. |
| **Changesets** | Versioning + changelog automation (`npx changeset` → `npm run version-packages`). |
| **GitHub Actions** | Runs install/test/build/storybook, checks links, then publishes to npm when on `main`. |
| **Vercel** | Hosts the Storybook build (serves as the public documentation site). |

---

### 4. Package Anatomy (`packages/ui`)

```
src/
  index.ts                 → Exports and CSS import entrypoint
  index.css                → Base styles + CSS variables
  components/
    Button/
      Button.tsx           → Themeable polymorphic button
      Button.stories.tsx   → Storybook demos
      Button.test.tsx      → Jest tests
      buttonTheme.tsx      → Context/provider for button tokens
    Form/
      Form.tsx             → Schema-driven form component
      Form.stories.tsx
      Form.test.tsx
    DataTable/
      DataTable.tsx        → Presentational layer
      DataTable.stories.tsx
      DataTable.test.tsx
      useDataTable.ts      → Headless hook
      types.ts
configs (tsconfig, tailwind, postcss, jest config, etc.)
```

- Components import the shared CSS at the package entry so consumers get the required tokens automatically.
- Tests live next to components for easy maintenance and run with `npm test -w fintech-component-library`.
- Stories sit alongside components so Storybook can import them via relative paths when running inside `apps/storybook`.

---

### 5. Storybook App (`apps/storybook`)

- **`.storybook/main.ts`** – Points to component stories inside `packages/ui`, defines addons (Chromatic, a11y, docs, onboarding, Vitest).
- **`.storybook/preview.ts`** – Imports `packages/ui/src/index.css` so stories render with the library’s styles.
- **`public/`** – Static assets used by docs (icons, illustrations).
- **`package.json`** – Depends on the library (`"fintech-component-library": "^<current version>"`) and exposes scripts for `dev` and `build-storybook`.
- Storybook uses the same Tailwind pipeline by re-exporting the package’s PostCSS config (`apps/storybook/postcss.config.js`).

---

### 6. Build & Release Flow

1. **Develop** – Run `npm run dev:storybook` to iterate on components via Storybook.
2. **Test** – Execute `npm test` (runs Jest in the `packages/ui` workspace).
3. **Build** – `npm run build` compiles the library (Vite outputs `dist/`).
4. **Document** – `npm run build-storybook` produces `storybook-static` for Vercel.
5. **Version** – `npx changeset` → `npm run version-packages` updates versions + changelogs.
6. **Publish** – `npm run release` publishes `fintech-component-library` to npm, while CI deploys Storybook to Vercel.

Everything is orchestrated from the root `package.json` via npm workspaces so you only run commands once and they delegate to the correct package.

---

### 7. Theming Readiness

- **Button** already demonstrates the theming pattern through `ButtonThemeProvider`, `useButtonTheme`, and customizable variants/sizes.
- **Form** is schema-driven and uses `Button` internally, so once the theme provider injects finance/cloud tokens, both components update automatically.
- Next steps:
  1. Define token files (`tokens/base.ts`, `tokens/finance.ts`, `tokens/cloud.ts`) and emit CSS variables.
  2. Build a `ThemeProvider` component at `packages/ui/src/theme/ThemeProvider.tsx`.
  3. Wrap Storybook stories in Finance/Cloud decorators to showcase each vertical preset.

---

### 8. Why This Matters (Interview Talking Points)

- **Technical breadth** – This monorepo demonstrates knowledge of React, TypeScript, build tooling (Vite, Storybook), testing, CI/CD, and publishing workflows.
- **Product thinking** – You’re not just building UI pieces; you’re creating domain-specific themes (finance, cloud) that solve real product problems.
- **Scalability** – Workspaces + Changesets mean new components/themes can be added without tearing down the structure.
- **Documentation mindset** – Storybook + README + this architecture doc show that you value clarity and developer experience.

Use this document to walk interviewers through the setup, or to remind yourself how each part fits together as you keep building.
