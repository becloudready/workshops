resource "aws_docdb_subnet_group" "main" {
  name       = "${var.app_name}-docdb-subnet-group"
  subnet_ids = aws_subnet.private[*].id
  tags       = { Name = "${var.app_name}-docdb-subnet-group" }
}

resource "aws_docdb_cluster_parameter_group" "main" {
  family      = "docdb5.0"
  name        = "${var.app_name}-docdb-params"
  description = "Noticeboard DocumentDB parameter group"

  parameter {
    name  = "tls"
    value = "disabled" # Simplifies workshop connection strings; enable for production
  }

  tags = { Name = "${var.app_name}-docdb-params" }
}

resource "aws_docdb_cluster" "main" {
  cluster_identifier              = "${var.app_name}-docdb"
  engine                          = "docdb"
  master_username                 = var.docdb_master_username
  master_password                 = random_password.docdb.result
  db_subnet_group_name            = aws_docdb_subnet_group.main.name
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name
  vpc_security_group_ids          = [aws_security_group.docdb.id]
  skip_final_snapshot             = true

  tags = { Name = "${var.app_name}-docdb" }
}

resource "aws_docdb_cluster_instance" "main" {
  identifier         = "${var.app_name}-docdb-instance"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.docdb_instance_class
  tags               = { Name = "${var.app_name}-docdb-instance" }
}

resource "random_password" "docdb" {
  length           = 20
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
