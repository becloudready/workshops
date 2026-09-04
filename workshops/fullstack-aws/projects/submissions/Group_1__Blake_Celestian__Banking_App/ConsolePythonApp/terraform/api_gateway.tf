resource "aws_apigatewayv2_api" "http" {
  name          = "${var.project_name}-http-api"
  protocol_type = "HTTP"
  description   = "Public HTTP proxy in front of the FastAPI EC2 host"

  cors_configuration {
    allow_credentials = false
    allow_headers     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_origins     = ["*"]
    max_age           = 300
  }
}

resource "aws_apigatewayv2_integration" "root" {
  api_id               = aws_apigatewayv2_api.http.id
  integration_type     = "HTTP_PROXY"
  integration_method   = "ANY"
  integration_uri      = "http://${aws_instance.api.public_ip}:8000/"
  connection_type      = "INTERNET"
  timeout_milliseconds = 29000
}

resource "aws_apigatewayv2_integration" "proxy" {
  api_id               = aws_apigatewayv2_api.http.id
  integration_type     = "HTTP_PROXY"
  integration_method   = "ANY"
  integration_uri      = "http://${aws_instance.api.public_ip}:8000/{proxy}"
  connection_type      = "INTERNET"
  timeout_milliseconds = 29000
}

resource "aws_apigatewayv2_route" "root" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.root.id}"
}

resource "aws_apigatewayv2_route" "proxy" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.proxy.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}
