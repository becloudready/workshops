# NoticeBoardTracker API

FastAPI backend, layered: `api` (controllers) -> `services` (business logic) -> `repositories` (DB access) -> `models` (ORM). `schemas` holds the Pydantic request/response DTOs.

## Setup

1. `python -m venv .venv` then activate it (`.venv\Scripts\activate` on Windows, `source .venv/bin/activate` elsewhere)
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env`, fill in `DATABASE_URL` (from whoever set up Postgres) and a `JWT_SECRET_KEY`
4. `alembic upgrade head` to create the schema
5. `uvicorn app.main:app --reload`

Interactive API docs: `http://localhost:8000/docs`

## Layout

- `app/models` — SQLAlchemy ORM classes, the DB shape
- `app/schemas` — Pydantic DTOs, the API shape. All inherit `CamelModel` (`app/schemas/base.py`), so Python stays snake_case internally and JSON on the wire is camelCase automatically
- `app/repositories` — DB queries only, no business logic
- `app/services` — business logic; `TaskAssignmentFactory` is where a task fans out into one `task_assignments` row per trainee
- `app/api/v1` — routers, thin HTTP layer only
- `app/dependencies/auth.py` — JWT decode + role guards (`get_current_manager`, `get_current_trainee`)
- `alembic/versions` — migrations, the source of truth for DB structure; don't hand-edit the shared DB, add a migration instead

## Adding a migration

After changing a model in `app/models/`:

```
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

Review the generated file before committing — autogenerate doesn't always get constraints/enums exactly right.
