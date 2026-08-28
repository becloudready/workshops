output "api_endpoint" {
  description = "Base URL of the deployed API"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "frontend_url" {
  description = "URL of the deployed frontend (S3 static website endpoint)"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}
