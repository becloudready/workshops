# BeCloudReady Workshop Labs

Lab content from the workshops BeCloudReady delivers to client teams.

## Workshop catalog

| Workshop | Audience | What the team leaves with | Stack |
| --- | --- | --- | --- |
| [Databricks Genie AI Agents](workshops/databricks-genie-ai-agents/) | Data analysts and analytics teams | A Genie agent on their own data, governed through Unity Catalog and benchmarked | Databricks, AI/BI Genie, Unity Catalog, SQL |
| [AWS Data Lake](workshops/aws-data-lake/) | Data engineers and data platform teams | A working data lake, from raw S3 files to a governed query layer | S3, Glue, Athena, Lake Formation, Redshift Serverless, DMS, OpenSearch, CloudWatch |
| [Full-Stack AWS](workshops/fullstack-aws/) | Application engineers | A deployed application on AWS with its Terraform and CI/CD pipeline | React, FastAPI, MongoDB, Lambda, S3, DynamoDB, API Gateway, Terraform, GitHub Actions |
| [Text-to-SQL on Databricks](workshops/databricks-db-agent-lakebase/) | Data platform teams evaluating conversational analytics | A text-to-SQL path running on their own gold tables, with no managed model serving | Lakebase Postgres, Unity Catalog, Delta, vLLM |

---

## Databricks Genie AI Agents

**Outcome:** a Genie agent governed through Unity Catalog, with benchmarked accuracy.

Analysts work in SQL, not Python. The workshop builds a Genie space, curates it with a Knowledge Store, and tests it against a benchmark set. A fundamentals track covers structured output, tool use, the agentic loop, and MCP.

[Workshop README](workshops/databricks-genie-ai-agents/)

## AWS Data Lake

**Outcome:** a working data lake, from raw S3 files to a governed table in Athena or Redshift.

Seven labs: the lake, Lambda ingestion, Lake Formation governance, Redshift Serverless, change data capture, OpenSearch, CloudWatch. Each lab carries its own dataset and can be run on its own.

[Workshop README](workshops/aws-data-lake/)

## Full-Stack AWS

**Outcome:** a deployed application on AWS with its Terraform and CI/CD pipeline.

Seven chapters: object-oriented design, a REST backend with CRUD and filtering, testing, authentication with role-based access, and a React frontend. Four deployable projects follow, each with a dataset, an exercise brief, and a trainer answer key. Sized for a multi-day engagement and cut down per cohort.

[Workshop README](workshops/fullstack-aws/)

## Text-to-SQL on Databricks

**Outcome:** a text-to-SQL setup on your own gold tables, with no managed model serving.

Lakebase Postgres is the OLTP store. Unity Catalog holds gold tables built as Delta from the same data. A self-hosted vLLM endpoint serves an OpenAI-compatible API. This repo provisions the data and infrastructure. The agent itself is [db-agent](https://github.com/db-agent/db-agent).

[Workshop README](workshops/databricks-db-agent-lakebase/)

---

## How labs are provisioned

Each student gets their own cloud sandbox, namespace-scoped and region-locked. Infrastructure and permissions are in place before the session starts. Resources are tagged at creation, and a nightly job deletes them afterwards. See [`docs/delivery.md`](docs/delivery.md) for the tag schema, the cleanup job, and the opt-out.

## About BeCloudReady

BeCloudReady delivers hands-on technical workshops to enterprise engineering and analytics teams.
We are a Databricks Registered Partner.
We also run community workshops at [TorontoAI](https://toronto-ai.org?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=root-readme).

## Contact

[becloudready.com](https://becloudready.com/workshops?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=root-readme) · [Book a call](https://calendly.com/kchandank/30-mins-meeting?utm_source=github&utm_medium=repo&utm_campaign=workshops&utm_content=root-readme)

---

Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md) · License: Apache 2.0, see [`LICENSE`](LICENSE).
