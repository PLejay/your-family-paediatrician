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
    }),
  }),
};
