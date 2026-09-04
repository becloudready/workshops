output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "internet_gateway_id" {
  value = aws_internet_gateway.main.id
}

output "api_public_ip" {
  value = aws_instance.api.public_ip
}

output "api_gateway_url" {
  description = "Set frontend VITE_API_URL to this value."
  value       = aws_apigatewayv2_api.http.api_endpoint
}

output "frontend_bucket" {
  value = aws_s3_bucket.frontend.bucket
}

output "frontend_website_url" {
  value = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "supabase_project_ref" {
  value = supabase_project.db.id
}

output "supabase_postgres_host" {
  value = "db.${supabase_project.db.id}.supabase.co"
}

output "database_url" {
  description = "Postgres URL used by FastAPI. Keep this private."
  value       = local.database_url
  sensitive   = true
}
