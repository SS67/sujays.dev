# Kubernetes Debugging

Troubleshooting pods, networking, and cluster issues.

## Pod Debugging Workflow

### 1. Check Pod Status
```bash
kubectl get pod podname
kubectl get pod podname -o wide
```

Common statuses:
| Status | Meaning |
|--------|---------|
| Pending | Waiting to be scheduled |
| ContainerCreating | Pulling image or creating container |
| Running | Container running |
| CrashLoopBackOff | Container crashing repeatedly |
| ImagePullBackOff | Can't pull image |
| Error | Container exited with error |
| Completed | Container finished successfully |
| Terminating | Being deleted |

### 2. Describe Pod
```bash
kubectl describe pod podname
```

Look for:
- **Events** at the bottom (scheduling, pulling, errors)
- **Conditions** (Ready, ContainersReady, etc.)
- **State** of each container
- **Restart Count**

### 3. Check Logs
```bash
# Current logs
kubectl logs podname

# Previous container (after crash)
kubectl logs podname -p

# Specific container
kubectl logs podname -c containername

# Follow
kubectl logs -f podname

# Last N lines
kubectl logs --tail=100 podname

# Since time
kubectl logs --since=1h podname
```

### 4. Exec Into Pod
```bash
kubectl exec -it podname -- /bin/bash
kubectl exec -it podname -- /bin/sh
```

---

## Common Issues & Fixes

### Pending Pod

**Check:**
```bash
kubectl describe pod podname | grep -A 20 Events
```

**Causes:**
1. **Insufficient resources** — Node doesn't have enough CPU/memory
   - Check: `kubectl describe node | grep -A 5 "Allocated resources"`
   - Fix: Scale cluster or reduce requests

2. **No matching node (taints/tolerations)**
   - Check: `kubectl describe pod | grep -i taint`
   - Fix: Add toleration or remove taint

3. **PVC not bound**
   - Check: `kubectl get pvc`
   - Fix: Create PV or fix storage class

4. **Node selector mismatch**
   - Check: `kubectl get pod -o yaml | grep nodeSelector`
   - Fix: Label node or fix selector

### ImagePullBackOff

**Check:**
```bash
kubectl describe pod podname | grep -i image
kubectl get events | grep -i pull
```

**Causes:**
1. **Wrong image name/tag**
   - Verify image exists: `docker pull imagename`

2. **Private registry, no credentials**
   - Create secret:
   ```bash
   kubectl create secret docker-registry regcred \
     --docker-server=registry.example.com \
     --docker-username=user \
     --docker-password=pass
   ```
   - Add to pod spec:
   ```yaml
   imagePullSecrets:
   - name: regcred
   ```

3. **Rate limited (Docker Hub)**
   - Use authenticated pulls or mirror

### CrashLoopBackOff

**Check:**
```bash
kubectl logs podname
kubectl logs podname -p  # previous container
kubectl describe pod podname
```

**Causes:**
1. **Application error** — Check logs for stack trace
2. **Missing config/secrets** — Verify env vars and mounts
3. **Liveness probe failing** — Check probe config
4. **Permission issues** — Check security context
5. **OOMKilled** — Container exceeded memory limit
   ```bash
   kubectl describe pod | grep -i oom
   ```

### OOMKilled

```bash
kubectl describe pod podname | grep -i "Last State" -A 5
```

**Fix:**
- Increase memory limit
- Fix memory leak in application
- Check: `kubectl top pod podname`

---

## Network Debugging

### DNS
```bash
# Test from inside cluster
kubectl run debug --image=busybox -it --rm -- nslookup kubernetes
kubectl run debug --image=busybox -it --rm -- nslookup myservice.mynamespace

# Check CoreDNS
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns
```

### Service Connectivity
```bash
# Check service
kubectl get svc myservice
kubectl describe svc myservice

# Check endpoints
kubectl get endpoints myservice

# Test from pod
kubectl run debug --image=busybox -it --rm -- wget -qO- http://myservice:80
kubectl run debug --image=curlimages/curl -it --rm -- curl http://myservice:80
```

### Pod-to-Pod
```bash
# Get pod IP
kubectl get pod podname -o jsonpath='{.status.podIP}'

# Test connectivity
kubectl run debug --image=busybox -it --rm -- ping <pod-ip>
kubectl run debug --image=busybox -it --rm -- nc -zv <pod-ip> <port>
```

### Network Policies
```bash
# List policies
kubectl get networkpolicies
kubectl describe networkpolicy policyname

# Test connectivity (if blocked, policy is working)
```

---

## Node Debugging

### Check Node Status
```bash
kubectl get nodes
kubectl describe node nodename
```

### Node Conditions
| Condition | Meaning |
|-----------|---------|
| Ready | Node healthy |
| MemoryPressure | Low memory |
| DiskPressure | Low disk |
| PIDPressure | Too many processes |
| NetworkUnavailable | Network not configured |

### Node Resources
```bash
# Resource usage
kubectl top node

# Allocated vs capacity
kubectl describe node | grep -A 10 "Allocated resources"

# Pods on node
kubectl get pods -A -o wide --field-selector spec.nodeName=nodename
```

### Drain Node
```bash
# Cordon (prevent scheduling)
kubectl cordon nodename

# Drain (evict pods)
kubectl drain nodename --ignore-daemonsets --delete-emptydir-data

# Uncordon
kubectl uncordon nodename
```

---

## Useful Debug Containers

### BusyBox
```bash
kubectl run debug --image=busybox -it --rm -- /bin/sh
# Available: wget, nslookup, ping, nc, vi
```

### Network Tools
```bash
kubectl run debug --image=nicolaka/netshoot -it --rm -- /bin/bash
# Available: tcpdump, netstat, iperf, curl, dig, nmap, etc.
```

### curl
```bash
kubectl run debug --image=curlimages/curl -it --rm -- sh
```

### Debug Node
```bash
# Create privileged pod on specific node
kubectl debug node/nodename -it --image=busybox
```

---

## Events

```bash
# All events
kubectl get events

# Sorted by time
kubectl get events --sort-by='.lastTimestamp'

# Specific namespace
kubectl get events -n namespace

# Watch
kubectl get events -w

# Filter by type
kubectl get events --field-selector type=Warning
```

---

## Quick Checklist

1. `kubectl get pods` — Status?
2. `kubectl describe pod` — Events? Conditions?
3. `kubectl logs` — Application errors?
4. `kubectl get events` — Cluster-level issues?
5. `kubectl top pod` — Resource usage?
6. `kubectl exec` — Debug from inside
7. Network test — DNS, service, pod connectivity

---

## TODO

- [ ] Debug init containers
- [ ] Debug sidecars
- [ ] Ephemeral debug containers
- [ ] Debugging with kubectl-debug plugin
