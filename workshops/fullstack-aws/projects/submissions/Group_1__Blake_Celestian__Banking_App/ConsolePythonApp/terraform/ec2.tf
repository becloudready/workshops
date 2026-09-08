data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "api" {
  key_name   = "${var.project_name}-api-key"
  public_key = var.ssh_public_key
}

locals {
  database_url = format(
    "postgresql+psycopg2://postgres.%s:%s@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require",
    supabase_project.db.id,
    urlencode(var.supabase_db_password),
  )
}

resource "aws_instance" "api" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.api.id]
  key_name                    = aws_key_pair.api.key_name
  associate_public_ip_address = true

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    database_url = local.database_url
  })

  user_data_replace_on_change = true

  root_block_device {
    volume_size = 16
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.project_name}-api"
  }

  depends_on = [
    aws_internet_gateway.main,
    supabase_settings.db,
  ]
}
