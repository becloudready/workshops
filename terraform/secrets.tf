resource "aws_secretsmanager_secret" "docdb" {
  name                    = "${var.app_name}/docdb-url"
  recovery_window_in_days = 0 # Allow immediate deletion for workshop teardown
  tags                    = { Name = "${var.app_name}-docdb-url" }
}

resource "aws_secretsmanager_secret_version" "docdb" {
  secret_id = aws_secretsmanager_secret.docdb.id

  # mongodb:// URI injected directly as MONGO_URL into ECS tasks
  secret_string = "mongodb://${var.docdb_master_username}:${random_password.docdb.result}@${aws_docdb_cluster.main.endpoint}:27017/?directConnection=true"
}
