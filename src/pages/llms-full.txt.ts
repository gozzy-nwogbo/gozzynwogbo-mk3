import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { PERSON, SITE } from "../lib/constants";

export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects")).sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder,
  );

  const projectSections = projects.map((p) => {
    const metrics = p.data.metrics
      .map((m) => `- ${m.label}: ${m.value}`)
      .join("\n");
    return `# Project: ${p.data.title}

${p.data.description}

Status: ${p.data.status}
Technologies: ${p.data.technologies.join(", ")}
${metrics}
URL: ${SITE.url}/projects/${p.id}

${(p.body ?? "").trim()}`;
  });

  const txt = `# ${SITE.title}

${SITE.description}

${PERSON.description}

Education: MSc in Digital Management, Ivey Business School. BSc in Business Administration, Boston University, concentrating in Management Strategy and Management Information Systems.

Contact: nwogbo.gozzy@gmail.com | https://www.linkedin.com/in/gozzy-nwogbo/ | https://github.com/gozzy-nwogbo
Location: Toronto, Ontario, Canada

Knows about: ${PERSON.knowsAbout.join(", ")}

---

${projectSections.join("\n\n---\n\n")}

---

Markdown mirrors: ${SITE.url}/about.md, ${SITE.url}/contact.md, ${SITE.url}/projects/index.md
`;

  return new Response(txt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
