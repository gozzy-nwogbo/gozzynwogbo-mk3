import { PERSON, SITE } from "../lib/constants";

export function generatePersonSchema() {
  return {
    "@type": "Person",
    "@id": PERSON.id,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: SITE.url,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.location.city,
      addressRegion: PERSON.location.region,
      addressCountry: PERSON.location.country,
    },
    nationality: {
      "@type": "Country",
      name: PERSON.nationality,
    },
    sameAs: PERSON.sameAs,
    knowsAbout: PERSON.knowsAbout,
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Ivey Business School",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Boston University",
      },
    ],
  };
}
