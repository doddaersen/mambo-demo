# CSS audit notes

Working baseline: `sandbox` branch after the 80-term demo refactor.

## Current CSS entrypoint

`assets/css/site.css` is the single stylesheet loaded by `index.html`. It imports the remaining visual layers in cascade order.

Current imports:

1. `style.css`
2. `quick-search.css`
3. `mambo-final.css`
4. `text-header-title.css`
5. `sandbox-ui.css`
6. `term-card-final.css`
7. `sidebar-panels.css`
8. `ui-enhancements.css`
9. `category-label-overrides.css`

## Layer roles

### `style.css`
Base layout and original visual system. It contains root variables, page layout, sidebar, grid/card basics, category overview basics, detail fields, tags, footer, and responsive rules.

Status: keep for now as base layer, but it is no longer the final source of truth for cards or category panels.

### `quick-search.css`
Dedicated quick-search block styling.

Status: likely useful and separable.

### `mambo-final.css`
Large previous final/public demo override layer. It controls typography, category panels, card layout, detail view, technical-data styling, and some responsive behavior.

Status: partially obsolete. Many declarations are overridden later by `sandbox-ui.css` and `term-card-final.css`. Do not delete directly; audit gradually.

### `text-header-title.css`
Header/title treatment for the KÖNYVANATÓMIA image/title area.

Status: likely useful and separable.

### `sandbox-ui.css`
Current functional UI layer. It defines the compact category grid, current card visual behavior, open-card/detail behavior, mobile sidebar behavior, tag/detail styles, and technical data presentation.

Status: important. Bad name for a future live release; later rename or fold into a clearer file such as `demo-ui.css`.

### `term-card-final.css`
Current final card-layout override. It controls the two-column card flow, icon/content grid, icon sizes, mobile card layout, and spacing.

Status: important. This is currently the final source of truth for term-card layout.

### `sidebar-panels.css`
Sidebar intro/browse panel styling.

Status: likely useful; inspect later for overlap with `style.css`.

### `ui-enhancements.css`
Styles for enhancement scripts such as image zoom and interactive states.

Status: likely useful; keep paired with `ui-enhancements.js`.

### `category-label-overrides.css`
Late overrides for category label colors/appearance.

Status: useful but should eventually be consolidated with category variables or component CSS.

## Main problem

The CSS is not broken, but it is historically layered. Several files represent earlier design states and later patch layers. The current visual result depends on cascade order and many `!important` overrides.

## Safe refactor strategy

1. Do not delete CSS layers directly.
2. Keep `site.css` as the entrypoint during cleanup.
3. First document roles and dependencies.
4. Next inspect whether `mambo-final.css` declarations are still active or are fully overridden.
5. Rename `sandbox-ui.css` only after the release path is stable.
6. Consolidate card-related CSS last, because the visible card layout depends on the most fragile override chain.

## Current priority

Do not refactor CSS before the 80-term demo is stable in the release path. The next safe technical step is to prepare a clean release route from the current `sandbox` state rather than continue patching `main` directly.
