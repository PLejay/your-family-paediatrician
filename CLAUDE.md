# Instructions

All development work should be done on the `main` branch. Never merge anything to production yourself.

Maintainer documentation lives in `docs/` — read the relevant file before working on that area:

- `docs/architecture.md` — page structure, components, design system (fonts and interaction rules have hard constraints)
- `docs/content.md` — content collections and where each piece of copy lives
- `docs/operations.md` — deployment, booking form backend, scheduled functions

Keep these docs up to date when your changes affect what they describe.

# Git guidelines

**NEVER commit directly to the `production` branch**

Commit titles must follow Conventional Commit specifications with the github issue ID at the end if relevant: `[GH-XXX]`
Commit bodies must always list both Claude and the current user as co-authors
Branch names must follow this format: `<type>/<github ID if relevant>/<description of issue>`