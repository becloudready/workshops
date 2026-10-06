# Training Tracker (Notice Board, Friday Weekend Challenge)

**Student:** Alexander Akyian ([@Zander-1k](https://github.com/Zander-1k))
**Cohort:** Full-Stack AWS, 28-Sep-2026

A full-stack platform for an EdTech organization that replaces scattered 1:1 messages and Excel tracking with one place for onboarding trainees, assigning training plans, sending notifications, collecting progress reports and giving Training Managers a live overview.

| | |
|---|---|
| Live app | http://noticeboard-alexander-akyian.s3-website-us-east-1.amazonaws.com |
| API base URL | https://bnoe4svwb9.execute-api.us-east-1.amazonaws.com |
| Example endpoint | https://bnoe4svwb9.execute-api.us-east-1.amazonaws.com/dashboard |

## How it answers the business requirement

| Requirement / pain point | What the app does |
|---|---|
| HR onboards new trainees | **People** tab: add trainees with name, email and cohort |
| Untracked or duplicated trainees | Email is unique; adding the same person twice is rejected with a clear error |
| Plans for cohorts, plus occasional solo tracks | Cohorts group trainees; a plan is assigned to a whole cohort or to one trainee |
| System notifies trainees of updates | Notifications are created automatically on onboarding, new plans and announcements |
| Trainees submit progress reports | **Trainee view**: pick a plan, set progress (0–100%), add a note |
| Delayed updates, no managerial oversight | **Overview** tab: every trainee's progress, last report and status (on track, no updates, overdue, done) |
| Scattered 1:1 communication | Announcements go to everyone at once and appear on the notice board |

## Tech stack

- **Frontend:** React (Vite), hosted as a static website on **Amazon S3**
- **API:** **Amazon API Gateway** (HTTP API) with a catch-all `ANY /{proxy+}` route
- **Backend:** one **AWS Lambda** function (Python 3.12) using `pymongo` from a Lambda layer
- **Database:** **MongoDB Atlas** (M0 free cluster on AWS, us-east-1)

See [Architecture.md](Architecture.md) for the diagram, data model and design decisions.

## Folder contents

```
alexander-akyian/
├── frontend/                     React app (src/App.jsx, App.css, index.css)
├── backend/
│   ├── lambda_function.py        All API routes in one Lambda handler
│   └── requirements.txt          pymongo
├── postman/
│   └── TrainingTracker.postman_collection.json
├── ReadMe.md
└── Architecture.md
```

## API

All responses are JSON. Errors come back as `{"error": "message"}` with a 4xx/5xx status.

| Method | Path | Body / query | Purpose |
|---|---|---|---|
| GET | `/cohorts` | | List cohorts |
| POST | `/cohorts` | `{name}` | Create a cohort (names are unique) |
| DELETE | `/cohorts/{id}` | | Delete a cohort; its trainees move to solo track |
| GET | `/trainees` | `?cohort_id=` optional | List trainees |
| POST | `/trainees` | `{name, email, cohort_id?}` | Onboard a trainee (email must be unique) |
| PUT | `/trainees/{id}` | `{name?, email?, cohort_id?}` | Update a trainee |
| DELETE | `/trainees/{id}` | | Remove a trainee |
| GET | `/plans` | `?trainee_id=` optional | All plans, or one trainee's plans (cohort + solo) |
| POST | `/plans` | `{title, description?, due_date, cohort_id \| trainee_id}` | Assign a plan and notify the trainees it targets |
| DELETE | `/plans/{id}` | | Delete a plan and its reports |
| GET | `/reports` | `?trainee_id=` or `?plan_id=` | List progress reports |
| POST | `/reports` | `{trainee_id, plan_id, progress, note?}` | Submit a progress report (plan must be assigned to that trainee) |
| GET | `/notifications` | `?trainee_id=` required | A trainee's notifications, newest first |
| PUT | `/notifications/{id}/read` | | Mark a notification as read |
| GET | `/notices` | | Announcements |
| POST | `/notices` | `{title, content?}` | Post an announcement and notify all trainees |
| DELETE | `/notices/{id}` | | Delete an announcement |
| GET | `/dashboard` | | One row per trainee with progress and status, plus totals |

A ready-to-import Postman collection is in `postman/`. Its `baseUrl` variable points at the live API.

## Run the frontend locally

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The API URL is set at the top of `frontend/src/App.jsx` (`const API = ...`).

## Deployment (AWS console)

1. **MongoDB Atlas:** create an M0 cluster on AWS us-east-1, a database user, and an IP access list entry `0.0.0.0/0` so Lambda can connect.
2. **Lambda layer:** package pymongo for Python 3.12 / x86_64 (`pip install pymongo -t python/`, zip the `python` folder) and create a layer from it.
3. **Lambda:** create a Python 3.12 function, paste `backend/lambda_function.py`, attach the layer, add the environment variable `MONGO_URI` (the Atlas connection string), and raise the timeout to 30 seconds and memory to 256 MB.
4. **API Gateway:** create an HTTP API with a Lambda integration, add the route `ANY /{proxy+}`, and configure CORS (origin `*`, headers `*`, methods GET/POST/PUT/DELETE/OPTIONS).
5. **Frontend:** set the API URL in `App.jsx`, run `npm run build`, create an S3 bucket with static website hosting (index and error document `index.html`), add a public-read bucket policy, and upload the contents of `dist/`.

## Notes

- No credentials are committed. The MongoDB connection string lives only in the Lambda environment variable `MONGO_URI`.
- There is no login yet; the role tabs (Overview, People, Trainee view) simulate the three user types. Adding authentication (for example Amazon Cognito) is the natural next step.
