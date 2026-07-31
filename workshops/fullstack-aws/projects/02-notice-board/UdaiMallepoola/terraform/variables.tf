variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "student_name" {
  description = "Your name prefix for all resources"
  type        = string
  default     = "student-udai-mallepoola"
}

variable "mongo_host" {
  description = "MongoDB host (EC2 private/public IP)"
  type        = string
}

variable "mongo_port" {
  description = "MongoDB port"
  type        = string
  default     = "27017"
}

variable "mongo_db" {
  description = "MongoDB database name"
  type        = string
  default     = "noticeboard"
}
