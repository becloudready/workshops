variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for created resources"
  type        = string
  default     = "noticeboardtracker"
}

variable "database_url" {
  description = "Postgres connection string (Neon/Supabase - must be reachable over the public internet, see note in main.tf)"
  type        = string
  sensitive   = true
}

variable "jwt_secret_key" {
  description = "Secret key used to sign JWTs"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "Comma-separated list of origins allowed by CORS. Use \"*\" to allow all origins."
  type        = string
  default     = "*"
}

variable "lambda_exec_role_arn" {
  description = "ARN of the pre-existing IAM role Lambda should run as (this account doesn't allow creating or reading IAM roles)"
  type        = string
  default     = "arn:aws:iam::279249498881:role/quicklabs-fullstack-shared-lambda-exec"
}
