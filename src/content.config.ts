import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    domain: z.enum(["knowledge", "content", "automation", "consulting", "healthcare"]),
    geography: z.string(),
    status: z.enum(["Active", "Pilot Complete", "Early Stage", "Archived"]),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date(),
    technologies: z.array(z.string()),
    schemaType: z.enum(["SoftwareApplication", "CreativeWork"]),
    applicationCategory: z.string().optional(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      benchmark: z.string().optional(),
    })),
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().default(0),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
    tags: z.array(z.string()),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
