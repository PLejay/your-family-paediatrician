import type { Config } from "@netlify/functions";

// Date-driven content (the workshops upcoming/past split) is baked in at
// build time, so a passed date only takes effect on the next deploy. This
// nightly rebuild caps that staleness at one day. It runs at midnight UTC,
// which is exactly the boundary the split in Workshops.astro uses, so a
// workshop moves to "Past workshops" on the first rebuild after its day.
export default async () => {
  const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!hookUrl) {
    // Throw so the invocation shows as failed in the Netlify UI instead of
    // silently skipping the rebuild.
    throw new Error("nightly-rebuild: NETLIFY_BUILD_HOOK_URL is not set");
  }

  const response = await fetch(hookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // Shown as the deploy's title in the Netlify deploys list.
    body: new URLSearchParams({
      trigger_title: "Nightly rebuild (date-driven content)",
    }).toString(),
  });
  if (!response.ok) {
    throw new Error(`nightly-rebuild: build hook returned ${response.status}`);
  }
  console.log("nightly-rebuild: build triggered");
};

export const config: Config = {
  schedule: "@daily",
};
