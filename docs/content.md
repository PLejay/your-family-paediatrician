# Editing content

Most content edits are either a markdown file in `src/content/` (data-driven
sections) or a copy tweak inside the owning component (everything else).
Schemas for all collections are in `src/content.config.ts`.

## Workshops (`src/content/workshops/`)

One `.md` file per session. Use dated filenames so recurring events stay
unique (e.g. `first-aid-for-babies-2026-07.md`). Frontmatter:

- `title` — quote it if it contains a colon.
- `date` — the event day, `YYYY-MM-DD`. Drives everything below.
- `time` — display string for upcoming cards, e.g. `"2:00–4:30pm"` (quote it).
- `location` — display string, e.g. `Dockland Settlements, London E14 3PS` or
  `Online`.
- `url` — booking link (Eventbrite etc.), optional. Without it the
  "Reserve a place" button points at the enquiry form (`#book`).

The markdown body is the 1–2 sentence description on upcoming cards. Past
cards only show title + "Month Year · location", so `time`/`url`/body can be
omitted for past-only entries.

Behaviour (implemented in `Workshops.astro`):

- **The upcoming/past split happens at build time.** A workshop stays
  "upcoming" through its event day and moves to "Past workshops" on the first
  deploy after that. A nightly scheduled rebuild caps staleness at one day —
  see [operations](operations.md#nightly-rebuild).
- The soonest upcoming workshop gets the "Next session" badge; others get
  "Workshop". Same-day sessions tie-break by filename.
- Zero upcoming workshops renders a "No dates in the calendar right now"
  card with a register-interest CTA — an empty calendar never looks broken.
- Dates are formatted pinned to UTC so build-machine timezones can't shift
  the displayed day.

## Articles (`src/content/articles/`)

External blog-article cards in the Resources section. To add one: drop a
16:10 thumbnail in `src/assets/articles/` and create a `.md` with `title`,
`category`, `url` (the external article), `published` (newest first) and
`image`. Keep the body teaser plain text — the whole card is a link, so
nested markdown links would break it.

## Testimonials (`src/content/testimonials/`)

Short five-star quotes; the body is the quote itself. Frontmatter: `type`
(`parents` → Reviews section, `workshop` → Workshops section) and `order`.

## Services (`src/content/services/`)

The three service cards. Frontmatter: `title`, `icon`, `order`, `cta_label`,
`cta_href`, and optional `cta_topic` — when set, clicking the CTA pre-selects
that option in the booking form's "What would you like help with?" dropdown
(must exactly match an option in `Booking.astro`; the mechanism is a
`data-book-topic` attribute read by a small script in `Booking.astro`).

## Copy that lives in components (not collections)

- **Fees & insurers** — `FeesPanel.astro` (prices, postnatal package note,
  insurer logo cards: Healix, Aviva, WPA, Vitality; SVGs in
  `src/assets/logos/`).
- **Hero headline, credentials line, trust row** — `Hero.astro`.
- **Bio and credential badges** — `About.astro` (18 years NHS experience is
  the canonical figure).
- **"How I can help" pills** — `HowIHelp.astro`.
- **Emergency band (999 / NHS 111) and blog/Instagram cards** —
  `Resources.astro`.
- **Booking form fields and topic list** — `Booking.astro`.
- **Nav links** — `Nav.astro`.
- **Footer links and medical disclaimer** — `Footer.astro`.

## Key external links

- Practice email: `src/constants.ts` (`PRACTICE_EMAIL`) — the one shared
  constant; other URLs live where they're used.
- Central Health practitioner page & fees: `centralhealthlondon.com`
  (fees panel, privacy page).
- Doctify reviews (4.97/5 rating quoted in Hero and Reviews).
- Blog: Central Health paediatrics category.
- Instagram: `@your_family_paediatrician` (labelled "coming soon").

## Photos

Portraits live in `src/assets/` and are real photos of Dr Lejay — replace
only with originals supplied by her.
