export const SITE = {
  url: "https://gozzynwogbo.com",
  name: "Gozzy Nwogbo",
  title: "Gozzy Nwogbo — AI Systems & Transformation",
  description: "I build AI systems that give organizations leverage they do not have yet. Business background, two years hands-on with frontier tools. Based in Toronto.",
  ogImage: "/og-image.jpg",
  locale: "en",
} as const;

export const PERSON = {
  id: "https://gozzynwogbo.com/#person",
  name: "Gozzy Nwogbo",
  givenName: "Gozzy",
  familyName: "Nwogbo",
  jobTitle: "AI Systems Builder & Transformation Partner",
  description: "I sit between what AI can do and how organizations actually work, and I close that gap. Business background, two years building on the frontier: knowledge systems, automations, and agents that run inside real businesses. Based in Toronto.",
  location: { city: "Toronto", region: "Ontario", country: "CA" },
  nationality: "Nigeria",
  sameAs: [
    "https://www.linkedin.com/in/gozzy-nwogbo/",
    "https://x.com/gozzynb",
    "https://github.com/gozzy-nwogbo",
    "https://www.wikidata.org/wiki/Q139934550",
  ],
  knowsAbout: [
    "AI systems design",
    "Agent and workflow automation",
    "Retrieval and knowledge systems",
    "Business model analysis",
    "AI transformation strategy",
    "Python",
    "n8n",
    "LangChain",
    "Astro",
    "PostgreSQL / pgvector",
  ],
} as const;

export const CREDIBILITY = {
  workedWith: [
    { name: "MI-C3", note: "" },
    { name: "Yale", note: "intern" },
    { name: "FSRA", note: "advisory" },
    { name: "Loop Tech", note: "co-founded, dissolved" },
  ],
  loopTechClients: ["Bupa Global", "NHS", "Boston Medical Center"],
  builtWith: ["n8n", "Claude API", "Supabase", "Python", "LangChain", "Astro", "pgvector"],
  iveyProjects: ["Scotiabank", "CIBC", "Autism Society of America", "Boys & Girls Club of London"],
} as const;

// Generated motif imagery per project; used on the home bench and the projects index.
export const PROJECT_CARD_IMAGES: Record<string, string> = {
  "second-brain": "/projects/atomos-motif.jpg",
  obscura: "/projects/obscura-motif.jpg",
  scribe: "/projects/scribe-motif.jpg",
  "tender-radar": "/projects/tender-radar-motif.jpg",
  "infrastructure-bid-engine": "/projects/infra-bid-engine-motif.jpg",
  "healthcare-workflow": "/projects/healthcare-workflow-motif.jpg",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gozzy-nwogbo/" },
  { label: "GitHub", href: "https://github.com/gozzy-nwogbo" },
  { label: "X", href: "https://x.com/gozzynb" },
] as const;
