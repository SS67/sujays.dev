# kubectl Commands Cheatsheet

## Cluster Info
```bash
# Cluster info
kubectl cluster-info

# Node status
kubectl get nodes
kubectl describe node nodename

# API resources
kubectl api-resources

# Version
kubectl version
```

---

## Pods

### View
```bash
# List pods
kubectl get pods
kubectl get pods -n namespace
kubectl get pods -A  # all namespaces
kubectl get pods -o wide  # IP, node info
kubectl get pods -o yaml  # full yaml

# Watch
kubectl get pods -w

# Filter by label
kubectl get pods -l app=nginx

# Sort
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'
```

### Interact
```bash
# Describe
kubectl describe pod podname

# Logs
kubectl logs podname
kubectl logs -f podname  # follow
kubectl logs --tail=100 podname  # last 100 lines
kubectl logs -p podname  # previous container
kubectl logs podname -c containername  # specific container
kubectl logs -l app=nginx  # by label

# Exec
kubectl exec -it podname -- /bin/bash
kubectl exec -it podname -c containername -- /bin/sh

# Copy files
kubectl cp podname:/path/file ./local-file
kubectl cp ./local-file podname:/path/file

# Port forward
kubectl port-forward podname 8080:80
kubectl port-forward svc/servicename 8080:80
```

### Create/Delete
```bash
# Run pod
kubectl run nginx --image=nginx

# Run with command
kubectl run busybox --image=busybox --command -- sleep 3600

# Generate YAML (dry run)
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml

# Delete
kubectl delete pod podname
kubectl delete pod podname --grace-period=0 --force  # force delete
```

---

## Deployments

```bash
# List
kubectl get deployments
kubectl get deploy

# Create
kubectl create deployment nginx --image=nginx --replicas=3

# Scale
kubectl scale deployment nginx --replicas=5

# Update image
kubectl set image deployment/nginx nginx=nginx:1.19

# Rollout status
kubectl rollout status deployment/nginx

# Rollout history
kubectl rollout history deployment/nginx

# Rollback
kubectl rollout undo deployment/nginx
kubectl rollout undo deployment/nginx --to-revision=2

# Restart
kubectl rollout restart deployment/nginx

# Generate YAML
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml
```

---

## Services

```bash
# List
kubectl get services
kubectl get svc

# Expose deployment
kubectl expose deployment nginx --port=80 --target-port=80 --type=ClusterIP
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# Describe
kubectl describe svc servicename

# Get endpoints
kubectl get endpoints servicename
```

---

## ConfigMaps & Secrets

### ConfigMaps
```bash
# Create from literal
kubectl create configmap myconfig --from-literal=key1=value1

# Create from file
kubectl create configmap myconfig --from-file=config.txt

# Create from env file
kubectl create configmap myconfig --from-env-file=config.env

# View
kubectl get configmap myconfig -o yaml
```

### Secrets
```bash
# Create generic
kubectl create secret generic mysecret --from-literal=password=secret123

# Create from file
kubectl create secret generic mysecret --from-file=ssh-key=~/.ssh/id_rsa

# Create TLS
kubectl create secret tls tls-secret --cert=cert.pem --key=key.pem

# View (base64 encoded)
kubectl get secret mysecret -o yaml

# Decode
kubectl get secret mysecret -o jsonpath='{.data.password}' | base64 -d
```

---

## Namespaces

```bash
# List
kubectl get namespaces

# Create
kubectl create namespace my-namespace

# Set default
kubectl config set-context --current --namespace=my-namespace

# Delete (careful!)
kubectl delete namespace my-namespace
```

---

## Labels & Selectors

```bash
# Add label
kubectl label pod podname env=prod

# Remove label
kubectl label pod podname env-

# Overwrite
kubectl label pod podname env=dev --overwrite

# Filter by label
kubectl get pods -l env=prod
kubectl get pods -l 'env in (prod, staging)'
kubectl get pods -l env!=dev
```

---

## Resource Management

```bash
# Top (requires metrics-server)
kubectl top nodes
kubectl top pods
kubectl top pods --containers

# Resource requests/limits in YAML
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"
```

---

## JSON Path & Output

```bash
# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# JSON path
kubectl get pod podname -o jsonpath='{.status.podIP}'
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# Go template
kubectl get pods -o go-template='{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}'
```

---

## Apply & Delete

```bash
# Apply
kubectl apply -f manifest.yaml
kubectl apply -f ./directory/
kubectl apply -f https://url/manifest.yaml

# Delete
kubectl delete -f manifest.yaml

# Diff before apply
kubectl diff -f manifest.yaml

# Replace (delete and recreate)
kubectl replace -f manifest.yaml

# Patch
kubectl patch deployment nginx -p '{"spec":{"replicas":5}}'
```

---

## Debugging

```bash
# Events
kubectl get events
kubectl get events --sort-by='.lastTimestamp'

# Describe (shows events too)
kubectl describe pod podname

# Debug container
kubectl debug podname -it --image=busybox

# Temporary pod for testing
kubectl run debug --image=busybox -it --rm -- /bin/sh
```

---

## Useful Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgpa='kubectl get pods -A'
alias kgs='kubectl get svc'
alias kgn='kubectl get nodes'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias klf='kubectl logs -f'
alias kx='kubectl exec -it'
alias kaf='kubectl apply -f'
alias kdf='kubectl delete -f'

# Autocompletion
source <(kubectl completion bash)
complete -F __start_kubectl k
```

---

## TODO

- [ ] Helm commands
- [ ] kustomize
- [ ] kubectl plugins (krew)
