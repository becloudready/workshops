output "website_url" {
  description = "S3 static website URL — open this in your browser"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "api_url" {
  description = "API Gateway URL — set as VITE_API_URL in frontend"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "s3_bucket" {
  description = "S3 bucket name — used for uploads"
  value       = aws_s3_bucket.frontend.bucket
}

output "lambda_function_name" {
  description = "Lambda function name — used for deploys"
  value       = aws_lambda_function.api.function_name
}
