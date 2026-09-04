# Banking app Terraform bootstrap

Provisions the grade-ready AWS network plus a Supabase Postgres database that FastAPI already speaks through `DATABASE_URL`.

Created resources:

- VPC, public subnet, internet gateway, public route
- EC2 host for FastAPI (`project1`)
- HTTP API Gateway proxying to that host
- S3 website bucket for the Vite frontend
- Supabase project (managed PostgreSQL)

```text
Browser -> S3 website
                |
                v
         API Gateway HTTP API
                |
                v
         EC2 FastAPI :8000  --->  Supabase Postgres
```

## Prerequisites

- Terraform >= 1.5
- AWS credentials (`aws configure` or `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)
- An SSH key pair
- A Supabase account and [access token](https://supabase.com/dashboard/account/tokens)
- The organization slug from the Supabase dashboard URL

## 1. Configure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

- `ssh_public_key` — contents of `~/.ssh/id_ed25519.pub`
- `supabase_organization_id` — org slug
- `supabase_db_password` — at least 12 characters
- `ssh_ingress_cidr` — your public IP `/32` if you can

Export the Supabase token (do not put it in tfvars):

```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."
```

## 2. Apply

```bash
terraform init
terraform apply
```

Copy these outputs:

- `api_gateway_url` — frontend `VITE_API_URL`
- `frontend_website_url` — public UI
- `api_public_ip` — used by the API deploy script

## 3. Deploy the FastAPI app

From the repo root, using the private key that matches `ssh_public_key`:

```bash
./scripts/deploy-api.sh ~/.ssh/id_ed25519
```

This copies `project1/` to the instance, installs `requirements.txt`, and starts `uvicorn`. SQLModel will create tables on first boot against Supabase.

## 4. Deploy the frontend

```bash
./scripts/deploy-frontend.sh
```

Opens the S3 website URL printed by Terraform.

## Local vs deployed database

Local setup still uses Docker Postgres via `project1/setup-local-dev.sh`.

Deployed FastAPI uses:

```text
postgresql+psycopg2://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require
```

That is standard PostgreSQL. No application code change is required beyond `DATABASE_URL`, which Terraform injects on the EC2 host.

## Tear down

```bash
cd terraform
terraform destroy
```

This deletes the AWS resources and the Supabase project.
