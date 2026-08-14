terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "student_name" {
  description = "Your name in lowercase with no spaces (e.g. allen-smith)"
}

variable "created_date" {
  description = "Creation date for the `date` tag, format dd-mmm-yyyy (e.g. 14-Aug-2026)"
  type        = string
}

variable "aws_region" {
  default = "us-east-1"
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      workshop   = "full-stack"
      autodelete = "true"
      date       = var.created_date
    }
  }
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "mongo" {
  key_name   = "student-${var.student_name}-mongo-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

resource "local_file" "private_key" {
  content         = tls_private_key.ssh.private_key_pem
  filename        = "${path.module}/ssh-keys/${var.student_name}-mongo-key.pem"
  file_permission = "0600"
}

resource "aws_security_group" "mongo" {
  name        = "student-${var.student_name}-mongo-sg"
  description = "Allow SSH and MongoDB"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "mongo" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.mongo.key_name
  vpc_security_group_ids = [aws_security_group.mongo.id]

  tags = {
    Name = "student-${var.student_name}-mongo-server"
  }
}

output "instance_public_ip" {
  value = aws_instance.mongo.public_ip
}

output "ssh_command" {
  value = "ssh -i ssh-keys/${var.student_name}-mongo-key.pem ubuntu@${aws_instance.mongo.public_ip}"
}
