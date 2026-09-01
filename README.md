# Cloud, Data & AI Workshops — AWS, Databricks Genie, AI Agents, LLMOps

Hands-on workshop labs built by [BeCloudReady](https://becloudready.com/workshops) for engineering and analytics teams. Each lab is self-contained, with pre-scoped IAM permissions, step-by-step walkthroughs, and sample data included. Drop into a workshop or run independently.

---

## Workshops

| Workshop                                                                         | What you build                                                                                                                                                               | What you will be able to do                                                                                                                           | Stack                                                                        |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`databricks-genie-ai-agents/`](workshops/databricks-genie-ai-agents/) | A governed conversational AI agent on Databricks AI/BI Genie: LLM fundamentals in SQL, Genie space, Knowledge Store curation, benchmarks                                     | Stand up a Genie agent your stakeholders can trust — curate it, benchmark it, and govern it with Unity Catalog. No Python required for the core track | Databricks, AI/BI Genie, Unity Catalog, SQL                                  |
| [`aws-data-lake/`](workshops/aws-data-lake/)                           | End-to-end data lake across 6 labs: raw ingestion, ETL, governance, CDC, and analytics                                                                                       | Design and operate the full AWS data engineering stack, from raw S3 files to a governed query layer in Athena and Redshift                            | S3, Glue, Athena, Lake Formation, Redshift, DMS, OpenSearch                  |
| [`fullstack-aws/`](workshops/fullstack-aws/)                           | Full-stack app on AWS across 7 chapters and 4 deployable projects: React, FastAPI, MongoDB, Terraform, and CI/CD                                                             | Ship a production-ready app on AWS end-to-end, including infrastructure and automated deployment                                                      | React, FastAPI, Lambda, S3, DynamoDB, API Gateway, Terraform, GitHub Actions |
| [`llmops/`](workshops/llmops/)                                         | Deploy, observe, and route production LLM workloads on a GPU instance: vLLM serving, Prometheus/Grafana dashboards, and LiteLLM gateway with virtual keys and spend tracking | Run LLM inference in-house with full observability and cost controls, without depending on managed APIs                                               | vLLM, LiteLLM, Prometheus, Grafana, DCGM, Docker, Ansible                    |

Each workshop's README carries the full lab-by-lab breakdown. Related open source: [db-agent](https://github.com/db-agent/db-agent) — text-to-SQL AI agent with cross-platform memory, S3 Vectors, and knowledge files (AAAI-25 workshop project).

---

## About

[BeCloudReady](https://becloudready.com) is a Databricks Registered Partner that builds and delivers cloud workshops for engineering teams. We run community workshops at [TorontoAI](https://toronto-ai.org) (10K+ members).

|                             |                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Cloud Workshops**         | Per-student AWS / Azure / GCP / Databricks sandboxes, region-locked, namespace-scoped, teardown-clean        |
| **AI & GPU Labs**           | H100 / A100 cohorts on neo-cloud (Lambda Labs, Shadeform, RunPod): 30-70% cheaper than hyperscaler on-demand |
| **Sales Demo Environments** | Reproducible demo stacks for SE teams and partner programs                                                   |

**Need a workshop for your team?**
→ [becloudready.com/workshops](https://becloudready.com/workshops) · [Book a call](https://calendly.com/kchandank/30-mins-meeting)

---

## Contributing

Found a bug or a gap in a published lab? Issues and PRs are welcome. Have a lab that fits one of the tracks above? Reach out before opening a PR. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the resource-tagging standard every lab must follow.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).
