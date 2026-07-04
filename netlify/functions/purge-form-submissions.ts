import type { Config } from "@netlify/functions";

// GDPR hygiene for the booking enquiry form (see
// agent-notes/08-booking-form-netlify.md): the email notification is the
// system of record, so submissions only need to live in Netlify storage long
// enough to survive a lost notification.
const RETENTION_DAYS = 7;
const API = "https://api.netlify.com/api/v1";
const PAGE_SIZE = 100;

interface Submission {
  id: string;
  created_at: string;
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

  // Collect every page before deleting anything — deleting while paginating
  // shifts the pages underneath us. The default listing returns verified
  // submissions; the spam bucket holds PII too and needs its own pass.
  const stale: Submission[] = [];
  for (const stateParam of ["", "state=spam&"]) {
    for (let page = 1; ; page++) {
      const response = await fetch(
        `${API}/sites/${siteId}/submissions?${stateParam}per_page=${PAGE_SIZE}&page=${page}`,
        { headers },
      );
      if (!response.ok) {
        throw new Error(
          `listing submissions (${stateParam || "verified"} page ${page}) failed: ${response.status}`,
        );
      }
      const batch = (await response.json()) as Submission[];
      stale.push(...batch.filter((s) => Date.parse(s.created_at) < cutoff));
      if (batch.length < PAGE_SIZE) break;
    }
  }

  // Delete in small concurrent batches so a backlog can't run the function
  // into its timeout.
  let deleted = 0;
  const BATCH = 10;
  for (let i = 0; i < stale.length; i += BATCH) {
    const results = await Promise.allSettled(
      stale.slice(i, i + BATCH).map(async (submission) => {
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
};

export const config: Config = {
  schedule: "@daily",
};
