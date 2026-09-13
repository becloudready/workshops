# Delivery and lab provisioning

Operations documentation for BeCloudReady cohorts. This describes how lab environments are provisioned, tagged, and torn down. It is reference material for instructors and for anyone contributing a lab, rather than something a workshop attendee needs to read.

## Sandbox model

Each student works in their own cloud sandbox. Accounts are namespace-scoped and region-locked, so one student cannot reach another student's resources or create resources outside the agreed region. Labs assume infrastructure is provisioned and permissions are granted before the session starts, so students perform the operational action rather than the setup.

Anything that provisions infrastructure live is run as a demonstration, not as a lab. A lab that depends on live provisioning turns into a troubleshooting session in a mixed-skill room.

## Resource tagging standard

Every AWS resource created in a workshop must carry the tags below. The nightly cleanup job reads them to decide what to delete, so untagged resources are treated as disposable.

| Tag | Example | Purpose |
| --- | --- | --- |
| `workshop` | `aws-data-lake` | Which lab the resource belongs to |
| `date` | `26-Jul-2026` | When the cohort ran, formatted `dd-mmm-yyyy` |
| `autodelete` | `true` | Set to `false` to protect a resource. Default is `true`. |

All Terraform modules in this repository apply these tags automatically through `local.common_tags`. See [`terraform/tags.tf`](../terraform/tags.tf).

Resources created by hand, through the console or the CLI, must be tagged by hand. In practice this is where cleanup misses things, because student-created resources often do not follow the naming convention either.

## Nightly cleanup

[`tools/nightly-cleanup.py`](../tools/nightly-cleanup.py) runs at 03:00 EST and deletes tagged resources that are no longer needed.

To protect a resource from deletion, set `autodelete = false`. Everything else carrying workshop tags is removed.

Two limits worth knowing before relying on it:

Tag-driven cleanup only finds resources that carry the tags. Resources a student names or creates outside the convention are missed, and have to be caught by review.

Never run an unscoped sweep. Workshop accounts are shared with instructor material, CloudTrail, and unrelated project resources. Scope every cleanup run to a specific cohort and confirm the target list before deleting.

## Contributing a lab

A new lab must apply the tagging standard above, ship with its own dataset, and state its prerequisites. See [`CONTRIBUTING.md`](../CONTRIBUTING.md).
