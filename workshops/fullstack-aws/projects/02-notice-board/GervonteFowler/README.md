# Notice Board

A React, TypeScript, Express, and MongoDB notice board deployed as static assets
behind CloudFront and a Node.js Lambda behind API Gateway.

## Architecture

```text
Browser
├── HTTPS frontend ──> CloudFront ──> private S3 bucket
└── Notice API ──────> API Gateway ──> Node.js Lambda ──> MongoDB on EC2
```

The API supports:

- `GET /notices`
- `POST /notices` with `{ "name": "...", "message": "..." }`
- `DELETE /notices/:id`

## Local development

Requirements: Node.js 20+ and a reachable MongoDB instance. AWS Lambda uses
the supported Node.js 24 runtime.

```bash
cp .env.example .env
npm ci
npm run dev:all
```

The frontend runs at `http://localhost:8080` and proxies API requests to the
Express server at `http://localhost:3000`.

## AWS prerequisites

- AWS CLI authenticated to the target account
- Terraform 1.6+
- MongoDB running on EC2
- Permission to create IAM, Lambda, API Gateway, S3, CloudFront, and CloudWatch resources

MongoDB must be reachable from Lambda. The preferred configuration attaches
Lambda to private subnets and permits port `27017` from the Lambda security
group to the MongoDB EC2 security group. Set `lambda_subnet_ids` and
`lambda_security_group_ids` in that case. Do not expose an unauthenticated
MongoDB instance to the public internet.

## Initial deployment

Create the Lambda artifact and Terraform input file:

```bash
npm ci
npm run lambda:build
cp terraform/example.tfvars terraform/terraform.tfvars
```

Edit `terraform/terraform.tfvars`, especially `mongodb_uri` and
`lambda_role_arn`. Quicklabs accounts use the instructor-provided shared Lambda
execution role because student users cannot create IAM roles. Terraform
variable files are ignored because the URI may contain credentials.

Provision the infrastructure:

```bash
terraform -chdir=terraform init
terraform -chdir=terraform fmt -check
terraform -chdir=terraform validate
terraform -chdir=terraform apply
```

Build and upload the frontend using the API URL returned by Terraform:

```bash
VITE_API_URL="$(terraform -chdir=terraform output -raw api_url)" npm run client:build
aws s3 sync client/dist/ "s3://$(terraform -chdir=terraform output -raw s3_bucket)/" --delete
aws cloudfront create-invalidation \
  --distribution-id "$(terraform -chdir=terraform output -raw cloudfront_distribution_id)" \
  --paths "/*"
terraform -chdir=terraform output -raw cloudfront_url
```

Open the final URL and verify that creating, refreshing, and deleting a notice
all work. The S3 bucket is intentionally private; direct S3 access should fail.

## Automated deployment

The repository-root workflow
`.github/workflows/deploy-gervonte-notice-board.yml` deploys application code
when this project changes on `master`. Configure these GitHub Actions secrets
from the Terraform outputs:

| Secret | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Deployment access key |
| `AWS_SECRET_ACCESS_KEY` | Deployment secret key |
| `AWS_REGION` | `us-east-1` or the chosen region |
| `LAMBDA_FUNCTION_NAME` | `terraform output -raw lambda_function_name` |
| `S3_BUCKET` | `terraform output -raw s3_bucket` |
| `VITE_API_URL` | `terraform output -raw api_url` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `terraform output -raw cloudfront_distribution_id` |

The workflow compiles and packages the Node Lambda, updates its code, builds
the frontend with the API URL, synchronizes it to S3, and invalidates
CloudFront.

The workflow is scoped to this project path and guarded to deploy only from the
`Gervonte/workshops` fork, so an upstream pull request cannot access or use the
fork's AWS secrets.

## Useful commands

```bash
npm run build
npm run lambda:build
terraform -chdir=terraform output
terraform -chdir=terraform destroy
```

Lambda and API Gateway access logs have a 14-day retention period. The Lambda
ZIP is generated at `dist/lambda.zip` and is intentionally not committed.
