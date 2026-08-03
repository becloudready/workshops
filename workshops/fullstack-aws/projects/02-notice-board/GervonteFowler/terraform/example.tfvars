aws_region      = "us-east-1"
student_name    = "gervonte-fowler"
mongodb_uri     = "mongodb://YOUR_EC2_PUBLIC_IP:27017"
mongodb_db      = "noticeboard"
lambda_role_arn = "arn:aws:iam::279249498881:role/quicklabs-fullstack-shared-lambda-exec"

# Prefer the EC2 private IP and uncomment these when MongoDB is only reachable
# inside its VPC. The Lambda security group needs egress to MongoDB port 27017,
# and the EC2 security group must allow 27017 from the Lambda security group.
# lambda_subnet_ids         = ["subnet-0123456789abcdef0"]
# lambda_security_group_ids = ["sg-0123456789abcdef0"]
