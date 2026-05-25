import { SITE, PERSON } from "../lib/constants";

export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": PERSON.id },
    inLanguage: SITE.locale,
  };
}
