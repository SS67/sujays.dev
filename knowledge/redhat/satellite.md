# Red Hat Satellite

Lifecycle management for RHEL systems at scale.

## Overview

Satellite provides:
- Content management (packages, errata)
- Provisioning (PXE, kickstart)
- Configuration management
- Patch management
- Compliance reporting

## Architecture

```
┌─────────────────────────┐
│    Satellite Server     │  ← Central management
│  (Content, Provisioning)│
└───────────┬─────────────┘
            │
     ┌──────┴──────┐
     │             │
┌────▼────┐  ┌────▼────┐
│ Capsule │  │ Capsule │  ← Distributed content
│ (Site A)│  │ (Site B)│
└────┬────┘  └────┬────┘
     │             │
  [Hosts]       [Hosts]
```

## Key Concepts

### Content Views
Filtered, versioned snapshots of repositories.

**Workflow:**
1. Sync repositories from Red Hat CDN
2. Create Content View with selected repos
3. Add filters (include/exclude packages)
4. Publish version
5. Promote through lifecycle environments

### Lifecycle Environments
Stages for content promotion.

```
Library → Development → Testing → Production
```

### Activation Keys
Combination of:
- Subscriptions
- Content View
- Lifecycle Environment
- Host Collections

Used for automated registration.

---

## Common Tasks

### Register Host
```bash
# Install katello-ca-consumer
curl -O http://satellite.example.com/pub/katello-ca-consumer-latest.noarch.rpm
sudo rpm -ivh katello-ca-consumer-latest.noarch.rpm

# Register with activation key
sudo subscription-manager register --org="MyOrg" --activationkey="rhel8-production"

# Install katello-agent (optional, for remote execution)
sudo dnf install katello-host-tools
```

### Hammer CLI
```bash
# Login
hammer auth login

# List organizations
hammer organization list

# List content views
hammer content-view list --organization "MyOrg"

# Publish content view
hammer content-view publish --name "RHEL8-CV" --organization "MyOrg"

# Promote to environment
hammer content-view version promote \
  --content-view "RHEL8-CV" \
  --to-lifecycle-environment "Production" \
  --organization "MyOrg"

# List hosts
hammer host list

# Run remote command
hammer job-invocation create \
  --job-template "Run Command - SSH Default" \
  --inputs "command=uptime" \
  --search-query "name ~ web*"
```

---

## Content Management

### Repository Sync
```bash
# Sync single repo
hammer repository synchronize --name "Red Hat Enterprise Linux 8" --organization "MyOrg"

# Sync all repos in product
hammer product synchronize --name "Red Hat Enterprise Linux" --organization "MyOrg"
```

### Filters
- **Include** — Only selected packages
- **Exclude** — Everything except selected
- **Package Groups** — Include/exclude by group
- **Errata** — Filter by date, type, severity

### Errata Management
```bash
# List errata
hammer erratum list --organization "MyOrg"

# Apply errata to host
hammer host errata apply --host "web01.example.com" --errata-ids "RHBA-2024:1234"
```

---

## Provisioning

### Compute Resources
- VMware
- RHEV
- OpenStack
- AWS
- Azure
- GCP

### Provisioning Templates
- PXELinux
- Kickstart
- Finish scripts
- User data

### Operating Systems
Define OS + architecture + provisioning templates.

---

## Best Practices

1. **Content Views**
   - One CV per major RHEL version
   - Use composite CVs for applications
   - Test before promoting to production

2. **Lifecycle**
   - Minimum: Library → Dev → Prod
   - Recommended: Library → Dev → Test → Staging → Prod

3. **Patch Strategy**
   - Weekly sync from CDN
   - Monthly promote to production
   - Emergency errata: fast-track process

4. **Capsules**
   - One per datacenter/region
   - Reduces WAN traffic
   - Provides local provisioning

---

## TODO

- [ ] Capsule installation
- [ ] Compute resources setup
- [ ] SCAP compliance
- [ ] Remote execution
- [ ] Ansible integration
