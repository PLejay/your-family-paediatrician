import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  // Short five-star quotes; the markdown body is the quote itself.
  testimonials: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
    schema: z.object({
      type: z.enum(["parents", "workshop"]),
      order: z.number(),
    }),
  }),
  // Service cards; the markdown body is the card description.
  services: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
    schema: z.object({
      title: z.string(),
      icon: z.enum(["circle", "square", "diamond"]),
      order: z.number(),
      cta_label: z.string(),
      cta_href: z.string(),
      // When set, clicking the CTA pre-selects this option in the booking
      // form's "What would you like help with?" dropdown (must match the
      // option text in Booking.astro).
      cta_topic: z.string().optional(),
    }),
  }),
  // External blog-article cards; the markdown body is the card teaser.
  // To add an article: drop a 16:10 thumbnail in src/assets/articles/ and
  // create a new .md alongside the existing ones. Keep the teaser plain
  // text — no markdown links, as the whole card already renders as an <a>
  // and nested links would split its click area.
  articles: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        category: z.string(),
        url: z.url(),
        // Newest-first ordering; not currently displayed.
        published: z.coerce.date(),
        image: image(),
      }),
  }),
};
