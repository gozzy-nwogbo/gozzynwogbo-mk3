---
title: "Tender Radar"
philosophy: "Most business AI does not need to be a chatbot."
description: "A hands-off cron agent that reads new federal tenders, decides can-bid or cannot-bid against a company profile with the single decisive clause, and emits a weekly digest."
domain: "automation"
geography: "Canada"
status: "Active"
datePublished: 2026-06-01
dateModified: 2026-07-01
technologies: ["Python", "Claude", "CanadaBuys data", "Cron"]
schemaType: "SoftwareApplication"
applicationCategory: "BusinessApplication"
metrics:
  - label: "Live feed measured"
    value: "918 open federal notices at last count"
  - label: "Decision output"
    value: "Can-bid or cannot-bid, with the single decisive clause"
  - label: "Operation"
    value: "Fully hands-off, weekly digest"
featured: true
sortOrder: 4
---

## Problem

Federal procurement is a firehose. When I measured the live feed there were 918 open federal notices, refreshing constantly. Somewhere in that stream sit the handful of tenders a given company could actually win, buried under hundreds it cannot touch because of a security clearance requirement, a mandatory certification, or a regional restriction on page 40. A human screening that feed does one of two things: skims and misses, or reads properly and burns the week.

## Approach

Tender Radar reads the feed so nobody has to. A cron agent wakes on schedule, pulls new notices, and scores each one against a structured company profile: what the company does, where it operates, what certifications it holds.

The design choice that matters is the shape of the output. The agent does not summarize tenders. It renders a verdict, can-bid or cannot-bid, and cites the single decisive clause that made the call. A cannot-bid verdict names the exact requirement that kills the bid, so a human can override in seconds if the profile is stale. No verdict asks anyone to read the tender to check the reasoning.

Everything lands in a weekly digest. That format is deliberate. A screening tool you have to visit becomes a screening tool you stop visiting; a digest that arrives on its own becomes part of the week. The digest is also the distribution: it is the artifact you forward to someone who asks what the system does.

## Outcome

Automated bid-screening that runs without supervision. The feed gets read, the verdicts get made, the digest ships, and no one spends their week inside a procurement portal.

It also proves a pattern I keep coming back to: an agent with one narrow job, a structured profile to judge against, and a verdict format that a human can audit at a glance. Most business AI does not need to be a chatbot. It needs to be this.
