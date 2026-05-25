export const SITE = {
  url: "https://gozzynwogbo.com",
  name: "Gozzy Nwogbo",
  title: "Gozzy Nwogbo — Management Consultant & Technology Builder",
  description: "Management consultant and technology entrepreneur specializing in Nigerian fintech, healthcare platform design, and AI automation. Based in Toronto.",
  ogImage: "/og-image.jpg",
  locale: "en",
} as const;

export const PERSON = {
  id: "https://gozzynwogbo.com/#person",
  name: "Gozzy Nwogbo",
  givenName: "Gozzy",
  familyName: "Nwogbo",
  jobTitle: "Management Consultant & Technology Builder",
  description: "Management consultant and technology entrepreneur who applies McKinsey-style strategic frameworks to hands-on platform development across Nigeria's fintech, healthcare, and defense sectors.",
  location: { city: "Toronto", region: "Ontario", country: "CA" },
  nationality: "Nigeria",
  sameAs: [
    "https://www.linkedin.com/in/gozzy-nwogbo/",
    "https://x.com/gozzynb",
  ],
  knowsAbout: [
    "Management consulting frameworks",
    "Nigerian fintech ecosystem",
    "Healthcare platform design",
    "Business model analysis",
    "AI automation for SMBs",
    "Platform strategy",
    "Python",
    "React",
    "Three.js",
    "LangChain",
    "FastAPI",
  ],
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gozzy-nwogbo/" },
  { label: "X", href: "https://x.com/gozzynb" },
] as const;
