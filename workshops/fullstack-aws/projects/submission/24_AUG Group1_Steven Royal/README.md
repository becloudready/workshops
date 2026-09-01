# TrustPoint Bank — Group 1 Submission

**Group:** Group 1
**Member(s):** Steven Royal
**Group Tag:** student-royal

A full-stack banking application: React frontend, FastAPI backend, Postgres database (Supabase).

## What's here

| Folder | Description |
|--------|-------------|
| `frontend/` | React (Vite) app — accounts, transactions, transfers, role-based views (admin/teller/customer) |
| `backend/` | FastAPI app — REST API, SQLAlchemy models, Alembic migrations |

## Deployed stack

| Piece | Details |
|---|---|
| Frontend | Amazon S3 static hosting, served via CloudFront (`https://d1qjfrntye4ogy.cloudfront.net`) |
| API | AWS Lambda (FastAPI wrapped with Mangum) behind API Gateway HTTP API |
| Database | Supabase Postgres — schema managed via Alembic, Row-Level Security enabled |

```
Browser → CloudFront → S3 (static site)
Browser → API Gateway → Lambda (FastAPI via Mangum) → Supabase Postgres
```

No Docker, no Terraform — deployed via AWS Console (Lambda + API Gateway + S3 + CloudFront), matching the workshop's console-based deployment pattern.

## Running locally

**Backend:**
```
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

**Frontend:**
```
cd frontend
npm install
npm run dev
```
