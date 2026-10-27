import { SITE, PERSON } from "../lib/constants";

interface ProjectFrontmatter {
  title: string;
  description: string;
  domain: string;
  geography: string;
  status: string;
  datePublished: Date;
  dateModified: Date;
  technologies: string[];
  schemaType: "SoftwareApplication" | "CreativeWork";
  applicationCategory?: string;
  metrics: { label: string; value: string; benchmark?: string }[];
}

export function generateProjectSchema(slug: string, data: ProjectFrontmatter) {
  const base: Record<string, unknown> = {
    "@type": data.schemaType,
    "@id": `${SITE.url}/projects/${slug}#project`,
    name: data.title,
    description: data.description,
    url: `${SITE.url}/projects/${slug}/`,
    creator: { "@id": PERSON.id },
    author: { "@id": PERSON.id },
    datePublished: data.datePublished.toISOString().split("T")[0],
    dateModified: data.dateModified.toISOString().split("T")[0],
    isPartOf: { "@id": `${SITE.url}/#website` },
  };

  if (data.schemaType === "SoftwareApplication" && data.applicationCategory) {
    base.applicationCategory = data.applicationCategory;
  }

  return base;
}
