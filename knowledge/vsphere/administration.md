# vSphere Administration

Daily operations and best practices.

## VM Management

### Power Operations
- Power On/Off
- Suspend/Resume
- Reset
- Shut Down Guest (graceful)

### Snapshots

**Best Practices:**
- Don't keep snapshots long-term (performance impact)
- Snapshot before major changes
- Document reason and delete date
- Monitor snapshot size

**Operations:**
1. Take Snapshot — Captures VM state
2. Revert to Snapshot — Restore previous state
3. Delete Snapshot — Commits changes
4. Delete All Snapshots — Consolidates disk

### Templates

**Create Template:**
1. Prepare VM (sysprep, cleanup)
2. Power off VM
3. Right-click → Clone → Clone to Template

**Deploy from Template:**
1. Right-click template → Deploy VM from Template
2. Customize (network, name, etc.)
3. Power on

**Convert to/from VM:**
- Template → VM for updates
- VM → Template after updates

---

## Resource Management

### Resource Pools
Organize and limit resources for groups of VMs.

| Setting | Purpose |
|---------|---------|
| Shares | Relative priority |
| Reservation | Guaranteed minimum |
| Limit | Maximum allowed |

### VM Settings
```
CPU:
- vCPUs
- Cores per socket
- Reservation
- Limit
- Shares

Memory:
- RAM allocation
- Reservation
- Limit
- Shares
```

### Best Practices
- Don't over-provision (CPU ok, memory careful)
- Use reservations sparingly
- Monitor with vRealize Operations or built-in charts

---

## Networking

### vSwitch Types
| Type | Description |
|------|-------------|
| Standard vSwitch | Per-host configuration |
| Distributed vSwitch | Centralized, consistent across hosts |

### Port Groups
- VM Network — Standard VM traffic
- Management — ESXi management
- vMotion — Live migration traffic
- vSAN — Storage traffic

### NIC Teaming
- Load balancing methods
- Failover order
- Network failover detection

---

## Storage

### Datastore Types
| Type | Description |
|------|-------------|
| VMFS | Block storage (FC, iSCSI) |
| NFS | Network file storage |
| vSAN | Software-defined (local disks) |
| vVols | Virtual volumes |

### Provisioning
- **Thick Eager Zero** — Best performance, preallocated
- **Thick Lazy Zero** — Preallocated, zeroed on first write
- **Thin** — Grows as needed, saves space

### Storage vMotion
Move VM storage without downtime:
1. Right-click VM → Migrate
2. Change storage only
3. Select destination datastore
4. Choose disk format

---

## High Availability

### vSphere HA
Restarts VMs on another host if host fails.

**Settings:**
- Admission control
- Host monitoring
- VM monitoring
- Datastore heartbeating

### vSphere DRS
Balances workloads across cluster.

**Modes:**
- Manual — Recommendations only
- Partially Automated — Initial placement automatic
- Fully Automated — Continuous balancing

**Settings:**
- Migration threshold (aggressive to conservative)
- Affinity/Anti-affinity rules

---

## Maintenance

### Host Maintenance Mode
1. Right-click host → Maintenance Mode → Enter
2. VMs migrate (if DRS) or must be manually moved
3. Perform maintenance
4. Exit Maintenance Mode

### Updates
1. Stage patches in Update Manager / Lifecycle Manager
2. Scan hosts/VMs for compliance
3. Remediate (usually requires maintenance mode)

### Health Checks
- Check alarms regularly
- Review performance graphs
- Monitor capacity
- Verify backups

---

## TODO

- [ ] vCenter HA
- [ ] Content Library
- [ ] Profiles (host, VM)
- [ ] Tagging
- [ ] Permissions and roles
