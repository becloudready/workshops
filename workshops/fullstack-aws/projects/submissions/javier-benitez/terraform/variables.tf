variable "student_name" {
  type        = string
  description = "Your name, used as a prefix for every AWS resource"
  default     = "javier-benitez"
}

variable "aws_region" {
  type        = string
  description = "AWS region to deploy into"
  default     = "us-east-1"
}

variable "mongo_uri" {
  type        = string
  description = "MongoDB Atlas connection string (mongodb+srv://...)"
  sensitive   = true
}

variable "mongo_db" {
  type        = string
  description = "MongoDB database name"
  default     = "noticeboard"
}

variable "lambda_role_arn" {
  type        = string
  description = "Optional: ARN of an existing IAM role for Lambda. Leave empty to let Terraform create one."
  default     = ""
}
