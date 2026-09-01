# Group1.Luis — Full-Stack Banking Application

A role-aware banking application built for the BeCloudReady Full-Stack on AWS
workshop. Customers manage their own accounts, tellers serve customers, and
admins govern the whole institution — every rule enforced server-side.

| | |
|---|---|
| **Group** | Group1.Luis |
| **Frontend** | React 19 + Vite + Tailwind CSS 4 + React Router 7 |
| **Backend** | FastAPI + SQLAlchemy 2 + Alembic |
| **Database** | PostgreSQL (psycopg 3) |
| **Auth** | JWT bearer tokens (HS256), hashed passwords |
| **Tests** | pytest — 9 suites covering auth, roles, accounts, transfers |

---

## USP — Three-Tier Role-Based Access Control

Most submissions stop at "you can log in." Ours makes **who you are** decide
what the API will even answer, and proves it with tests.

Three roles (`data/enums.py`) — `customer`, `teller`, `admin` — drive a single
authorization module, `core/permissions.py`, that the routers consult before
touching data. The rules are not scattered through endpoint bodies; they are
named predicates in one file, which is why they can be tested in isolation.

| Capability | Customer | Teller | Admin |
|---|:--:|:--:|:--:|
| View own profile / own account | yes | yes | yes |
| List users | no | customers only | everyone |
| Create users | no | customers only | any role |
| Update users | self only | customers | anyone |
| Change a user's **role** | no | no | yes |
| Delete users | no | no | yes |
| List / create accounts | no | yes | yes |
| View any account | own only | yes | yes |
| Freeze / unfreeze an account | no | no | yes |

Three design decisions worth calling out:

1. **Tellers can never mint staff.** `can_create_user` lets a teller create
   customers and nothing else, so privilege cannot be escalated sideways.
2. **Role changes never ride along with a profile edit.** `PATCH /users/{id}`
   cannot alter `role`; that requires the separate, admin-only
   `PATCH /users/{id}/role`. A compromised teller session cannot promote itself.
3. **Listings are filtered, not merely gated.** `visible_roles()` narrows what a
   teller sees to customers only — a teller never learns the admin roster.

The frontend mirrors this rather than inventing its own rules: `AuthContext.jsx`
holds the decoded token, `ProtectedRoute.jsx` gates navigation, and each role
lands on its own dashboard — `CustomerDashboard`, `TellerDashboard`,
`AdminDashboard`. The UI hides what you may not do; the API refuses it
regardless. Client-side checks are convenience, never the boundary.

Backing tests: `tests/test_users_role.py`, `tests/test_accounts_freeze.py`,
`tests/test_auth.py`, `tests/test_password_reset.py`.

---

## Architecture

```
Browser
   |
   |  React 19 SPA (Vite dev server :5173)
   |  src/api/api.js attaches  Authorization: Bearer <JWT>
   v
FastAPI (uvicorn :8000)
   |  CORS -> localhost:5173, localhost:3000
   |
   |-- core/security.py      hash + verify passwords, sign + decode JWT
   |-- core/dependencies.py  get_current_user / require_staff / require_admin
   |-- core/permissions.py   role predicates  <- the USP lives here
   |
   |-- routers/       auth | users | accounts | transactions | transfers
   |-- models/        SQLAlchemy ORM: User | Account | Transaction | Transfer
   |-- repositories/  query layer
   v
PostgreSQL — schema managed by Alembic migrations
```

The layering is deliberate: routers handle HTTP, `permissions.py` decides
authority, repositories talk to the database. Swapping the storage layer would
not touch the authorization rules.

### Repository layout

```
Group1.Luis/
├── backend/
│   ├── main.py                  FastAPI app + CORS + router registration
│   ├── core/                    security, dependencies, permissions, config
│   ├── models/                  SQLAlchemy ORM models
│   ├── schemas/                 Pydantic request/response models
│   ├── repositories/            data-access helpers
│   ├── routers/                 API endpoints
│   ├── alembic/versions/        4 migrations (users, auth fields, accounts…)
│   ├── data/seed.py             fixture loader
│   └── tests/                   pytest suites
└── frontend/
    └── src/
        ├── api/api.js           fetch wrapper, token injection
        ├── context/AuthContext.jsx
        ├── components/          Navbar, Button, Input, Card, Table,
        │                        ProtectedRoute, Layout, DashboardSidebar
        ├── features/            auth | accounts | transactions | transfers
        │                        | teller | admin
        └── pages/               Customer / Teller / Admin dashboards, auth pages
```

