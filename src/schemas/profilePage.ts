import { SITE, PERSON } from "../lib/constants";

export function generateProfilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE.url}/about#profilepage`,
    url: `${SITE.url}/about/`,
    name: `About ${PERSON.name}`,
    mainEntity: { "@id": PERSON.id },
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
}
