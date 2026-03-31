# Terraform Patterns

Module structure, state management, and best practices.

## Module Structure

### Standard Layout
```
modules/
└── vpc/
    ├── main.tf          # Resources
    ├── variables.tf     # Input variables
    ├── outputs.tf       # Output values
    ├── versions.tf      # Provider requirements
    └── README.md        # Documentation

environments/
├── dev/
│   ├── main.tf
│   ├── variables.tf
│   └── terraform.tfvars
├── staging/
│   └── ...
└── prod/
    └── ...
```

### Module Example
```hcl
# modules/vpc/variables.tf
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}
```

### Using Module
```hcl
# environments/dev/main.tf
module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr    = "10.0.0.0/16"
  environment = "dev"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
```

---

## State Management

### Remote State (S3)
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "env/dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### State Locking (DynamoDB)
```hcl
# Create lock table
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

### State Commands
```bash
# List resources in state
terraform state list

# Show resource
terraform state show aws_instance.example

# Move resource
terraform state mv aws_instance.old aws_instance.new

# Remove from state (doesn't destroy)
terraform state rm aws_instance.example

# Pull state
terraform state pull > state.json

# Push state (dangerous)
terraform state push state.json
```

---

## Loops and Conditionals

### count
```hcl
variable "instance_count" {
  default = 3
}

resource "aws_instance" "server" {
  count         = var.instance_count
  ami           = var.ami_id
  instance_type = "t3.micro"

  tags = {
    Name = "server-${count.index}"
  }
}

# Reference
output "instance_ids" {
  value = aws_instance.server[*].id
}
```

### for_each (preferred)
```hcl
variable "instances" {
  default = {
    web  = "t3.micro"
    api  = "t3.small"
    db   = "t3.medium"
  }
}

resource "aws_instance" "server" {
  for_each      = var.instances
  ami           = var.ami_id
  instance_type = each.value

  tags = {
    Name = each.key
  }
}

# Reference
output "instance_ids" {
  value = { for k, v in aws_instance.server : k => v.id }
}
```

### Conditionals
```hcl
# Create resource conditionally
resource "aws_eip" "example" {
  count = var.create_eip ? 1 : 0
  instance = aws_instance.example.id
}

# Conditional value
locals {
  instance_type = var.environment == "prod" ? "t3.large" : "t3.micro"
}
```

---

## Dynamic Blocks

```hcl
variable "ingress_rules" {
  default = [
    { port = 80, cidr = ["0.0.0.0/0"] },
    { port = 443, cidr = ["0.0.0.0/0"] },
    { port = 22, cidr = ["10.0.0.0/8"] }
  ]
}

resource "aws_security_group" "example" {
  name = "example"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = ingress.value.cidr
    }
  }
}
```

---

## Data Sources

```hcl
# Get latest AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "example" {
  ami = data.aws_ami.amazon_linux.id
  # ...
}

# Get current AWS account
data "aws_caller_identity" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

# Get availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
```

---

## Best Practices

### 1. Use Modules
- DRY — Don't repeat yourself
- Versioned modules for stability
- One module per logical component

### 2. Remote State
- Always use remote state in teams
- Enable state locking
- Encrypt state files

### 3. Variables
- Use descriptive names
- Always add descriptions
- Set types explicitly
- Use validation blocks

```hcl
variable "environment" {
  description = "Environment name"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
```

### 4. Naming
- Consistent naming convention
- Use locals for repeated values
- Tag everything

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "terraform"
  }
}

resource "aws_instance" "example" {
  # ...
  tags = merge(local.common_tags, {
    Name = "example-instance"
  })
}
```

### 5. Security
- No secrets in state or code
- Use secrets manager or Vault
- Encrypt state at rest

---

## TODO

- [ ] Terragrunt
- [ ] Terraform Cloud
- [ ] Testing with Terratest
- [ ] Policy as Code (Sentinel, OPA)
- [ ] Drift detection
