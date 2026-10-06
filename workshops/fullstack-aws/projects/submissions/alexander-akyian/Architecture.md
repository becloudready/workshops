# Architecture

## Overview

```mermaid
flowchart LR
    U[Browser] -->|page load| S3[Amazon S3<br/>static website<br/>React build]
    U -->|HTTPS JSON API calls| APIGW[API Gateway<br/>HTTP API<br/>ANY /{proxy+}]
    APIGW --> L[AWS Lambda<br/>Python 3.12<br/>lambda_function.py]
    L -->|pymongo layer| M[(MongoDB Atlas<br/>noticeboard_db)]
```

```
 Browser
   │
   ├── loads the React app ──────────▶ Amazon S3 (static website hosting)
   │
   └── fetch() JSON requests ─────────▶ API Gateway (HTTP API, CORS enabled)
                                              │  ANY /{proxy+}
                                              ▼
                                        AWS Lambda (Python 3.12)
                                              │  MONGO_URI env var, pymongo layer
                                              ▼
                                        MongoDB Atlas (M0, AWS us-east-1)
```

## Components

| Component | Service | Responsibility |
|---|---|---|
| Frontend | React + Vite, hosted on S3 | Three views: Overview (Training Manager), People (HR), Trainee view |
| API | API Gateway HTTP API | Public HTTPS entry point, CORS, forwards every path to Lambda |
| Backend | Lambda `NoticeBoardBackendAA` | Routing, validation, business rules, notification fan-out, dashboard aggregation |
| Dependencies | Lambda layer `pymongo-aa` | pymongo + dnspython for Python 3.12 / x86_64 |
| Database | MongoDB Atlas | Stores cohorts, trainees, plans, reports, notifications, notices |

## Request flow (example: assigning a plan to a cohort)

1. The manager fills in **Assign a plan** and the browser sends `POST /plans` with `{title, due_date, cohort_id}`.
2. API Gateway matches `ANY /{proxy+}` and invokes the Lambda with the request.
3. Lambda reads `rawPath` (`/plans`) and the HTTP method, validates the body, checks the cohort exists and saves the plan.
4. Lambda finds every trainee in that cohort and inserts one notification per trainee.
5. Lambda returns `201` with the plan and how many trainees were notified; the frontend shows a confirmation and reloads.

## Data model (MongoDB collections)

| Collection | Key fields | Notes |
|---|---|---|
| `cohorts` | `name`, `name_lower`, `created_at` | `name_lower` prevents duplicate cohort names |
| `trainees` | `name`, `email`, `cohort_id`, `created_at` | `email` is stored lowercase and must be unique; `cohort_id` empty = solo track |
| `plans` | `title`, `description`, `due_date`, `cohort_id` or `trainee_id`, `assigned_to` | Exactly one target: a cohort or a single trainee |
| `reports` | `trainee_id`, `plan_id`, `progress` (0–100), `note`, `created_at` | Only accepted for plans assigned to that trainee |
| `notifications` | `trainee_id`, `message`, `type`, `ref_id`, `read`, `created_at` | Created automatically; `type` is welcome, plan or notice |
| `notices` | `title`, `content`, `created_at` | Announcements to everyone |

A trainee's plans are the plans assigned to them directly plus the plans assigned to their cohort.

## Dashboard status rules

For each trainee, Lambda takes the latest report per plan and calculates average progress across their plans.

| Status | Rule |
|---|---|
| No plans | Nothing assigned |
| Overdue | Any plan past its due date with progress under 100% |
| Done | Average progress is 100% |
| No updates | Has plans but has never submitted a report |
| On track | Everything else |

## Design decisions

- **One Lambda, one catch-all route.** All routes live in `lambda_function.py` and API Gateway forwards everything through `ANY /{proxy+}`. Adding a feature means changing one file instead of creating new routes and integrations in the console.
- **Notifications as records, not push messages.** Notifications are written to MongoDB when something happens and read by the trainee view. This keeps the stack simple and free of extra services; email or SMS could be added later with Amazon SNS or SES.
- **Validation in the backend.** Duplicate emails, invalid IDs, plans with no or two targets, and reports on plans that aren't assigned are all rejected by Lambda with a clear message, so the data stays clean no matter which client calls the API.
- **Connection reuse.** The MongoDB client is created once per Lambda container and reused across invocations to avoid reconnecting on every request.

## Security notes

- The MongoDB connection string is stored only in the Lambda environment variable `MONGO_URI`; it is never in the frontend or the repository.
- The S3 bucket is public-read for website hosting and contains only the built frontend (HTML, CSS, JS).
- The Atlas IP access list allows `0.0.0.0/0` because Lambda has no fixed IP without a VPC and NAT gateway; access is still protected by the database username and password.
- There is no authentication yet. Next steps would be Amazon Cognito for sign-in with HR, manager and trainee roles, CloudFront in front of S3 for HTTPS, and a tighter Atlas network setup.
