output "cloudfront_url" {
  description = "HTTPS URL of the site through CloudFront"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Distribution ID, used for cache invalidation in GitHub Actions"
  value       = aws_cloudfront_distribution.frontend.id
}

output "s3_bucket_name" {
  description = "Private S3 bucket that holds the frontend build"
  value       = aws_s3_bucket.frontend.id
}

output "api_gateway_url" {
  description = "Base URL of the API (use as VITE_API_URL)"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "lambda_function_name" {
  description = "Name of the deployed Lambda function"
  value       = aws_lambda_function.backend.function_name
}
