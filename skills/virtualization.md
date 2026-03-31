# Virtualization

## VMware vSphere

Enterprise virtualization platform — the backbone of most datacenters.

### Components
- **vCenter Server** — Centralized management
- **ESXi** — Hypervisor
- **vSphere Client** — Web-based administration
- **vMotion** — Live migration
- **HA/DRS** — High availability and load balancing

### Areas of Expertise
- Cluster design and sizing
- Resource pools and limits
- Template and clone management
- Snapshot best practices
- Upgrade and patching workflows

→ See: [/knowledge/vsphere/](../knowledge/vsphere/)

---

## vSAN

Software-defined storage integrated with vSphere.

### Key Concepts
- Disk groups (cache + capacity)
- Storage policies
- Fault domains
- Stretched clusters
- Capacity planning

---

## NSX

Network virtualization for vSphere environments.

### Features
- Distributed switching and routing
- Micro-segmentation
- Load balancing
- VPN and NAT
- Security policies

---

## PowerCLI

PowerShell module for vSphere automation.

### Common Use Cases
```powershell
# Connect to vCenter
Connect-VIServer -Server vcenter.example.com

# Get all VMs
Get-VM | Select Name, PowerState, NumCpu, MemoryGB

# Bulk snapshot
Get-VM -Tag "Production" | New-Snapshot -Name "Pre-Patch"

# Export VM list
Get-VM | Export-Csv -Path vms.csv
```

---

## Other Virtualization

- **KVM/libvirt** — Linux-native virtualization
- **Proxmox** — Open-source hypervisor
- **Hyper-V** — Windows virtualization
