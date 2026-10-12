# Notice Board: Javier Benitez

Full-Stack AWS cohort (28 Sep 2026), project 02: Notice Board.

A React frontend hosted on S3 talks to a Python Lambda backend through API Gateway, with notices stored in MongoDB Atlas. All infrastructure is defined in Terraform.

## Live deployment

| Piece | URL |
|-------|-----|
| Website (CloudFront, HTTPS) | https://d2vy7qfbeo1jb4.cloudfront.net |
| API (API Gateway) | https://du14hmw473.execute-api.us-east-1.amazonaws.com |

## Architecture

```
Browser
   │
   ├── page load ──▶ S3 static website (React build)
   │
   └── API calls ──▶ API Gateway (HTTP API) ──▶ Lambda (Python 3.12) ──▶ MongoDB Atlas
```

Note on the database: the original Tier 1 brief used PostgreSQL on EC2. This submission uses MongoDB Atlas instead, matching the current `ASSIGNMENT-Version1-DeployWith_AwsGui.md` guide in the project folder.

## Folder structure

```
javier-benitez/
├── backend/
│   ├── lambda_function.py     Lambda handler (all API routes)
│   └── requirements.txt       pymongo
├── frontend/                  React + Vite app
│   └── src/
│       ├── App.jsx            Notice board UI
│       └── api.js             API calls (reads VITE_API_URL)
├── terraform/
│   ├── main.tf                S3 website, IAM role, Lambda, API Gateway
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── build.py                   Packages backend/lambda.zip for Lambda
└── README.md
```

## API reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/notices` | List all notices, newest first |
| POST | `/notices` | Create a notice: `{ "name": "...", "message": "..." }` |
| DELETE | `/notices/{id}` | Delete a notice by id |

## Tier 1: manual deployment

### Prerequisites

- AWS CLI configured (`aws configure`) with your lab credentials
- Terraform 1.5 or newer
- Node.js 18 or newer
- Python 3
- A MongoDB Atlas cluster with Network Access set to `0.0.0.0/0` so Lambda can connect

### Steps

All commands run from this folder (`submissions/javier-benitez/`).

1. **Package the backend**

   ```bash
   python3 build.py
   ```

   This creates `backend/lambda.zip`. Dependencies are downloaded as Linux wheels, so the zip works on Lambda even when built on a Mac.

2. **Add your secrets**

   ```bash
   cp terraform/terraform.tfvars.example terraform/terraform.tfvars
   ```

   Open `terraform/terraform.tfvars` and paste your real MongoDB connection string. This file is gitignored.

3. **Deploy the infrastructure**

   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

   Type `yes` when asked. Copy the outputs at the end: `api_gateway_url`, `s3_bucket_name`, and `website_url`.

4. **Build the frontend with the API URL baked in**

   ```bash
   cd ../frontend
   npm install
   VITE_API_URL=<api_gateway_url> npm run build
   ```

5. **Upload the frontend to S3**

   ```bash
   aws s3 sync dist/ s3://<s3_bucket_name>/ --delete
   ```

6. **Open `website_url`** in your browser.

### Acceptance criteria

- [ ] Opening the S3 website URL shows the Notice Board UI
- [ ] Posting a notice saves it to the database and it appears on the page
- [ ] Deleting a notice removes it from the list
- [ ] All AWS resources are prefixed with `student-javier-benitez`

### Tear down

```bash
cd terraform
terraform destroy
```

## Troubleshooting

- **`AccessDenied` creating the IAM role:** some lab accounts block IAM. Set `lambda_role_arn` in `terraform.tfvars` to an existing role (for example the lab's `LabRole`) and run `terraform apply` again.
- **API returns 500:** check the Lambda logs in CloudWatch. The usual cause is a wrong `mongo_uri` or Atlas Network Access not allowing `0.0.0.0/0`.
- **Page loads but says it can't reach the API:** the frontend was built without `VITE_API_URL`. Rebuild with it set and sync to S3 again.

## Tier 2: GitHub Actions

Every push to `master` on my fork that touches this folder deploys automatically: it packages the Lambda, updates the function code, builds the frontend with `VITE_API_URL`, and syncs it to S3, then smoke tests the API.

The live workflow is at `.github/workflows/javier-benitez-notice-board.yml` on my fork. Since submissions can't modify `.github/`, a copy is kept in `ci/deploy.yml` for review.

Repository secrets used: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `LAMBDA_FUNCTION_NAME`, `S3_BUCKET`, `VITE_API_URL`.

### Acceptance criteria

- [x] Pushing a change to `master` triggers the workflow automatically
- [x] The workflow completes without errors
- [x] The updated app is live without any manual AWS CLI commands

## Tier 3: CloudFront CDN

The frontend is now served over HTTPS through CloudFront, and the S3 bucket is private.

- CloudFront Origin Access Control (OAC) signs requests from CloudFront to S3
- S3 Block Public Access is fully on, and the bucket policy only allows `cloudfront.amazonaws.com` for this distribution
- Unknown paths fall back to `index.html` so the single-page app works on refresh
- The GitHub Actions workflow invalidates the CloudFront cache (`/*`) after every frontend deploy, using the `CF_DISTRIBUTION_ID` secret

### Acceptance criteria

- [x] The app loads over HTTPS via the CloudFront URL
- [x] The S3 bucket is no longer publicly accessible directly
- [x] Pushing to `master` triggers a CloudFront cache invalidation automatically
- [x] The site is served from CloudFront edge locations (check the `x-cache` and `x-amz-cf-pop` headers in DevTools, Network tab)
