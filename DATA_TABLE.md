## Data Table Architecture Notes

### Why build it?
- Needed a reusable data-heavy component that could power finance and cloud dashboards without coupling to any backend.
- Requirements: large dataset support, sticky headers, custom cell renderers, column resizing, sorting, filtering, pagination, and accessible semantics.
- Splitting headless logic from presentation makes the component portable and easier to test.

### Folder structure
```
packages/ui/src/components/DataTable
├── DataTable.tsx         // presentational component
├── DataTable.stories.tsx // interactive docs
├── DataTable.test.tsx    // Jest tests
├── types.ts              // shared types
└── useDataTable.ts       // headless hook
```

### Headless hook (`useDataTable`)
- Accepts raw data + column definitions.
- Manages sort state, global filter, pagination, and column widths.
- Uses `useMemo` to derive filtered/sorted/paginated arrays so re-renders are cheap.
- Exposes actions (`setSort`, `setFilterValue`, `setPageSize`, `nextPage`, `setColumnWidth`) keeping UI stateless.
- Default filter scans all primitive values but accepts a custom `globalFilter` for domain-specific logic.

### Presentational layer (`DataTable`)
- Composes the hook output into a responsive table with sticky headers and resizable columns.
- Toolbar is pluggable via `renderToolbar`; defaults to a global filter input + row count.
- Headers expose sorting via buttons with `aria-sort`, while sticky columns use CSS `position: sticky`.
- Column resizing is implemented with simple mouse listeners that update the hook’s column width state.
- Body rows accept custom renderers for cells so finance/cloud themes can inject chips, charts, etc.
- Pagination controls reuse the Button component for consistent styling/accessibility.

### Accessibility
- `table` uses `role="grid"` to allow richer interaction semantics.
- Headers declare `aria-sort`, buttons announce sorting intent, filter inputs have clear placeholders.
- Empty states use `<td colSpan>` to keep table semantics intact.

### Performance considerations
- Headless hook memoizes all derived data; the component only re-renders slices relevant to the current page.
- Column resizing updates are localized to width state rather than reprocessing the dataset.
- API encourages stable column definitions so React can memoize header/cell rendering.
- For future extreme datasets, the hook pattern allows dropping in virtualization without rewriting the UI.

### Testing
- `DataTable.test.tsx` uses React Testing Library to verify sorting toggles and filtering.
- Headless logic can be tested independently in future (e.g., renderHook) thanks to the separation.

### Storybook usage
- Stories showcase sticky columns, custom cell renderers, and toolbar overrides so users see real cloud/fintech workflows.
- Sample data mimics SaaS metrics (MRR/usage/status) to demonstrate domain-specific styling.

### Next steps
- Add row selection + bulk actions.
- Support column-level filters alongside the global filter.
- Integrate virtualization for 10k+ rows using `@tanstack/react-virtual` or similar.
- Provide theme presets (finance/cloud) that change typography, borders, and component defaults without touching the hook.
