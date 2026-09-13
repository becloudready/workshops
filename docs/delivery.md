# Delivery and lab provisioning

How lab environments are provisioned, tagged, and removed. Reference for instructors and lab contributors.

## Sandboxes

Each student gets their own cloud sandbox, namespace-scoped and region-locked. One student cannot reach another's resources or create resources outside the agreed region.

Infrastructure is provisioned and permissions granted before the session starts, so students perform only the operational steps. Anything that provisions infrastructure live runs as a demo, not a lab.

## Tagging

Every AWS resource created in a workshop carries these tags. The nightly cleanup job reads them, and untagged resources are treated as disposable.

| Tag | Example | Purpose |
| --- | --- | --- |
| `workshop` | `aws-data-lake` | Which lab the resource belongs to |
| `date` | `26-Jul-2026` | When the cohort ran, formatted `dd-mmm-yyyy` |
| `autodelete` | `true` | Set to `false` to keep a resource. Default is `true`. |

Terraform modules in this repo apply the tags through `local.common_tags`. See [`terraform/tags.tf`](../terraform/tags.tf). Resources created by hand must be tagged by hand.

## Nightly cleanup

[`tools/nightly-cleanup.py`](../tools/nightly-cleanup.py) runs at 03:00 EST and deletes tagged resources. Set `autodelete = false` to keep one.

Two limits:

- It only finds tagged resources. Student-created resources that skip the naming convention are missed and have to be caught by review.
- Never run an unscoped sweep. These accounts also hold instructor material, CloudTrail, and unrelated projects. Scope every run to a cohort and check the target list before deleting.
