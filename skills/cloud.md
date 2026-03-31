# Cloud & CloudOps

## AWS (Amazon Web Services)

Primary cloud platform experience.

### Core Services
- **EC2** — Compute instances
- **EKS** — Managed Kubernetes
- **VPC** — Networking
- **IAM** — Identity and access
- **S3** — Object storage
- **RDS** — Managed databases
- **Route 53** — DNS
- **CloudWatch** — Monitoring

### Infrastructure as Code
- CloudFormation templates
- Terraform AWS provider
- AWS CDK

---

## GCP (Google Cloud Platform)

### Core Services
- **Compute Engine** — VMs
- **GKE** — Managed Kubernetes
- **Cloud IAM** — Identity management
- **Cloud Storage** — Object storage
- **Cloud DNS** — DNS management

---

## Azure

### Core Services
- **Virtual Machines**
- **AKS** — Managed Kubernetes
- **Azure AD** — Identity
- **Blob Storage** — Object storage
- **Azure DevOps** — CI/CD

---

## Terraform

Infrastructure as Code — cloud-agnostic.

### Experience
- Multi-cloud deployments
- Module development
- State management (remote backends)
- Workspace strategies
- CI/CD integration

### Patterns
```hcl
# Module structure
module "vpc" {
  source  = "./modules/vpc"
  cidr    = "10.0.0.0/16"
  region  = var.region
}
```

→ See: [/knowledge/terraform/](../knowledge/terraform/)

---

## CloudOps Practices

### Principles
- Infrastructure as Code (everything versioned)
- Immutable infrastructure (replace, don't patch)
- GitOps (Git as source of truth)
- Observability (metrics, logs, traces)
- Cost optimization (right-sizing, reserved capacity)

### Tools
- Terraform / Pulumi / CloudFormation
- Ansible for configuration
- Packer for image builds
- Cost management (AWS Cost Explorer, Infracost)
