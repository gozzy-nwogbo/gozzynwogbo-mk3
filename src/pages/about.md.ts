import type { APIRoute } from "astro";
import { PERSON, SITE } from "../lib/constants";

const md = `# About Gozzy Nwogbo

A hybrid operator: a business head with frontier-AI hands.

${PERSON.description}

## At a glance

- Currently: Building Atomos and independent AI systems
- Previously: Loop Tech Systems (launched as Loop Health), Co-founder, Head of Strategy & Expansion (2023 to 2025)
- Based in: Toronto, Ontario, Canada
- Open to: Founding and greenfield AI roles, forward-deployed and solutions engineering, AI transformation
- Education: MSc in Digital Management (Ivey Business School); BSc in Business Administration (Boston University), concentrating in Management Strategy and Management Information Systems

## Background

I came at AI from business, not computer science. Business school taught me how to take a messy organization apart on paper: what it sells, where the margin lives, which problems are worth solving and for whom. That training runs underneath everything I build.

About two years ago, AI tools crossed a line. They stopped being toys and became amplifiers, and I made a decision: go deep now, build on the frontier while it is still forming, instead of waiting for it to mature into something safe. Since then I have built daily. Knowledge systems, agents, automation pipelines, real deliverables for real organizations.

The result is a bridge. Two things rarely sit in one person: a business head and frontier-AI hands. I have both. I sit between what AI can do and how organizations actually work, and I close that gap myself rather than handing off a requirements document and hoping.

## Expertise

**Business judgment:** business model analysis, investment screening and diligence, tender and bid strategy, AI transformation strategy, market and competitive analysis.

**AI systems & agents:** AI systems design, agent design and orchestration, MCP servers and tooling, retrieval and knowledge systems, LangChain, PostgreSQL / pgvector.

**Automation & delivery:** n8n workflow automation, Python, cron agents and pipelines, Supabase, Astro.

## How I Work

Business first. Before any system gets built, I want to know what it is worth: whose time it saves, what that time costs, what changes if it works. I measure in time saved first, then convert to money.

Then I build to prove. I do not sell outcomes I have not produced. Every system starts with a spec that defines what done looks like before a line of code is written, and the fastest way to settle whether something will work is a small pilot you can see with your own eyes before you commit to anything.

## FAQ

**So what do you do?**
I build AI systems that give organizations leverage they do not have yet. In practice, I take frontier AI tools and turn them into things that run inside a business: knowledge systems, automations, agents. Two years hands-on, business background underneath it.

**Why AI? How did you get into it?**
I came at it from business, not computer science. About two years ago these tools crossed the line from toys to real amplifiers, and I went deep, built on the frontier instead of waiting for it to mature. The business lens is what makes it useful. I am not building tech for its own sake, I am building leverage.

**Are you a student, or further along than that?**
I am early, and I treat that as an edge. No habits to unlearn, and I have been living on the frontier of these tools while they are still new to most professionals. I have already shipped real work for real organizations. I would rather be judged on what I have built than years served.

**Why you? What makes you different?**
Two things rarely sit in one person: a business head and frontier-AI hands. I have both. I build systems that outlast me, not dependencies on me. And I bring the standard to places it has not reached yet.

---

HTML version: ${SITE.url}/about
`;

export const GET: APIRoute = () =>
  new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
