variable "project_name" {
  type        = string
  description = "Short name used for AWS resource names."
  default     = "banking-app"
}

variable "environment" {
  type        = string
  description = "Deployment environment label."
  default     = "prod"
}

variable "aws_region" {
  type        = string
  description = "AWS region for VPC, EC2, API Gateway, and S3."
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for the public subnet."
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type that runs FastAPI."
  default     = "t3.micro"
}

variable "ssh_public_key" {
  type        = string
  description = "Public key uploaded as an EC2 key pair for API deploys."
}

variable "ssh_ingress_cidr" {
  type        = string
  description = "CIDR allowed to SSH to the API instance. Tighten this to your IP."
  default     = "0.0.0.0/0"
}

variable "supabase_organization_id" {
  type        = string
  description = "Supabase organization slug from the dashboard URL or org settings."
}

variable "supabase_project_name" {
  type        = string
  description = "Name of the Supabase Postgres project."
  default     = "banking-db"
}

variable "supabase_region" {
  type        = string
  description = "Supabase region. Use a region close to aws_region."
  default     = "us-east-1"
}

variable "supabase_db_password" {
  type        = string
  sensitive   = true
  description = "Postgres password for the Supabase project. Use a strong password."

  validation {
    condition     = length(var.supabase_db_password) >= 12
    error_message = "supabase_db_password must be at least 12 characters."
  }
}