---

## Running It Locally

Prerequisites: Python 3.10+, Node.js 18+, PostgreSQL.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1        # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Create the database:

```sql
CREATE DATABASE bank;
```

Copy `.env.example` to `.env` and fill it in:

```ini
DATABASE_URL=postgresql+psycopg://postgres:yourpassword@localhost:5432/bank
JWT_SECRET_KEY=<generate your own>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Generate a real secret — the app **refuses to start** if `JWT_SECRET_KEY` is
unset or left at the placeholder:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

Special characters in the database password must be percent-encoded
(`@` → `%40`, `!` → `%21`, `#` → `%23`). Then build the schema, load fixtures,
and run:

```powershell
python -m alembic upgrade head
python -m data.seed
uvicorn main:app --reload
```

API on `http://localhost:8000`, interactive docs at `/docs`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

App on `http://localhost:5173`. Point it at the API with `VITE_API_URL` in
`frontend/.env` if the backend is not on the default port.

### Tests

```powershell
cd backend
pytest
```

---

## API Reference

All authenticated routes expect `Authorization: Bearer <token>`.

### Auth — `/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Register; returns a JWT |
| POST | `/auth/login` | public | Log in; returns a JWT |
| GET | `/auth/me` | any user | Current user's profile |
| POST | `/auth/forgot-password` | public | Request a reset token |
| POST | `/auth/reset-password` | public | Redeem a reset token |

### Users — `/users`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/users` | staff | List users, filtered by `visible_roles()`; supports `role`, `limit`, `offset` |
| GET | `/users/{id}` | self or permitted | Fetch one user |
| POST | `/users` | admin, or teller → customer | Create a user |
| PATCH | `/users/{id}` | self, teller → customer, admin | Update profile (never `role`) |
| PATCH | `/users/{id}/role` | **admin only** | Change a user's role |
| DELETE | `/users/{id}` | **admin only** | Delete a user |

### Accounts — `/accounts`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/accounts` | staff | List all accounts |
| GET | `/accounts/{id}` | owner or staff | Fetch one account |
| POST | `/accounts` | staff | Open an account for a user |
| PATCH | `/accounts/{id}/freeze` | **admin only** | Freeze an account (rejects closed ones) |
| PATCH | `/accounts/{id}/unfreeze` | **admin only** | Unfreeze an account |

### Transactions & Transfers

| Method | Path | Description |
|---|---|---|
| POST | `/accounts/{id}/deposit` | Deposit into an account |
| POST | `/accounts/{id}/withdraw` | Withdraw (balance and account status checked) |
| GET | `/accounts/{id}/transactions` | Transaction history |
| POST | `/transfers` | Move funds between two accounts |

Transfers validate that both accounts exist, both are `active`, source and
destination differ, the amount is positive, and funds are sufficient — all
before any balance moves.

---

## Known Limitations

Stated plainly rather than papered over:

- **Transactions and transfers are not yet behind the auth dependency.** The
  `users` and `accounts` routers enforce roles; `transactions.py` and
  `transfers.py` still take only `get_db`. Wiring them to `get_current_user`
  plus an ownership check is the next task.
- `main.py` registers `users.router` twice — harmless, but redundant.
- `routers/test.py` is a development scratch router and would be removed before
  any real deployment.
- No AWS deployment yet: no Terraform, Lambda packaging, or CI/CD pipeline. The
  application runs locally against PostgreSQL.

---

## Team

Group1.Luis. Work was split by feature area — shared UI foundation and
integration, auth, accounts, transactions and transfers, and the teller and
admin surfaces — with shared components in `frontend/src/components/` reused
across features to keep the design consistent and merge conflicts rare.
