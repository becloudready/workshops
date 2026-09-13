# BeCloudReady Workshop Labs

This repository holds the lab content BeCloudReady delivers in client workshops, published so that teams evaluating us can read the material before an engagement begins.

## Workshop catalog

| Workshop | Audience | What the team leaves with | Stack |
| --- | --- | --- | --- |
| [Databricks Genie AI Agents](workshops/databricks-genie-ai-agents/) | Data analysts and analytics teams | A governed conversational agent built on their own data, curated through a Knowledge Store and benchmarked for accuracy. The core track requires no Python. | Databricks, AI/BI Genie, Unity Catalog, SQL |
| [AWS Data Lake](workshops/aws-data-lake/) | Data engineers and data platform teams | A working data lake across seven labs, from raw S3 ingestion to a governed query layer in Athena and Redshift. | S3, Glue, Athena, Lake Formation, Redshift Serverless, DMS, OpenSearch, CloudWatch |
| [Full-Stack AWS](workshops/fullstack-aws/) | Application engineers | A deployed application on AWS, with the Terraform that provisions it and the GitHub Actions pipeline that ships it. | React, FastAPI, MongoDB, Lambda, S3, DynamoDB, API Gateway, Terraform, GitHub Actions |
| [Text-to-SQL on Databricks](workshops/databricks-db-agent-lakebase/) | Data platform teams evaluating conversational analytics | A text-to-SQL path that runs against their own gold tables without managed model serving. | Lakebase Postgres, Unity Catalog, Delta, vLLM |

---

## Databricks Genie AI Agents

The team leaves with a Genie agent their stakeholders can trust, governed through Unity Catalog and benchmarked so its accuracy is a measured number rather than an impression.

Analysts start with how LLMs actually behave, working in SQL rather than Python. From there the workshop builds a Genie space, curates it with a Knowledge Store, and tests it against a benchmark set. A fundamentals track covers structured output, tool use, the agentic loop, and MCP for teams that want to go further.

[Workshop README](workshops/databricks-genie-ai-agents/)

## AWS Data Lake

The team leaves able to operate a data lake end to end, from a raw file landing in S3 through to a governed table an analyst can query.

Seven labs build the stack in order: the lake itself, Lambda ingestion, Lake Formation governance, Redshift Serverless, change data capture, OpenSearch, and CloudWatch monitoring. Each lab is self-contained and carries its own dataset, so a cohort can start at the lab that matches the gap.

[Workshop README](workshops/aws-data-lake/)

## Full-Stack AWS

The team leaves with a deployed application and the pipeline that ships it, having built both rather than watched a demo.

Seven chapters cover object-oriented design, a REST backend with CRUD and filtering, testing, authentication with role-based access, and a React frontend wired to that backend. Four deployable projects follow, each with a dataset, an exercise brief, and a trainer answer key. The material is sized for a multi-day engagement and is cut down per cohort.

[Workshop README](workshops/fullstack-aws/)

## Text-to-SQL on Databricks

The team leaves knowing whether conversational analytics is viable on their own data, having run it without buying managed model serving first.

The lab wires Lakebase Postgres as the OLTP store, Unity Catalog gold tables built as Delta from the same data, and a self-hosted vLLM endpoint exposing an OpenAI-compatible API. It provisions the data and infrastructure. The agent itself lives in [db-agent](https://github.com/db-agent/db-agent), our open-source text-to-SQL project.

[Workshop README](workshops/databricks-db-agent-lakebase/)

---

## How labs are provisioned

Each student works in their own cloud sandbox, namespace-scoped and region-locked, so one student cannot reach another's resources or spend outside an agreed region. Labs assume infrastructure is provisioned and permissions are granted before the room opens, which keeps students on the operational work instead of setup. Every resource created during a lab carries tags identifying the cohort, and a nightly job removes what is left behind. The tagging standard, the cleanup job, and the opt-out for resources that must survive are documented in [`docs/delivery.md`](docs/delivery.md).

## About BeCloudReady

BeCloudReady delivers hands-on technical workshops to enterprise engineering and analytics teams.
We are a Databricks Registered Partner.
We also run community workshops at [TorontoAI](https://toronto-ai.org?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=root-readme).

## Contact

[becloudready.com](https://becloudready.com/workshops?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=root-readme) · [Book a call](https://calendly.com/kchandank/30-mins-meeting?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=root-readme)

---

Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md) · License: Apache 2.0, see [`LICENSE`](LICENSE).
