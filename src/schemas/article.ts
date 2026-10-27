import { SITE, PERSON } from "../lib/constants";

interface ArticleFrontmatter {
  title: string;
  description: string;
  datePublished: Date;
  dateModified?: Date;
  tags: string[];
}

export function generateArticleSchema(slug: string, data: ArticleFrontmatter) {
  return {
    "@type": "Article",
    "@id": `${SITE.url}/writing/${slug}#article`,
    headline: data.title,
    description: data.description,
    url: `${SITE.url}/writing/${slug}/`,
    author: { "@id": PERSON.id },
    publisher: { "@id": PERSON.id },
    datePublished: data.datePublished.toISOString().split("T")[0],
    dateModified: (data.dateModified ?? data.datePublished).toISOString().split("T")[0],
    isPartOf: { "@id": `${SITE.url}/#website` },
    keywords: data.tags,
  };
}
