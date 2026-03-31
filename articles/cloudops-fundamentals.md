# CloudOps Fundamentals

*Managing cloud infrastructure at scale*

## Overview

CloudOps is the discipline of operating cloud infrastructure with a focus on automation, reliability, cost visibility, and continuous improvement. It bridges the gap between traditional IT operations and modern cloud-native engineering.

---

## Core Principles

### Infrastructure as Code

Everything is version-controlled — no click-ops. Whether it's a VPC, a security group, or a DNS record, if it exists in your environment it should exist in a Git repository.

```hcl
# Terraform: declare, version-control, review, apply
resource "aws_s3_bucket" "logs" {
  bucket = "my-app-logs-${var.env}"
  tags   = local.common_tags
}
```

### Immutable Infrastructure

Replace, don't patch. Build new artifacts from a known-good base image; roll forward rather than applying hotfixes to running servers.

```bash
# Trigger a rolling replacement instead of in-place patch
kubectl rollout restart deployment/my-app
```

### GitOps

Git is the single source of truth for infrastructure state. Every change flows through a pull request: reviewed, approved, then applied by automation — not by hand.

### Observability

Metrics, logs, and traces together. Knowing *that* something broke is not enough — you need to know *why* and *where*.

---

## Provisioning Tools

| Tool | Best For |
|------|----------|
| Terraform | Multi-cloud IaC, state management |
| Pulumi | IaC in real programming languages |
| CloudFormation | AWS-native, tight IAM integration |
| Ansible | Configuration management & ad-hoc tasks |
| Cloud-init | Bootstrap VM configuration at first boot |

---

## Monitoring & Observability Stack

### Metrics — Prometheus + Grafana

```yaml
# prometheus.yml scrape config
scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:8080']
    metrics_path: /metrics
    scrape_interval: 15s
```

Key metrics to track per service:
- **RED** — Request rate, Errors, Duration (latency)
- **USE** — Utilisation, Saturation, Errors (for resources)

### Logs — ELK / Loki

Structured JSON logs are far easier to query than plain text:

```json
{"level":"error","ts":1700000000,"msg":"db timeout","service":"api","latency_ms":5012}
```

Ship logs with Fluent Bit → Loki or Elasticsearch. Correlate with trace IDs.

### Traces — OpenTelemetry

Instrument applications with the OpenTelemetry SDK. Export to Jaeger or Tempo. Distributed tracing makes latency bottlenecks visible across service boundaries.

---

## Cost Management

Cloud costs spiral without discipline. Key practices:

1. **Tagging strategy** — every resource tagged with `env`, `team`, `project`, `owner`.
2. **Right-sizing** — review CPU/memory usage; downsize over-provisioned instances monthly.
3. **Reserved instances / Savings Plans** — commit to 1- or 3-year terms for stable baseline workloads; use spot/preemptible for batch jobs.
4. **Infracost in CI** — surface cost estimates in pull requests before they merge.

```yaml
# GitHub Actions: Infracost cost diff on every PR
- name: Infracost diff
  uses: infracost/actions/setup@v2
- run: infracost diff --path=. --format=table
```

5. **Scheduled shutdown** — dev/staging environments don't need to run 24/7. Scale to zero overnight.

---

## Deployment Patterns

### Blue / Green

Two identical environments; switch traffic at the load balancer. Instant rollback with zero downtime.

```bash
# AWS CLI: shift ALB target group
aws elbv2 modify-listener --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$GREEN_TG_ARN
```

### Canary

Route a small percentage (e.g., 5%) of traffic to the new version. Monitor error rates and latency; promote or rollback.

### Feature Flags

Decouple deploy from release. Ship code behind a flag; enable for internal users first, then gradually roll out.

---

## Security Essentials

- **Least privilege IAM** — roles scoped to the minimum actions needed, no wildcard `*` policies.
- **Secrets management** — HashiCorp Vault, AWS Secrets Manager, or GCP Secret Manager. Never put credentials in environment variables or code.
- **Network segmentation** — private subnets for compute, public only for load balancers.
- **Image scanning** — Trivy or Grype in CI to block images with critical CVEs.

```bash
# Scan an image with Trivy before push
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest
```

---

*Last updated: 2025*
