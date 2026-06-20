import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  testimonials: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
    schema: z.object({
      type: z.enum(["Webinars", "Family Paediatric Services"]),
    }),
  }),
  services: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
    schema: z.object({
      title: z.string(),
      img_path: z.string(),
      img_alt: z.string(),
      price: z.string(),
      price_per: z.string(),
      cta: z.string(),
    }),
  }),
};
