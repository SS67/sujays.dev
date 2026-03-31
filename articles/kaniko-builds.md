# Building Images with Kaniko

*Daemonless container builds in Kubernetes*

## Overview

Kaniko is a tool to build container images from a Dockerfile inside a Kubernetes cluster without requiring a Docker daemon.

## Why Kaniko?

- No privileged containers needed
- Runs in standard Kubernetes pods
- Supports layer caching
- Works with private registries

## Basic Usage

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kaniko-build
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    args:
    - "--dockerfile=Dockerfile"
    - "--context=git://github.com/user/repo.git"
    - "--destination=registry.example.com/myimage:v1"
```

## CI/CD Integration

*TODO: GitHub Actions, GitLab CI examples*

## Caching

*TODO: Layer caching strategies*

## Authentication

*TODO: Registry credentials*

---

*Last updated: [Date]*
