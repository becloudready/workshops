# IAM user + policy for the nightly cleanup GitHub Action.
# Create once per account. Credentials go into GitHub repo secrets.
#
# Apply with:
#   terraform apply -target=aws_iam_user.cleanup -target=aws_iam_access_key.cleanup

resource "aws_iam_user" "cleanup" {
  name = "workshop-cleanup-bot"
  tags = { Purpose = "nightly-cleanup", ManagedBy = "terraform" }
}

resource "aws_iam_access_key" "cleanup" {
  user = aws_iam_user.cleanup.name
}

resource "aws_iam_user_policy" "cleanup" {
  name = "workshop-cleanup-policy"
  user = aws_iam_user.cleanup.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Read tags (needed to decide whether to delete)
      {
        Sid    = "ReadTags"
        Effect = "Allow"
        Action = [
          "tag:GetResources",
          "resourcegroupstaggingapi:GetResources",
        ]
        Resource = "*"
      },
      # EC2
      {
        Sid    = "EC2Cleanup"
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:TerminateInstances",
          "ec2:DescribeNatGateways",
          "ec2:DeleteNatGateway",
          "ec2:DescribeAddresses",
          "ec2:ReleaseAddress",
          "ec2:DescribeTags",
        ]
        Resource = "*"
      },
      # RDS
      {
        Sid    = "RDSCleanup"
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBClusters",
          "rds:DeleteDBInstance",
          "rds:DeleteDBCluster",
          "rds:ListTagsForResource",
        ]
        Resource = "*"
      },
      # Redshift Serverless
      {
        Sid    = "RedshiftServerlessCleanup"
        Effect = "Allow"
        Action = [
          "redshift-serverless:ListWorkgroups",
          "redshift-serverless:GetWorkgroup",
          "redshift-serverless:DeleteWorkgroup",
          "redshift-serverless:ListNamespaces",
          "redshift-serverless:GetNamespace",
          "redshift-serverless:DeleteNamespace",
          "redshift-serverless:ListTagsForResource",
        ]
        Resource = "*"
      },
      # EKS
      {
        Sid    = "EKSCleanup"
        Effect = "Allow"
        Action = [
          "eks:ListClusters",
          "eks:DescribeCluster",
          "eks:DeleteCluster",
          "eks:ListNodegroups",
          "eks:DeleteNodegroup",
        ]
        Resource = "*"
      },
      # DMS
      {
        Sid    = "DMSCleanup"
        Effect = "Allow"
        Action = [
          "dms:DescribeReplicationInstances",
          "dms:DeleteReplicationInstance",
          "dms:ListTagsForResource",
        ]
        Resource = "*"
      },
      # OpenSearch
      {
        Sid    = "OpenSearchCleanup"
        Effect = "Allow"
        Action = [
          "es:ListDomainNames",
          "es:DescribeDomain",
          "es:DeleteDomain",
          "es:ListTags",
        ]
        Resource = "*"
      },
      # Lambda
      {
        Sid    = "LambdaCleanup"
        Effect = "Allow"
        Action = [
          "lambda:ListFunctions",
          "lambda:DeleteFunction",
          "lambda:ListTags",
        ]
        Resource = "*"
      },
      # Glue
      {
        Sid    = "GlueCleanup"
        Effect = "Allow"
        Action = [
          "glue:GetJobs",
          "glue:DeleteJob",
          "glue:GetCrawlers",
          "glue:DeleteCrawler",
          "glue:GetTags",
        ]
        Resource = "*"
      },
      # Step Functions
      {
        Sid    = "StepFunctionsCleanup"
        Effect = "Allow"
        Action = [
          "states:ListStateMachines",
          "states:DeleteStateMachine",
          "states:ListTagsForResource",
        ]
        Resource = "*"
      },
      # S3
      {
        Sid    = "S3Cleanup"
        Effect = "Allow"
        Action = [
          "s3:ListAllMyBuckets",
          "s3:GetBucketTagging",
          "s3:ListBucket",
          "s3:ListBucketVersions",
          "s3:DeleteObject",
          "s3:DeleteObjectVersion",
          "s3:DeleteBucket",
        ]
        Resource = "*"
      },
      # WAF
      {
        Sid    = "WAFCleanup"
        Effect = "Allow"
        Action = [
          "wafv2:ListWebACLs",
          "wafv2:GetWebACL",
          "wafv2:DeleteWebACL",
          "wafv2:ListTagsForResource",
          "wafv2:ListResourcesForWebACL",
        ]
        Resource = "*"
      },
      # ECS / Fargate
      {
        Sid    = "ECSCleanup"
        Effect = "Allow"
        Action = [
          "ecs:ListClusters",
          "ecs:DescribeClusters",
          "ecs:DeleteCluster",
          "ecs:ListServices",
          "ecs:DescribeServices",
          "ecs:DeleteService",
          "ecs:UpdateService",
          "ecs:ListTaskDefinitions",
          "ecs:DeregisterTaskDefinition",
          "ecs:ListTagsForResource",
        ]
        Resource = "*"
      },
      # ECR
      {
        Sid    = "ECRCleanup"
        Effect = "Allow"
        Action = [
          "ecr:DescribeRepositories",
          "ecr:DeleteRepository",
          "ecr:ListTagsForResource",
          "ecr:BatchDeleteImage",
          "ecr:ListImages",
        ]
        Resource = "*"
      },
      # DocumentDB
      {
        Sid    = "DocDBCleanup"
        Effect = "Allow"
        Action = [
          "rds:DescribeDBClusters",
          "rds:DeleteDBCluster",
          "rds:DescribeDBInstances",
          "rds:DeleteDBInstance",
          "rds:ListTagsForResource",
          "rds:DescribeDBSubnetGroups",
          "rds:DeleteDBSubnetGroup",
          "rds:DescribeDBClusterParameterGroups",
          "rds:DeleteDBClusterParameterGroup",
        ]
        Resource = "*"
      },
      # Secrets Manager
      {
        Sid    = "SecretsManagerCleanup"
        Effect = "Allow"
        Action = [
          "secretsmanager:ListSecrets",
          "secretsmanager:DescribeSecret",
          "secretsmanager:DeleteSecret",
          "secretsmanager:ListSecretVersionIds",
          "secretsmanager:TagResource",
        ]
        Resource = "*"
      },
      # ALB / ELBv2
      {
        Sid    = "ALBCleanup"
        Effect = "Allow"
        Action = [
          "elasticloadbalancing:DescribeLoadBalancers",
          "elasticloadbalancing:DeleteLoadBalancer",
          "elasticloadbalancing:DescribeTargetGroups",
          "elasticloadbalancing:DeleteTargetGroup",
          "elasticloadbalancing:DescribeListeners",
          "elasticloadbalancing:DeleteListener",
          "elasticloadbalancing:DescribeTags",
        ]
        Resource = "*"
      },
      # VPC networking (NAT GWs, EIPs already partly covered by EC2 above)
      {
        Sid    = "VPCCleanup"
        Effect = "Allow"
        Action = [
          "ec2:DescribeVpcs",
          "ec2:DeleteVpc",
          "ec2:DescribeSubnets",
          "ec2:DeleteSubnet",
          "ec2:DescribeSecurityGroups",
          "ec2:DeleteSecurityGroup",
          "ec2:DescribeInternetGateways",
          "ec2:DetachInternetGateway",
          "ec2:DeleteInternetGateway",
          "ec2:DescribeRouteTables",
          "ec2:DeleteRouteTable",
          "ec2:DisassociateRouteTable",
        ]
        Resource = "*"
      },
    ]
  })
}

output "cleanup_access_key_id" {
  description = "Add this as CLEANUP_AWS_ACCESS_KEY_ID in GitHub repo secrets"
  value       = aws_iam_access_key.cleanup.id
}

output "cleanup_secret_access_key" {
  description = "Add this as CLEANUP_AWS_SECRET_ACCESS_KEY in GitHub repo secrets"
  value       = aws_iam_access_key.cleanup.secret
  sensitive   = true
}
