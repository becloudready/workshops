output "api_url" {
  description = "API Gateway base URL used as VITE_API_URL."
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "cloudfront_url" {
  description = "HTTPS URL for the notice-board frontend."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "s3_bucket" {
  description = "Private frontend bucket used by the deployment workflow."
  value       = aws_s3_bucket.frontend.id
}

output "lambda_function_name" {
  description = "Lambda function updated by the deployment workflow."
  value       = aws_lambda_function.api.function_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution invalidated after frontend deployments."
  value       = aws_cloudfront_distribution.frontend.id
}
