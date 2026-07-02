---
title: "Scribe / Scribe Scout"
description: "A content engine that drafts from an atom graph of my own knowledge corpus, plus a discovery front end that scans the last 30 days of online discussion and scores topics by argument intensity."
domain: "content"
geography: "Toronto, Canada"
status: "Active"
datePublished: 2026-06-01
dateModified: 2026-07-01
technologies: ["Python", "Claude", "Reddit / HN data", "Knowledge graph"]
schemaType: "SoftwareApplication"
applicationCategory: "ProductivityApplication"
metrics:
  - label: "Grounding"
    value: "Every draft built from my own atom graph, not model memory"
  - label: "Discovery"
    value: "Scans 30 days of Reddit, HN and more, scored by argument intensity"
  - label: "Output"
    value: "Finds the hot angle and drafts the post"
featured: true
sortOrder: 5
---

## Problem

AI-generated content has a sameness problem. Ask a model to write a post and you get the average of the internet: correct, smooth, and interchangeable with what everyone else generated that morning. The two hard parts of publishing are knowing what is worth saying right now and saying it from knowledge that is actually yours. Generic generation solves neither.

## Approach

Scribe splits the problem in two and solves each half separately.

Scout handles the "what." It scans the last 30 days of discussion across Reddit, Hacker News and other sources, and scores topics by argument intensity: not what is popular, but what people are actively fighting about. A topic people argue over is a topic where a clear position earns attention. Scout surfaces those angles while they are still hot.

Scribe handles the "how." Instead of prompting a model cold, it drafts from an atom graph, a corpus of small, linked knowledge units I have extracted and refined over months of reading and building. When Scribe writes about positioning, it pulls my actual atoms on positioning, with my examples and my references. The model does the assembly; the knowledge is mine.

The two connect into one flow: Scout finds the argument, Scribe drafts the post, grounded in the corpus.

## Outcome

It finds the hot angle and drafts the post, grounded in my own knowledge corpus. Drafts arrive sounding like a specific person with a specific base of evidence, because they are built from one.

The deeper outcome is the architecture lesson. Retrieval over an owned corpus beats generation from model memory for anything where your voice and your evidence are the product. Scribe is that principle running end to end: the same atom graph that powers my knowledge system powers what I publish from it.
