# Architecture & design system

Landing page for **Dr Shiri Lejay**, a Consultant Paediatrician offering private
consultations, home visits and parent workshops in London. One-page scrollable
site — the design goal is warmth and professional trust, not snazzy design.

## Stack

- **Astro** (static output) + **TypeScript**, deployed on **Netlify**
  (`@astrojs/netlify` adapter). Node ≥ 24.
- Tooling: ESLint (+ astro plugin), Stylelint, Prettier (+ astro plugin).
  `npm run build` = `astro check && astro build`.
- No client-side framework. The only JavaScript on the page is small inline
  scripts (booking-form submission, topic pre-selection).
- Fonts are self-hosted via Astro's fonts API (`astro.config.mjs`), not
  loaded from Google at runtime.

## Page structure

The whole site is one page, `src/pages/index.astro`, composed of one component
per section (in order):

| Section | Anchor | Component |
|---|---|---|
| Hero | `#home` | `Hero.astro` |
| How I can help | `#help` | `HowIHelp.astro` |
| Services + fees | `#services` | `Services.astro`, `FeesPanel.astro` |
| Workshops & talks | `#workshops` | `Workshops.astro` |
| About | `#about` | `About.astro` |
| Reviews | `#reviews` | `Reviews.astro` |
| Helpful resources | — | `Resources.astro` |
| Booking form | `#book` | `Booking.astro` |
| Final CTA | `#contact` | `FinalCTA.astro` |

The sticky nav (`Nav.astro`) and in-page CTAs link to these anchors
(`scroll-behavior: smooth` with `scroll-padding-top` for the sticky header).
All "Book a consultation" CTAs point at `#book` (the on-site enquiry form),
not at Central Health's site.

Other pages:

- `src/pages/thanks.astro` — no-JS fallback landing page for the booking form
  (noindexed).
- `src/pages/privacy.astro` — privacy policy for the booking form data.
  Drafted by Claude, not legal advice; if data retention or processing
  changes, update it and its "Last updated" date.
- `src/pages/404.astro`.

Shared building blocks: `layouts/BaseLayout.astro`, `MainHead.astro` (SEO/meta),
`SectionHeader.astro` (eyebrow + heading pattern), `Brand.astro` (logo mark +
wordmark), and `ui/` primitives (`CallToAction`, `Icon` + `IconPaths.ts`,
`Pill`, `Stars`, `SuccessCard`).

## Design system

All design tokens live in `src/styles/global.css` (`:root`). The chosen tone
is **"Teal & Aqua"** — calm, clinical, soothing:

- `--accent-regular: #6ea9a2` (tropical teal), `--accent-deep: #38655d`
  (dark teal — primary buttons, fees panel, final CTA, group banner),
  `--accent-light: #93e1d8` (pearl aqua), `--aqua-tint: #e9f5f3`
  (card/section washes).
- `--red-400: #fc6471` (bubblegum pink) is reserved for the **emergency**
  resource band. `--star-gold` for review stars.
- Page background `#f6f7f8` alternates with white between sections; text
  `#1f3a34` on a soft-green-grey muted scale.
- `--radius: 20px` throughout.

Typography — **do not change this without checking, it has been gotten wrong
before**: **Geologica** for all headings, card titles and the brand wordmark
(weight 600 for headings, 700 for the wordmark); **Inter** for body copy,
labels and quotes. Both configured in `astro.config.mjs` and exposed as
`--font-brand` / `--font-body`.

Interaction rules:

- Button hover = **shadow lift only, never `translateY`** (explicit owner
  decision).
- Layout is fluid — `clamp()` type, `flex-wrap`, grid `auto-fit minmax()` —
  rather than fixed breakpoints. Content max-width 1180px.

## Design provenance

The site was rebuilt (2026) from a claude.ai/design prototype to replace the
original template-based site, which sold a different, now-abandoned model
(subscription advice group, mailing list). The design bundles and detailed
handoff analysis live in `agent-notes/` — **local only, not in git**; these
docs distil everything from there that future maintainers need. Canonical
copy facts that were once inconsistent: **18 years** of NHS experience, and
the credential is spelled **MRCPCH**.
