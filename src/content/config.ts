import { defineCollection, z } from "astro:content";

export const collections = {
  testimonials: defineCollection({
    type: "content",
    schema: z.object({
      quote: z.string(),
      type: z.enum(["Webinars", "Family Paediatric Services"]),
    }),
  }),
  services: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      img_path: z.string(),
      img_alt: z.string(),
    }),
  }),
};
