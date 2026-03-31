# Knowledge Base

> Personal documentation and reference — years of notes, commands, and patterns organized for quick access.

## Purpose

This is my second brain for technical knowledge. It's designed to be:
- **Searchable** — find what I need fast
- **LLM-friendly** — easy for AI assistants to parse and reference
- **Growing** — add incrementally over time
- **Practical** — real commands and patterns I actually use

## Topics

### 🐧 [Linux](linux/)
System administration, networking, filesystem, troubleshooting.
- [Networking](linux/networking.md) — ip, ss, firewalld, iptables
- [Filesystem](linux/filesystem.md) — lvm, xfs, mount, fstab
- [Systemd](linux/systemd.md) — services, timers, journalctl
- [Troubleshooting](linux/troubleshooting.md) — strace, lsof, perf

### ☸️ [Kubernetes](kubernetes/)
Cluster operations, debugging, patterns.
- [Commands](kubernetes/commands.md) — kubectl cheatsheet
- [Debugging](kubernetes/debugging.md) — pod and network troubleshooting

### 🏗️ [Terraform](terraform/)
Infrastructure as Code patterns and best practices.
- [Patterns](terraform/patterns.md) — module structure, state management

### ⚙️ [Ansible](ansible/)
Automation playbooks and role patterns.
- [Playbooks](ansible/playbooks.md) — common patterns
- [Roles](ansible/roles.md) — structure and best practices

### 🖥️ [vSphere](vsphere/)
VMware administration and PowerCLI.
- [Administration](vsphere/administration.md) — daily operations
- [PowerCLI](vsphere/powercli.md) — automation scripts

### 🔴 [Red Hat](redhat/)
Satellite, IdM, and RHEL ecosystem.
- [Satellite](redhat/satellite.md) — lifecycle management
- [IdM](redhat/idm.md) — identity management

---

## How to Use

### For Quick Reference
Each file is self-contained with commands and examples.

### For AI Assistants
Point to this index, then drill into specific topics. Each markdown file has:
- Overview/context
- Commands in fenced code blocks
- Examples with real-world scenarios

### For Learning
Follow the TODO items to fill gaps in documentation.

---

## Contributing to This Knowledge Base

When adding new content:
1. Put it in the right folder
2. Update the folder's `index.md`
3. Use consistent formatting
4. Include real examples
5. Add TODO for incomplete sections
