# Deployment & operations

## Branches and deploys

- `main` is the development branch — pushes auto-deploy to a Netlify
  **branch preview**.
- `production` is the live site — deploy by merging `main` into `production`.
  **Never commit directly to `production`** (and Claude must never merge to
  it; a human does that).
- **Netlify scheduled functions only run on the published production
  deploy.** Anything under `netlify/functions/` with a `schedule` is dormant
  on `main`'s preview and starts running after the next merge to
  `production`.

## Booking form (Netlify Forms)

The `#book` enquiry form (`src/components/Booking.astro`) is handled by
**Netlify Forms**, form name `booking`.

Why (decided July 2026): the site already deploys to Netlify, expected volume
is far below the 100-submissions/month free tier, and the built-in honeypot +
Akismet filtering means no custom backend. Rejected alternatives: Formspree
(extra vendor, lower tier), custom function + email API (overkill at this
volume, can migrate later without changing the form markup), `mailto:` (bad
UX for the primary conversion path). **No auto-reply is deliberate** — it
would need an email API plus SPF/DKIM DNS; the success card already sets the
1–2 working-day expectation.

How it works:

- Static HTML with `data-netlify="true"` + hidden `form-name` input; Netlify
  registers the form at deploy time and intercepts POSTs.
- A small script submits via `fetch` and swaps in a success card. With JS
  disabled, the native POST lands on `/thanks/` (noindexed).
- Spam: `bot-field` honeypot + Netlify's Akismet. Spam never triggers
  notifications.
- **GDPR retention**: enquiries contain personal data (child's age,
  free-text message — potentially special-category health info). The email
  notification to Shiri is the system of record;
  `netlify/functions/purge-form-submissions.ts` (daily, midnight UTC)
  deletes submissions — ham *and* spam — older than **7 days** from Netlify
  storage. The purge targets the `booking` form only (a future form with
  persistent entries is safe); the spam bucket is purged site-wide on
  purpose. A partially failed run throws, so it shows as failed in the
  Netlify UI.
- `/privacy/` documents all of this and is linked from the form and footer.

### One-off dashboard setup (form)

1. **Enable form detection**: Site configuration → Forms → Enable form
   detection, then deploy so the `booking` form registers.
2. **Email notification**: Forms → `booking` → Form notifications → email to
   the practice address.
3. **Purge token**: create a Netlify Personal Access Token and save it as
   site env var **`NETLIFY_PURGE_TOKEN`** (visibility: Functions, context:
   Production). ⚠️ Netlify PATs cannot be scoped — the token authenticates
   as its owner's whole account (it can *read* every form submission and
   administer every site the owner can). A July 2026 security review flagged
   this as the weakest link. Mitigations: create the PAT under a dedicated
   single-purpose account that collaborates on only this site; set an expiry
   with a renewal reminder (the function fails loudly when the token dies);
   recreate the token immediately if the owning account leaves.

### Form caveats

- Branch deploys share the production form bucket (same form name), so test
  submissions from `main` reach the dashboard, trigger notifications, and
  get purged like real ones.
- The 100/month free-tier cap **counts spam too**. There is deliberately
  **no CAPTCHA**: Netlify's reCAPTCHA option loads Google scripts/cookies,
  contradicting the privacy policy's "no cookies, no tracking" statement. A
  targeted bot could therefore exhaust the cap (genuine enquiries would then
  be dropped while the client-side success card still shows). Accepted risk —
  monitor Forms usage; revisit (reCAPTCHA + privacy-policy update, or a paid
  tier) if spam materialises.

## Nightly rebuild

Date-driven content (the workshops upcoming/past split) is baked in at build
time, so a passed date only takes effect on the next deploy.
`netlify/functions/nightly-rebuild.ts` (daily, midnight UTC — exactly the
split boundary) POSTs a Netlify build hook, capping staleness at one day.
Costs ~1 build minute/night from the free tier's 300/month.

One-off setup: Site configuration → Build & deploy → Build hooks → add a hook
on the `production` branch, and save its URL as site env var
**`NETLIFY_BUILD_HOOK_URL`** (visibility: Functions, context: Production).
Until then the function fails loudly on each run rather than silently
skipping.

## Verification after a production deploy

1. Submit a test enquiry → success card appears, email arrives, submission
   visible under Forms.
2. Submit with JS disabled → lands on `/thanks/`.
3. Functions → `purge-form-submissions` → daily logs show
   `deleted N/M submissions` (or invoke manually:
   `netlify functions:invoke purge-form-submissions`).
4. Functions → `nightly-rebuild` → nightly deploys titled
   "Nightly rebuild (date-driven content)" appear in the deploys list.

## Quality gate

After editing `.astro`/`.ts`/`.css`: `npm run typecheck` and `npm run lint`
(agents: the `code-quality-gate` skill runs both). The build runs
`astro check` first, so type errors fail deploys.
