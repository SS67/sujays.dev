# Containers & Orchestration

## Podman

Daemonless container engine — rootless by default, CLI-compatible with Docker.

### Why Podman over Docker
- No daemon required
- Rootless containers out of the box
- Systemd integration for container services
- Pod support (like K8s pods)
- Better security model

### Common Commands
```bash
# Run a container
podman run -d --name nginx -p 8080:80 nginx

# List containers
podman ps -a

# Build an image
podman build -t myapp:v1 .

# Generate systemd service
podman generate systemd --name nginx --files

# Run as pod
podman pod create --name mypod -p 8080:80
podman run -d --pod mypod nginx
```

---

## Docker

Industry-standard container runtime.

### Key Concepts
- Images, containers, volumes, networks
- Dockerfile best practices
- Multi-stage builds
- Docker Compose for local development

---

## Kubernetes

Container orchestration at scale.

### Areas of Expertise
- Cluster operations and upgrades
- Deployment strategies (rolling, blue-green, canary)
- Debugging pods, networking, storage
- Helm chart development
- RBAC and security policies

→ See: [/knowledge/kubernetes/](../knowledge/kubernetes/)

---

## Kaniko

Build container images inside Kubernetes without Docker daemon.

### Use Cases
- CI/CD pipelines in K8s
- Secure builds without privileged containers
- GitOps workflows

---

## Container Security

- Image scanning (Trivy, Clair)
- Image signing (Cosign, Notary)
- Runtime security (Falco)
- Policy enforcement (OPA/Gatekeeper)
