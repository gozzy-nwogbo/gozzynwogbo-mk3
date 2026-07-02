import type { APIRoute } from "astro";
import { SITE } from "../lib/constants";

const md = `# Contact Gozzy Nwogbo

I am open to interesting problems and good conversations across AI systems and transformation. If you are working on something where AI should be creating leverage and is not yet, or you want to talk through how these systems actually get built, I would like to hear about it.

## Where I Can Help

- AI transformation strategy: where AI fits in an organization and where it does not
- Knowledge and retrieval systems that give AI real context
- Agent and workflow automation that runs hands-off
- Business analysis with the numbers rebuilt, not accepted

## Get in Touch

- Email: nwogbo.gozzy@gmail.com
- LinkedIn: https://www.linkedin.com/in/gozzy-nwogbo/
- Based in Toronto, Ontario, Canada. Remote works fine for most things.

---

HTML version: ${SITE.url}/contact
`;

export const GET: APIRoute = () =>
  new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
