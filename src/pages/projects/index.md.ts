import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../../lib/constants";

export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects")).sort(
    (a, b) => a.data.sortOrder - b.data.sortOrder,
  );

  const lines = projects.map((p) => {
    const metrics = p.data.metrics
      .map((m) => `  - ${m.label}: ${m.value}`)
      .join("\n");
    return `## [${p.data.title}](${SITE.url}/projects/${p.id})\n\n${p.data.description}\n\n- Status: ${p.data.status}\n- Technologies: ${p.data.technologies.join(", ")}\n${metrics}`;
  });

  const md = `# Projects — Gozzy Nwogbo

AI systems built to run inside real businesses: knowledge engines, automations, and agents. Each one ends in an outcome, not a demo.

${lines.join("\n\n")}

---

HTML version: ${SITE.url}/projects
`;

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
