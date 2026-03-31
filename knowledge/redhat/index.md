# Red Hat Knowledge Base

Satellite, IdM, and RHEL ecosystem.

## Contents

- [Satellite](satellite.md) — Lifecycle management
- [IdM](idm.md) — Identity Management

## Quick Reference

### RHEL Subscription
```bash
# Register system
sudo subscription-manager register

# Attach subscription
sudo subscription-manager attach --auto

# List repos
sudo subscription-manager repos --list

# Enable repo
sudo subscription-manager repos --enable=rhel-8-for-x86_64-appstream-rpms

# Check status
sudo subscription-manager status
```

### Common Commands
```bash
# System info
cat /etc/redhat-release
hostnamectl

# Package management
sudo dnf update
sudo dnf install package
sudo dnf remove package
sudo dnf search keyword
sudo dnf info package

# Services
sudo systemctl status service
sudo systemctl start service
sudo systemctl enable service
```

---

## Topics TODO

- [ ] RHEL hardening
- [ ] SELinux management
- [ ] Cockpit
- [ ] Image Builder
- [ ] RHEL for Edge
