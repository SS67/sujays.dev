# vSphere Administration Best Practices

*Enterprise virtualization tips and tricks learned from years of running VMware at scale*

## Cluster Design

### HA & DRS Configuration

Always enable **High Availability (HA)** and **Distributed Resource Scheduler (DRS)** on every production cluster.

| Setting | Recommended Value |
|---------|-------------------|
| HA Admission Control | Reserve capacity for at least 1 host failure |
| HA VM Monitoring | Enabled (restart VMs on guest OS hang) |
| DRS Automation | Fully Automated |
| DRS Migration Threshold | Aggressive (3) for dynamic workloads |

```powershell
# PowerCLI: set DRS to fully automated
Get-Cluster "Production" | Set-Cluster -DrsEnabled $true -DrsAutomationLevel FullyAutomated
```

### Sizing Guidelines

- **N+1 headroom**: the cluster must survive losing one host at peak load.
- Keep CPU overcommit ratio below **4:1** for latency-sensitive workloads.
- Reserve 10–15% of memory per host for hypervisor overhead; never balloon in production.

---

## VM Management

### Templates & Linked Clones

Maintain VM templates for each OS version. Convert a template to a VM to patch, then convert back.

```powershell
# PowerCLI: deploy from template
New-VM -Name "web-01" -Template "RHEL9-Template" `
       -Datastore "vSAN-DS" -VMHost "esx-01.example.com" `
       -DiskStorageFormat Thin
```

### Snapshot Policy

Snapshots are **not backups**. Rules:
- Never keep a snapshot longer than **72 hours**.
- Automate cleanup with a PowerCLI scheduled task.
- Consolidate stale snapshots during maintenance windows.

```powershell
# Find VMs with old snapshots
Get-VM | Get-Snapshot | Where-Object {
    $_.Created -lt (Get-Date).AddDays(-3)
} | Select-Object VM, Name, Created, SizeMB
```

---

## Networking

### Standard vs. Distributed vSwitches

Use **vSphere Distributed Switches (vDS)** for production — centrally managed, consistent port-group config across all hosts in a cluster.

```
vDS: Production-dvs
 ├── Port Group: PG-VM-Production   (VLAN 100)
 ├── Port Group: PG-VM-DMZ          (VLAN 200)
 └── Port Group: PG-vMotion         (VLAN 300, no external traffic)
```

- Separate VMkernel adapters per function: Management, vMotion, vSAN, iSCSI.
- Enable **Jumbo Frames (MTU 9000)** on vMotion and vSAN VMkernel networks for performance.

---

## Storage

### Datastore Best Practices

- Use **thin provisioning** for dev/test; **eager zeroed thick** for databases requiring consistent IOPS.
- Monitor datastore free space; alert at 20%, page on-call at 10%.

```powershell
# PowerCLI: find datastores below 20% free
Get-Datastore | Where-Object { ($_.FreeSpaceMB / $_.CapacityMB) -lt 0.20 } |
    Select-Object Name, @{N="FreePct"; E={ [math]::Round($_.FreeSpaceMB/$_.CapacityMB*100,1) }}
```

### vSAN Health

Run the vSAN Health Check weekly. Key things to verify:

- **Resync status** — no objects resyncing before performing maintenance.
- **Disk balance** — no single disk group over 80% used.
- **Network latency** — vSAN inter-node latency should stay under 1 ms.

---

## PowerCLI Automation

### Connect & Basics

```powershell
# Install module once
Install-Module -Name VMware.PowerCLI -Scope CurrentUser

# Connect (suppress SSL warning in lab)
Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false
Connect-VIServer -Server vcenter.example.com -Credential (Get-Credential)
```

### Bulk Operations

```powershell
# Shut down all VMs in a folder
Get-Folder "Dev" | Get-VM | Where-Object { $_.PowerState -eq "PoweredOn" } |
    Shutdown-VMGuest -Confirm:$false

# Add a disk to multiple VMs
Get-VM "app-*" | New-HardDisk -CapacityGB 50 -StorageFormat Thin

# Export VM inventory to CSV
Get-VM | Select-Object Name, NumCpu, MemoryGB, PowerState,
    @{N="Host"; E={$_.VMHost.Name}},
    @{N="Datastore"; E={(Get-Datastore -VM $_).Name}} |
    Export-Csv vm-inventory.csv -NoTypeInformation
```

---

## Monitoring & Alarms

Create alarms for:

| Metric | Warning | Critical |
|--------|---------|----------|
| Host CPU usage | 80% | 95% |
| Host Memory usage | 85% | 95% |
| Datastore free space | 20% | 10% |
| HA failover capacity | < N+1 | < N |
| VM snapshot age | 48 h | 72 h |

---

## Backup & Recovery

- **3-2-1 rule**: 3 copies, on 2 different media, 1 offsite.
- Use **Veeam Backup & Replication** or **Dell PPDM** for VM-consistent backups.
- Test restores quarterly — an untested backup is not a backup.
- Document RTO and RPO per workload tier; configure backup schedules accordingly.

---

*Last updated: 2025*
