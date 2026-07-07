import type { APIRoute } from "astro";
import { SITE } from "../lib/constants";

const md = `# Experience — Gozzy Nwogbo

Laying the foundation of a hybrid practice. Business rooms and build rooms, one throughline: systems that ship, and the business sense to know which ones were worth building.

## Loop Tech Systems — Co-founder, Head of Strategy & Expansion

Boston, MA (Remote) · Jul 2023 to Nov 2025 · Venture, closed

Co-founded a health-tech startup and ran strategy and expansion until the venture closed in 2025. Led enterprise client engagements for Bupa Global, the NHS, and Boston Medical Center. Designed the transformation roadmap and clinical workflow for a telehealth platform serving roughly 500 users, and shipped 4 features against it. Built the AI orchestration layer on n8n, Relevance AI, and Python. The orchestration layer lifted client workflow throughput 2.3x.

## Ivey Business School, IDIS — Strategy Consultant Intern

Toronto (Remote) · May 2025 to Jul 2025 · Consulting

AI and digital-transformation strategy with change management for CIBC, the Autism Society of America, and the Boys & Girls Club of London. Built an agentic donor-engagement automation on Relevance AI and Python, so the strategy deck shipped with a working system behind it.

## MI-C3 International — Software Engineer

Boston, MA (Remote) · Sep 2022 to Aug 2023 · Engineering

Built workflow-optimization features on a 5-person cross-functional team: SQL data models, monitoring dashboards, and operational pipelines. The year that turned business questions into schemas and shipping discipline.

## Yale University — Research Assistant

New Haven, CT · Jul 2020 to Sep 2020 · Research

Selected for research on incentive design in organizations. Determined the KPIs, built the Excel database that cataloged study parameters, and distilled the findings into the final paper. The root of a lasting interest in why people actually do things, which now runs through the content and persuasion work.

---

HTML version: ${SITE.url}/experience
`;

export const GET: APIRoute = () =>
  new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
