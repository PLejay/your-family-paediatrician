import type { Config } from "@netlify/functions";

// GDPR hygiene for the booking enquiry form (see
// agent-notes/08-booking-form-netlify.md): the email notification is the
// system of record, so submissions only need to live in Netlify storage long
// enough to survive a lost notification.
const RETENTION_DAYS = 7;
const FORM_NAME = "booking";
const API = "https://api.netlify.com/api/v1";
const PAGE_SIZE = 100;
const DELETE_BATCH = 10;

interface NetlifyForm {
  id: string;
  name: string;
}

interface Submission {
  id: string;
  created_at: string;
}

async function listPages(
  url: string,
  headers: HeadersInit,
  label: string,
  extraQuery = "",
) {
  const all: Submission[] = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `${url}?${extraQuery}per_page=${PAGE_SIZE}&page=${page}`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(
        `listing ${label} submissions (page ${page}) failed: ${response.status}`,
      );
    }
    const batch = (await response.json()) as Submission[];
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return all;
}

export default async () => {
  const token = process.env.NETLIFY_PURGE_TOKEN;
  const siteId = process.env.SITE_ID;
  if (!token || !siteId) {
    // Throw so the invocation shows as failed in the Netlify UI — a silent
    // return would report success while the retention promise goes unmet.
    throw new Error(
      "purge-form-submissions: NETLIFY_PURGE_TOKEN or SITE_ID is not set",
    );
  }
  const headers = { Authorization: `Bearer ${token}` };
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

  // Verified submissions are purged per-form so a future form whose entries
  // should persist isn't silently emptied by this job.
  const formsResponse = await fetch(`${API}/sites/${siteId}/forms`, {
    headers,
  });
  if (!formsResponse.ok) {
    throw new Error(`listing forms failed: ${formsResponse.status}`);
  }
  const forms = (await formsResponse.json()) as NetlifyForm[];
  const bookingForm = forms.find((form) => form.name === FORM_NAME);
  if (!bookingForm) {
    // Fail loudly: either form detection isn't finished, or the form was
    // renamed without updating this function — in both cases PII may be
    // accumulating unpurged.
    throw new Error(
      `form "${FORM_NAME}" not found on site — nothing was purged`,
    );
  }

  // Collect everything before deleting anything — deleting while paginating
  // shifts the pages underneath us. The spam pass is deliberately site-wide:
  // week-old spam holds PII too and no form wants to keep it.
  const stale = [
    ...(await listPages(
      `${API}/forms/${bookingForm.id}/submissions`,
      headers,
      FORM_NAME,
    )),
    ...(await listPages(
      `${API}/sites/${siteId}/submissions`,
      headers,
      "spam",
      "state=spam&",
    )),
  ].filter((s) => Date.parse(s.created_at) < cutoff);

  // Delete in small concurrent batches so a backlog can't run the function
  // into its timeout.
  let deleted = 0;
  for (let i = 0; i < stale.length; i += DELETE_BATCH) {
    const results = await Promise.allSettled(
      stale.slice(i, i + DELETE_BATCH).map(async (submission) => {
        const response = await fetch(`${API}/submissions/${submission.id}`, {
          method: "DELETE",
          headers,
        });
        if (!response.ok) {
          throw new Error(`${submission.id}: ${response.status}`);
        }
      }),
    );
    for (const result of results) {
      if (result.status === "fulfilled") {
        deleted++;
      } else {
        console.error(`purge-form-submissions: delete failed: ${result.reason}`);
      }
    }
  }
  console.log(
    `purge-form-submissions: deleted ${deleted}/${stale.length} submissions older than ${RETENTION_DAYS} days`,
  );
  if (deleted < stale.length) {
    // Same principle as the missing-token check: a partially failed purge
    // must not report success.
    throw new Error(
      `failed to delete ${stale.length - deleted} of ${stale.length} stale submissions`,
    );
  }
};

export const config: Config = {
  schedule: "@daily",
};
