import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../lib/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = (await getCollection("writing"))
    .filter((a) => !a.data.draft)
    .sort((a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!.toString(),
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.datePublished,
      link: `/writing/${article.id}/`,
    })),
  });
}
