---
title: "Healthcare Workflow Automation"
description: "Early-stage clinical workflow automation, piloted hands-on across three Nigerian clinics, cutting administrative documentation time by roughly a third."
domain: "healthcare"
geography: "Nigeria"
status: "Pilot Complete"
datePublished: 2025-06-01
dateModified: 2026-04-01
technologies: ["Python", "LangChain", "FastAPI", "PostgreSQL", "n8n"]
schemaType: "SoftwareApplication"
applicationCategory: "HealthApplication"
metrics:
  - label: "Administrative time"
    value: "Documentation time cut by roughly a third in pilot"
  - label: "Documentation"
    value: "Practitioners review and approve AI-drafted notes"
  - label: "Pilot facilities"
    value: "3 clinics across different specialties"
featured: true
sortOrder: 6
---

## Problem

Nigerian healthcare facilities, particularly small-to-medium clinics, lose a large share of practitioner time to administrative documentation rather than patient care. Most existing EMR solutions are designed for Western hospital systems and assume infrastructure (reliable internet, IT support, standardized workflows) that does not exist in most Nigerian clinical settings.

This was real early-stage building: a small pilot with real clinics, honest numbers, and the failure modes left in the write-up.

## Approach

Designed an AI-assisted workflow system that integrates with existing clinical processes rather than replacing them. The system uses LangChain for intelligent document processing and n8n for workflow orchestration, allowing non-technical clinic administrators to modify automation rules.

Key architecture decisions:
- LangChain agents for structured extraction from clinical notes (voice-to-text transcripts and handwritten intake forms)
- n8n workflow engine for configurable automation rules without code changes
- FastAPI backend with role-based access and audit logging
- Designed for low-bandwidth, intermittent-connectivity environments

The system ran as a pilot across three clinics with different specialties (general practice, maternal health, pediatrics) to validate generalizability.

## Outcome

Administrative documentation time fell by roughly a third across the three pilot clinics, measured against pre-implementation baselines. First-pass accuracy was high enough that practitioners review and approve AI-drafted notes rather than writing from scratch, which is the shift that actually returns time to patient care.

The n8n-based configuration layer proved critical. Each clinic customized workflows for their specific processes without requiring developer intervention.

## What Went Wrong

Voice-to-text accuracy in clinical settings with background noise was significantly worse than in testing. Had to add a manual correction step that partially offset the efficiency gains. The LangChain extraction pipeline also struggled with mixed-language notes (English-Yoruba, English-Igbo), which is standard in Nigerian clinical documentation.

## What I'd Do Differently

Invest in domain-specific fine-tuning for the NLP components rather than relying on general-purpose models with prompt engineering. The mixed-language problem is fundamental to Nigerian healthcare and needs a purpose-built solution, not a workaround. I'd also run a longer baseline measurement period before the pilot to get more reliable efficiency comparisons.
