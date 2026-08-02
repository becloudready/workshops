# ── AWS ──────────────────────────────────────────────────────────────────────
variable "aws_region" {
  description = "AWS region to deploy into"
  default     = "us-east-1"
}

# ── Networking ────────────────────────────────────────────────────────────────
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "AZs to spread across (two required)"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# ── App ───────────────────────────────────────────────────────────────────────
variable "app_name" {
  description = "Short name used to prefix all noticeboard resources"
  default     = "noticeboard"
}

variable "backend_image" {
  description = "Full ECR URI for the backend image (set after first push)"
  default     = ""
}

variable "frontend_image" {
  description = "Full ECR URI for the frontend image (set after first push)"
  default     = ""
}

# ── ECS ───────────────────────────────────────────────────────────────────────
variable "backend_cpu" {
  description = "Fargate vCPU units for the backend task"
  default     = 256
}

variable "backend_memory" {
  description = "Fargate memory (MiB) for the backend task"
  default     = 512
}

variable "frontend_cpu" {
  default = 256
}

variable "frontend_memory" {
  default = 512
}

# ── DocumentDB ───────────────────────────────────────────────────────────────
variable "docdb_instance_class" {
  description = "DocumentDB instance class"
  default     = "db.t3.medium"
}

variable "docdb_master_username" {
  description = "DocumentDB master username"
  default     = "noticeadmin"
}
