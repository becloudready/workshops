output "alb_dns_name" {
  description = "Public URL of the noticeboard (open in browser)"
  value       = "http://${aws_lb.main.dns_name}"
}

output "backend_ecr_url" {
  description = "ECR URI for the backend image — use in docker push"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_url" {
  description = "ECR URI for the frontend image — use in docker push"
  value       = aws_ecr_repository.frontend.repository_url
}

output "docdb_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = aws_docdb_cluster.main.endpoint
}

output "ecr_login_command" {
  description = "Run this to authenticate Docker with ECR"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.backend.repository_url}"
}
