# Terraform Knowledge Base

Infrastructure as Code patterns and best practices.

## Contents

- [Patterns](patterns.md) — Module structure, state management, best practices

## Quick Reference

### Workflow
```bash
# Initialize
terraform init

# Plan
terraform plan
terraform plan -out=plan.tfplan

# Apply
terraform apply
terraform apply plan.tfplan
terraform apply -auto-approve  # skip confirmation

# Destroy
terraform destroy

# Format
terraform fmt
terraform fmt -recursive

# Validate
terraform validate

# Show state
terraform show
terraform state list
```

### Common Commands
```bash
# Import existing resource
terraform import aws_instance.example i-1234567890abcdef0

# Refresh state
terraform refresh

# Output values
terraform output
terraform output -json

# Taint (force recreate)
terraform taint aws_instance.example
terraform untaint aws_instance.example

# Replace (newer method)
terraform apply -replace="aws_instance.example"

# Target specific resource
terraform apply -target=aws_instance.example

# Workspace
terraform workspace list
terraform workspace new dev
terraform workspace select dev
```

---

## Basic Structure

```hcl
# provider.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

# main.tf
resource "aws_instance" "example" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = {
    Name        = "example-${var.environment}"
    Environment = var.environment
  }
}

# outputs.tf
output "instance_id" {
  description = "Instance ID"
  value       = aws_instance.example.id
}
```

---

## Variable Types

```hcl
# String
variable "name" {
  type    = string
  default = "example"
}

# Number
variable "count" {
  type    = number
  default = 3
}

# Bool
variable "enabled" {
  type    = bool
  default = true
}

# List
variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

# Map
variable "tags" {
  type = map(string)
  default = {
    Environment = "dev"
    Project     = "example"
  }
}

# Object
variable "server" {
  type = object({
    name = string
    size = string
    enabled = bool
  })
}
```

---

## Topics TODO

- [ ] Remote state (S3, Terraform Cloud)
- [ ] State locking (DynamoDB)
- [ ] Data sources
- [ ] Provisioners
- [ ] Dynamic blocks
- [ ] for_each vs count
- [ ] Terraform Cloud / Enterprise
- [ ] CI/CD integration
