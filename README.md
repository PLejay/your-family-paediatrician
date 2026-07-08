# Your Family Paediatrician

Landing page for [Your Family Paediatrician](yourfamilypaediatrician.com), a personal website for Dr Shiri Lejay

Built with Astro and Typescript. Deployed via Netlify

## Documentation

- [Architecture & design system](docs/architecture.md) — stack, page structure, colours/fonts/interaction rules
- [Editing content](docs/content.md) — content collections (workshops, articles, testimonials, services) and where copy lives
- [Deployment & operations](docs/operations.md) — branches, booking form backend, scheduled functions, one-off Netlify setup

## Prerequisites

Node 24

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deployment

Pushes to github auto-deploy to Netlify.

The `main` branch is the development branch. All changes made there will be deployed to a preview server.

To deploy to prod, merge `main` into `production`.