---
name: code-quality-gate
description: Run the project's quality checks (typecheck + linting) after making changes, and fix anything that fails. Use after editing .astro/.ts/.css files, before considering a change complete.
allowed-tools: Bash(npm run typecheck), Bash(npm run lint), Bash(npm run lint:fix), Bash(nvm use)
---

Run the project's quality gate after making code changes and resolve any failures before reporting the work as done.

## When to use

Run this whenever you've finished a set of edits to `.astro`, `.ts`, or `.css` files — before telling the user the change is complete. Treat a clean pass as part of "done".

## Instructions

Run from the project root, using the pinned Node version.

1. Ensure the correct Node version: `nvm use` (reads `.nvmrc` → Node 24).
2. **Typecheck:** `npm run typecheck` (runs `astro check` — TypeScript + Astro diagnostics across the project).
3. **Lint:** `npm run lint` (runs `eslint .` then `stylelint` on the stylesheets).

Both must exit 0.

## On failure

- For lint issues, try `npm run lint:fix` first to auto-resolve formatting/notation issues, then re-run `npm run lint` to confirm and to surface anything left that needs a manual fix.
- For typecheck errors, read the reported file/line, fix the root cause, and re-run `npm run typecheck`.
- Re-run until both commands are clean. Do not report the change as complete while either is failing.

## Notes

- `stylelint` lints both the standalone stylesheets in `src/styles/` and the `<style>` blocks inside `.astro` components (via `postcss-html`). Style rules and the units/selector/value conventions live in `stylelint.config.js`; ESLint uses the flat config in `eslint.config.js`.
- These are the same checks `npm run build` runs (`astro check`) plus linting, so a clean gate means the build's check phase will also pass.
