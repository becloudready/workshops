# Notice Board – Joseph Hilte

Solo submission for the **02-notice-board Friday Weekend Challenge** (fullstack-aws workshop).

A simple notice board where users can create, view, and delete notices. The React frontend is hosted on Amazon S3 and calls a Python Lambda function through API Gateway, which stores notices in MongoDB Atlas.

## Folder contents

| Path | What it is |
|------|------------|
| `backend/lambda_function.py` | Lambda handler with CRUD routes for `/notices` |
| `backend/requirements.txt` | Python dependency (`pymongo`), provided to Lambda via a layer |
| `frontend/` | Vite + React app (`src/App.jsx` is the main UI) |
| `postmanscript/` | Postman collection for testing all five API routes |
| `Architecture.md` | How the pieces connect |

## API routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/notices` | List all notices |
| GET | `/notices/{id}` | Get one notice |
| POST | `/notices` | Create a notice (`{ "title", "content" }`) |
| PUT | `/notices/{id}` | Update a notice |
| DELETE | `/notices/{id}` | Delete a notice |

## Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

Set `API_URL` in `frontend/src/App.jsx` to your API Gateway invoke URL first.

## Deploy

Followed `ASSIGNMENT-Version1-DeployWith_AwsGui.md` using the AWS web console:

1. MongoDB Atlas M0 cluster
2. Lambda `NoticeBoardBackend` (Python 3.12) with a `pymongo` layer
3. API Gateway HTTP API `NoticeBoardAPI` with CORS enabled
4. `npm run build`, then upload `dist/` to an S3 static website bucket

## Secrets

The MongoDB connection string is stored only in the Lambda environment variable `MONGO_URI`. No credentials are committed to this repo.
