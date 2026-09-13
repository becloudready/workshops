# Fundamentals — the notebook track

The engineer's path through the same concepts the workshop teaches analysts with
`ai_query()` and the Genie UI. Five self-paced Databricks notebooks — work through them in
order, each builds on the last:

| Module | Concept | Key question answered |
|--------|---------|----------------------|
| [01 — LLM Basics](01_llm_basics/) | LLM API call | How do I talk to a language model? |
| [02 — Structured Output](02_structured_output/) | Reliable JSON | How do I get back JSON I can actually use? |
| [03 — Tool Use](03_tool_use/) | Function calling | How does the LLM decide *what to do* instead of *what to say*? |
| [04 — Agentic Loop](04_agentic_loop/) | Retry & recover | How does an agent try again when something goes wrong? |
| [05 — MCP Server](05_mcp_server/) | Tool protocol | How do I expose my tools to *any* LLM client? |

Modules 03–05 build a from-scratch text-to-SQL agent — the hand-rolled version of what
Genie does for you in Part 2 of the workshop. Once you've built the loop yourself, you
understand every Genie failure mode.

## Setup (once)

1. A Databricks workspace — the [free tier](https://www.databricks.com/try) is enough.
2. An LLM endpoint: Databricks Model Serving (recommended, nothing extra to sign up for)
   or any OpenAI-compatible endpoint. Set it in the widgets at the top of each notebook.
3. Import this folder (Workspace → Import → Git or upload). No local install, no `.env`.

Modules 03–05 query the built-in `samples` catalog (`bakehouse`, `nyctaxi`, `tpch`, …) —
point the `CATALOG`/`SCHEMA` widgets anywhere and re-run.

> 🎙️ **Prefer learning live?** Free webinar series building db-agent's newest features
> (agent memory, S3 Vectors, knowledge files) with live Q&A —
> [register free](https://becloudready.com/webinar/db-agent?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=databricks-genie-fundamentals).
