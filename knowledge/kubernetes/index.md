# Kubernetes Knowledge Base

Cluster operations, debugging, and patterns.

## Contents

- [Commands](commands.md) — kubectl cheatsheet
- [Debugging](debugging.md) — Pod and network troubleshooting

## Quick Reference

### Context & Namespace
```bash
# View current context
kubectl config current-context

# List contexts
kubectl config get-contexts

# Switch context
kubectl config use-context my-cluster

# Set default namespace
kubectl config set-context --current --namespace=my-namespace
```

### Essential Commands
```bash
# Get resources
kubectl get pods
kubectl get pods -A  # all namespaces
kubectl get pods -o wide  # more info
kubectl get all

# Describe (detailed info)
kubectl describe pod podname

# Logs
kubectl logs podname
kubectl logs -f podname  # follow
kubectl logs podname -c containername  # specific container

# Exec into pod
kubectl exec -it podname -- /bin/bash

# Apply manifest
kubectl apply -f manifest.yaml

# Delete
kubectl delete pod podname
kubectl delete -f manifest.yaml
```

### Shortcuts
| Short | Full |
|-------|------|
| po | pods |
| svc | services |
| deploy | deployments |
| rs | replicasets |
| ns | namespaces |
| no | nodes |
| cm | configmaps |
| pv | persistentvolumes |
| pvc | persistentvolumeclaims |

---

## Topics TODO

- [ ] Helm
- [ ] RBAC
- [ ] Network policies
- [ ] Resource limits
- [ ] Horizontal Pod Autoscaler
- [ ] StatefulSets
- [ ] DaemonSets
- [ ] Jobs & CronJobs
- [ ] Secrets management
- [ ] Ingress configuration
