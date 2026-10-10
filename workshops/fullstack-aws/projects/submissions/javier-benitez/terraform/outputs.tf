output "website_url" {
  description = "Public URL of the S3 static website (open this in your browser)"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "s3_bucket_name" {
  description = "S3 bucket that hosts the frontend (use with aws s3 sync)"
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
