provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

provider "supabase" {
  # Set SUPABASE_ACCESS_TOKEN in your shell.
  # Create a token at https://supabase.com/dashboard/account/tokens
}
