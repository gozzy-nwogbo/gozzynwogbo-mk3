---
title: "Obscura"
philosophy: "A beautiful ad that does not land its message is a beautiful failure."
description: "An automated ad pipeline: a product blurb becomes a multi-scene storyboard, drift-free character renders, and a scored MP4, gated by an audit that measures whether a cold viewer gets the message."
domain: "content"
geography: "Toronto, Canada"
status: "Active"
datePublished: 2026-05-01
dateModified: 2026-07-01
technologies: ["Python", "Seedance", "fal.ai", "FFmpeg", "Claude"]
schemaType: "SoftwareApplication"
applicationCategory: "MultimediaApplication"
metrics:
  - label: "Pipeline"
    value: "Blurb to finished ad video, end to end"
  - label: "Consistency"
    value: "Held face and wardrobe across every scene"
  - label: "Quality gate"
    value: "Ad-comprehension audit before anything ships"
featured: true
sortOrder: 2
---

## Problem

AI video generation demos beautifully and ships terribly. Every generated clip looks impressive on its own, and then you put four of them together and the main character has changed shirts twice and grown a different face. Worse, the output tends to read as a pretty film rather than an ad. A cold viewer watches it and cannot tell you what the product was. The gap between "generates video" and "produces a usable ad" is where most of the real work lives.

## Approach

I built the pipeline that closes that gap, stage by stage.

It starts with a product blurb. The system expands it into a multi-scene storyboard with varied contexts and human presence, the shape a real commercial has, then renders each scene with the character pinned: face and wardrobe are registered once and held across every render, so scene four stars the same person as scene one. The scenes are stitched and scored into a single MP4.

Then comes the part most pipelines skip. Before anything counts as done, an ad-comprehension audit plays cold viewer: does someone with zero context understand what is being sold and what to do about it? Output that fails the audit goes back, not out. The pipeline defers to explicit creative input where it exists and fills gaps where it does not, so a partial storyboard comes out completed rather than flattened.

## Outcome

Shipped and merged, end to end. A blurb goes in, a scored, character-consistent, audit-gated ad video comes out.

Building it also produced something the demos never show: a working map of where these models actually fail. Mirror shots desync, brand text doubles when a product rotates, dense prompts hit far less often than tight ones. Each failure is documented and routed around in the pipeline itself. That knowledge is the moat. Anyone can call a video model; the system knows what the model will get wrong before it does.

## What I'd Do Differently

I spent the early weeks chasing visual polish when the harder problem was comprehension. A beautiful ad that does not land its message is a beautiful failure. The comprehension audit came late and should have been the first thing built, because it changes what every upstream stage optimizes for.
