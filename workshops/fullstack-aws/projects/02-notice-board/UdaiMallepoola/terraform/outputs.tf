output "s3_website_url" {
  description = "S3 static website URL"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "api_gateway_url" {
  description = "API Gateway invoke URL — set this as VITE_API_URL when building the frontend"
  value       = aws_apigatewayv2_api.app.api_endpoint
}

output "lambda_function_name" {
  description = "Lambda function name — used in GitHub Actions secret LAMBDA_FUNCTION_NAME"
  value       = aws_lambda_function.app.function_name
}

output "s3_bucket_name" {
  description = "S3 bucket name — used in GitHub Actions secret S3_BUCKET"
  value       = aws_s3_bucket.frontend.bucket
}
