---
title: "Second Brain / Open Brain"
philosophy: "AI is only as useful as what you can put in front of it."
description: "A working personal knowledge OS: an MCP server with semantic search over pgvector, daily capture, processing, and digest pipelines, spanning ~70 knowledge domains. It runs my daily practice."
domain: "knowledge"
geography: "Toronto, Canada"
status: "Active"
datePublished: 2026-01-01
dateModified: 2026-07-01
technologies: ["Python", "MCP", "PostgreSQL", "pgvector", "OpenAI embeddings", "Supabase"]
schemaType: "SoftwareApplication"
applicationCategory: "ProductivityApplication"
metrics:
  - label: "Knowledge domains"
    value: "70+ domains held in one system"
  - label: "Core tools"
    value: "4 MCP tools over captures, people, projects, ideas"
  - label: "Proof of use"
    value: "Carried a full strategy exercise end to end"
featured: true
sortOrder: 1
---

## Problem

Frontier AI models are brilliant and amnesiac. Every session starts from zero. Meanwhile the actual raw material of useful work, the article you read in March, the person you met at a conference, the half-formed idea from a Tuesday walk, sits scattered across notes apps, chat logs, and memory. The models kept getting smarter and my context kept evaporating. AI is only as useful as what you can put in front of it, and I could not put my own life in front of it.

## Approach

I built a knowledge operating system and made the AI a first-class citizen of it.

The core is an MCP server that gives any AI agent direct, structured access to my knowledge base. Four tools cover the surface: semantic search, recent entries, stats, and writes with auto-generated embeddings. Search runs as cosine similarity over pgvector, so an agent can ask "what do I know about positioning?" and get back the actual atoms of knowledge I have collected, not a generic answer.

Underneath, four tables hold the load: captures, people, projects, and ideas. Daily pipelines keep it alive. Capture feeds raw material in, a processing pass extracts durable concepts and cross-links them into a wiki layer, and session hooks summarize each working session so nothing done today is lost by next week. The whole thing runs on Supabase and Postgres, boring infrastructure chosen on purpose.

## Outcome

The system runs my daily practice. Around 70 knowledge domains live in it, from AI agent architecture to copywriting psychology to tender pricing, and every working session reads from and writes back to that base. When I research something once, it stays researched.

The sharpest proof: it carried a full strategy exercise end to end. Research, positioning, drafting, and review all ran against the same knowledge base, with the system supplying context at each step. The result read like the work of someone with a research team behind them. The team was the system.

This is also the project I point to when someone asks whether I can really build these things. The system is the demo. I use it every day, and it holds.

## What I'd Do Differently

Capture is the easy half. I built ingestion first and let extraction quality lag behind, so for a while the system knew a lot and understood less. Routing and extraction discipline, deciding where a piece of knowledge belongs and compressing it into something retrievable, turned out to be the real engineering problem. I would design that layer first, not bolt it on after volume arrived.
