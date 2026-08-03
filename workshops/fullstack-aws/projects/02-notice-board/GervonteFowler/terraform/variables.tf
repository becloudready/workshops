variable "aws_region" {
  description = "AWS region for the regional application resources."
  type        = string
  default     = "us-east-1"
}

variable "student_name" {
  description = "Lowercase name used to prefix every resource."
  type        = string
  default     = "gervonte-fowler"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.student_name))
    error_message = "student_name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "mongodb_uri" {
  description = "MongoDB connection URI reachable from Lambda."
  type        = string
  sensitive   = true
}

variable "mongodb_db" {
  description = "MongoDB database that contains the notices collection."
  type        = string
  default     = "noticeboard"
}

variable "lambda_role_arn" {
  description = "ARN of the pre-existing Lambda execution role supplied by the lab."
  type        = string
}

variable "lambda_subnet_ids" {
  description = "Optional private subnet IDs when MongoDB is reached through the EC2 VPC."
  type        = list(string)
  default     = []
}

variable "lambda_security_group_ids" {
  description = "Optional Lambda security group IDs. Set together with lambda_subnet_ids."
  type        = list(string)
  default     = []
}
