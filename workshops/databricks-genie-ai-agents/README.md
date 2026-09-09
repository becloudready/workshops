# Building AI Agents with Databricks Genie — 1-Day Workshop

Hands-on workshop for data analysts and analytics teams: understand how LLMs actually
work, then build, curate, and govern a conversational AI agent on Databricks with
**AI/BI Genie**. The core track is SQL and the Databricks UI — no Python required.
Engineers who want the layer beneath the UI get a notebook track in the same folder.

## What we cover

**Part 1 — How LLMs work (just enough to trust one)**
- What an LLM does with your question: tokens, prompts, and why it hallucinates
- Getting reliable, structured answers instead of plausible text
- Hands-on in plain SQL with `ai_query()` — analysts never leave the SQL editor
- Engineer track: the same concepts as runnable notebooks in [`fundamentals/`](fundamentals/)

**Part 2 — Build and curate a Genie agent**
- Create a Genie space over governed Unity Catalog data and read the SQL it writes
- Find the first wrong answer on purpose — then fix it
- Knowledge Store curation: descriptions, synonyms, example SQL, instructions
- Benchmarks: question + expected-answer pairs, re-run after every change
- Governance: Unity Catalog permissions, sharing, monitoring, and user feedback

**Wrap — when Genie is enough, and when you need a custom agent**

## Prerequisites

Intermediate SQL. No Python or ML experience needed for the core track.

## Environment

Databricks workspace with serverless SQL warehouse, Unity Catalog, and Genie enabled.
Uses the built-in `samples` catalog — no data loading. Private runs add a track on the
customer's own governed tables.

## Folder layout

```
fundamentals/   ← notebook track: LLM basics → structured output → tool use
                  → agentic loop → MCP. Self-paced, runs on Databricks Free Edition.
labs/           ← Genie labs (SQL + UI walkthroughs)
setup/          ← environment checks and seed scripts
```

## Going deeper

The [db-agent](https://github.com/db-agent/db-agent) open-source project shows what Genie
abstracts away — a from-scratch text-to-SQL agent with memory, knowledge files, and
benchmarks — for teams that outgrow the managed tool.

---

Built by [BeCloudReady](https://becloudready.com?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=databricks-genie) — Databricks Registered Partner.
[Book this workshop](https://becloudready.com/workshops/databricks-genie?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=databricks-genie) ·
[Free webinar series](https://becloudready.com/webinar/db-agent?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=databricks-genie)
