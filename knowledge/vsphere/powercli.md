# PowerCLI

VMware automation with PowerShell.

## Setup

### Install
```powershell
# Install module
Install-Module -Name VMware.PowerCLI -Scope CurrentUser

# Skip certificate check (lab only)
Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false

# Disable CEIP
Set-PowerCLIConfiguration -ParticipateInCeip $false -Confirm:$false
```

### Connect
```powershell
# Connect to vCenter
Connect-VIServer -Server vcenter.example.com -User admin -Password secret

# Connect with credential prompt
Connect-VIServer -Server vcenter.example.com

# Disconnect
Disconnect-VIServer -Confirm:$false
```

---

## VM Operations

### Get VMs
```powershell
# All VMs
Get-VM

# Specific VM
Get-VM -Name "web01"

# Filter by power state
Get-VM | Where-Object {$_.PowerState -eq "PoweredOn"}

# With custom properties
Get-VM | Select-Object Name, NumCpu, MemoryGB, PowerState

# Export to CSV
Get-VM | Select-Object Name, NumCpu, MemoryGB | Export-Csv -Path vms.csv
```

### Power Operations
```powershell
# Power on
Start-VM -VM "web01"

# Shut down (graceful)
Shutdown-VMGuest -VM "web01" -Confirm:$false

# Power off (hard)
Stop-VM -VM "web01" -Confirm:$false

# Restart
Restart-VM -VM "web01" -Confirm:$false

# Suspend
Suspend-VM -VM "web01" -Confirm:$false
```

### Snapshots
```powershell
# List snapshots
Get-Snapshot -VM "web01"

# Create snapshot
New-Snapshot -VM "web01" -Name "Pre-update" -Description "Before patch"

# Revert to snapshot
Set-VM -VM "web01" -Snapshot "Pre-update" -Confirm:$false

# Remove snapshot
Remove-Snapshot -Snapshot (Get-Snapshot -VM "web01" -Name "Pre-update") -Confirm:$false

# Remove all snapshots
Get-Snapshot -VM "web01" | Remove-Snapshot -Confirm:$false

# Find VMs with snapshots
Get-VM | Get-Snapshot | Select-Object VM, Name, Created, SizeGB
```

### Create VM
```powershell
# From template
New-VM -Name "web02" -Template "RHEL8-Template" -ResourcePool "Production" -Datastore "datastore1"

# Clone VM
New-VM -Name "web02-clone" -VM "web02" -Datastore "datastore1"
```

---

## Host Operations

### Get Hosts
```powershell
# All hosts
Get-VMHost

# With details
Get-VMHost | Select-Object Name, ConnectionState, PowerState, NumCpu, MemoryTotalGB
```

### Maintenance Mode
```powershell
# Enter maintenance mode
Set-VMHost -VMHost "esxi01.example.com" -State Maintenance

# Exit maintenance mode
Set-VMHost -VMHost "esxi01.example.com" -State Connected
```

### Host Services
```powershell
# List services
Get-VMHostService -VMHost "esxi01.example.com"

# Start/stop SSH
Get-VMHostService -VMHost "esxi01.example.com" | Where-Object {$_.Key -eq "TSM-SSH"} | Start-VMHostService
```

---

## Datastore Operations

```powershell
# List datastores
Get-Datastore

# With capacity info
Get-Datastore | Select-Object Name, CapacityGB, FreeSpaceGB, @{N='UsedGB';E={$_.CapacityGB - $_.FreeSpaceGB}}

# Find VMs on datastore
Get-Datastore "datastore1" | Get-VM
```

---

## Networking

```powershell
# List port groups
Get-VirtualPortGroup

# Get VM network adapters
Get-VM "web01" | Get-NetworkAdapter

# Change port group
Get-VM "web01" | Get-NetworkAdapter | Set-NetworkAdapter -NetworkName "Production" -Confirm:$false
```

---

## Reporting

### VM Inventory
```powershell
Get-VM | Select-Object Name, PowerState, NumCpu, MemoryGB, 
    @{N='Datastore';E={(Get-Datastore -VM $_).Name}},
    @{N='Host';E={$_.VMHost.Name}},
    @{N='OS';E={$_.Guest.OSFullName}} |
Export-Csv -Path vm-inventory.csv -NoTypeInformation
```

### Snapshot Report
```powershell
Get-VM | Get-Snapshot | 
Select-Object VM, Name, Created, SizeGB, 
    @{N='AgeInDays';E={(New-TimeSpan -Start $_.Created -End (Get-Date)).Days}} |
Sort-Object AgeInDays -Descending |
Export-Csv -Path snapshots.csv -NoTypeInformation
```

### Capacity Report
```powershell
Get-Datastore | 
Select-Object Name, 
    @{N='CapacityGB';E={[math]::Round($_.CapacityGB,2)}},
    @{N='FreeSpaceGB';E={[math]::Round($_.FreeSpaceGB,2)}},
    @{N='UsedPercent';E={[math]::Round((($_.CapacityGB - $_.FreeSpaceGB) / $_.CapacityGB) * 100, 2)}} |
Export-Csv -Path datastore-capacity.csv -NoTypeInformation
```

---

## Bulk Operations

### Power On Multiple VMs
```powershell
$vms = @("web01", "web02", "web03")
$vms | ForEach-Object { Start-VM -VM $_ }
```

### Create Snapshots for Tag
```powershell
Get-VM -Tag "Production" | ForEach-Object {
    New-Snapshot -VM $_ -Name "Pre-Patch-$(Get-Date -Format 'yyyyMMdd')"
}
```

### Update VM Hardware
```powershell
Get-VM | Where-Object {$_.HardwareVersion -lt "vmx-19"} | 
ForEach-Object {
    Set-VM -VM $_ -HardwareVersion vmx-19 -Confirm:$false
}
```

---

## Useful Functions

```powershell
# Get VM IP address
function Get-VMIPAddress {
    param($VMName)
    (Get-VM $VMName).Guest.IPAddress | Where-Object {$_ -match '\d+\.\d+\.\d+\.\d+'}
}

# Find VMs by IP
function Find-VMByIP {
    param($IP)
    Get-VM | Where-Object {$_.Guest.IPAddress -contains $IP}
}
```

---

## TODO

- [ ] vSAN commands
- [ ] NSX commands
- [ ] Scheduling scripts
- [ ] Error handling patterns
