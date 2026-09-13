# Contributing

This repository holds the lab content BeCloudReady delivers in client workshops. Changes are accepted, with the caveat that the material has to stay deliverable in a live room.

## Corrections

Corrections to published labs are welcome. A broken command, a stale console path, a dataset link that has moved, or a step that no longer matches the provider's UI are all worth reporting. Open an issue or a pull request with the workshop and lab named.

## New labs

Talk to us before writing one. A lab that does not fit an existing workshop track is unlikely to be merged, however good it is on its own terms.

A lab that is accepted has to:

Apply the resource tagging standard in [`docs/delivery.md`](docs/delivery.md), so cohort resources can be cleaned up afterwards.

Ship with its own dataset, or with a scripted way to fetch one. Labs that assume a dataset the reader has to find do not survive contact with a room.

State its prerequisites and the permissions it needs. Labs assume infrastructure is provisioned in advance, so anything requiring live provisioning is a demonstration rather than a lab.

## What we will not merge

Marketing content, links to unrelated training, and changes that rewrite a lab around a different product without discussion.

## Student submissions

Students in an active cohort follow the workflow in their own workshop ticket. Work goes in `workshops/<workshop>/projects/submission/<name>/`, never in shared files, and never includes credentials.
