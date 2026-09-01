terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# This lab account doesn't allow creating OR reading IAM roles - it provides
# one shared Lambda execution role instead, referenced directly by ARN
# (a data source lookup would need iam:GetRole, which is also denied).

# --- Lambda ---
# The zip is produced by infra/build.sh before `terraform apply`.
# Secrets aren't in Secrets Manager (not permitted in this account) - they're
# passed directly as Lambda environment variables via Terraform variables,
# which are themselves passed in via TF_VAR_* so they're never hardcoded here.
#
# DATABASE_URL must point at a publicly reachable Postgres (Neon/Supabase).
# An RDS instance sitting in a VPC would need this Lambda placed in that VPC
# too (subnets, security groups) - out of scope here, and likely blocked by
# the same "no IAM/network resource creation" restriction on this account.

locals {
  allowed_origins_list = split(",", var.allowed_origins)
}

resource "aws_lambda_function" "api" {
  function_name    = "${var.project_name}-api"
  role             = var.lambda_exec_role_arn
  handler          = "lambda_handler.handler"
  runtime          = "python3.11"
  filename         = "${path.module}/build/lambda_package.zip"
  source_code_hash = filebase64sha256("${path.module}/build/lambda_package.zip")
  timeout          = 15
  memory_size      = 256

  environment {
    variables = {
      DATABASE_URL                = var.database_url
      JWT_SECRET_KEY               = var.jwt_secret_key
      JWT_ALGORITHM                = "HS256"
      ACCESS_TOKEN_EXPIRE_MINUTES = "60"
      CORS_ORIGINS                 = jsonencode(local.allowed_origins_list)
    }
  }
}

# --- API Gateway (HTTP API - simpler/cheaper than REST API for a full proxy) ---

resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# --- Frontend (S3 static website hosting) ---
# This lab account also disallows CloudFront/ACM in most cases, so the
# frontend is served directly from an S3 static website endpoint (HTTP only,
# no custom domain/TLS). The build is uploaded by infra/build.sh (or manually)
# before/after `terraform apply` - Terraform only provisions the bucket here.

resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${data.aws_caller_identity.current.account_id}"
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  # SPA fallback: unknown paths served the app shell so client-side routing works.
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

resource "aws_s3_object" "frontend_files" {
  for_each = fileset("${path.module}/../frontend/task-board-frontend/dist", "**")

  bucket       = aws_s3_bucket.frontend.id
  key          = each.value
  source       = "${path.module}/../frontend/task-board-frontend/dist/${each.value}"
  etag         = filemd5("${path.module}/../frontend/task-board-frontend/dist/${each.value}")
  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), "application/octet-stream")
}

locals {
  mime_types = {
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain"
    ".map"  = "application/json"
  }
}
