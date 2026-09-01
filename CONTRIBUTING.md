# Contributing

Found a bug or a gap in a published lab? Issues and PRs are welcome. Have a lab that fits one of the workshop tracks? Reach out before opening a PR.

---

## Resource tagging standard

Every AWS resource created in a workshop must carry the tags below. The nightly cleanup workflow reads them to decide what to delete, so untagged resources are treated as disposable.

| Tag          | Example         | Purpose                                       |
| ------------ | --------------- | --------------------------------------------- |
| `workshop`   | `aws-data-lake` | Which lab the resource belongs to             |
| `date`       | `26-Jul-2026`   | When the cohort ran (format: `dd-mmm-yyyy`)   |
| `autodelete` | `true`          | Set to `false` to protect a resource (default is `true`) |

All Terraform modules in this repo apply these tags automatically via `local.common_tags` (see [`terraform/tags.tf`](terraform/tags.tf)). Resources created manually (via console or CLI) must be tagged manually.

**To protect a resource from nightly deletion, set `autodelete = false`.** Everything else is deleted at 3 AM EST by [`tools/nightly-cleanup.py`](tools/nightly-cleanup.py).
