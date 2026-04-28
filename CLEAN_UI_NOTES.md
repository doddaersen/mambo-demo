# Clean UI refactor

This branch starts from the last working `main` demo but separates the current UI decisions from the earlier stacked override files.

## Working branch

`clean-ui-refactor`

The `main` branch should remain untouched while the clean version is adjusted.

## Editing rule

For layout and visual changes, edit:

`assets/css/mambo-clean.css`

Avoid adding new one-off override CSS files. If a new UI rule is needed, put it into `mambo-clean.css` and bump its cache query in `index.html`.

## Current dependency structure

The HTML still loads the older base CSS files because the renderer and cards depend on their existing class names. The final visible UI should be controlled by the last stylesheet:

`assets/css/mambo-clean.css`

The category icons are still injected by:

`assets/js/category-icon-overrides.js`

The vocabulary data and term cards are rendered by:

`assets/js/app-xls-clean.js`

## Next possible cleanup step

Later, the older CSS layers can be merged into one base stylesheet, but this first clean branch keeps behaviour stable and only centralizes new UI changes.
