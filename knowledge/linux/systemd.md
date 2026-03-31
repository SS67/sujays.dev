# Systemd

Service management, timers, journald, and system targets.

## Service Management

### Basic Commands
```bash
# Status
systemctl status servicename

# Start/stop/restart
sudo systemctl start servicename
sudo systemctl stop servicename
sudo systemctl restart servicename

# Reload config (without restart)
sudo systemctl reload servicename

# Enable/disable on boot
sudo systemctl enable servicename
sudo systemctl disable servicename

# Enable and start
sudo systemctl enable --now servicename

# Check if enabled
systemctl is-enabled servicename

# Check if active
systemctl is-active servicename
```

### List Services
```bash
# All loaded units
systemctl list-units

# All services
systemctl list-units --type=service

# Failed services
systemctl list-units --failed

# All installed unit files
systemctl list-unit-files
```

### Masking
```bash
# Mask (prevent starting entirely)
sudo systemctl mask servicename

# Unmask
sudo systemctl unmask servicename
```

---

## Unit Files

### Locations
| Path | Purpose |
|------|---------|
| `/usr/lib/systemd/system/` | Package-installed units |
| `/etc/systemd/system/` | Admin-created/overrides |
| `/run/systemd/system/` | Runtime units |

### Basic Service Unit
```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=appuser
Group=appgroup
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/start.sh
ExecStop=/opt/myapp/bin/stop.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Service Types
| Type | Description |
|------|-------------|
| simple | Default, stays in foreground |
| forking | Forks to background |
| oneshot | Runs once and exits |
| notify | Signals readiness to systemd |

### After Creating/Editing
```bash
# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start myapp

# Enable on boot
sudo systemctl enable myapp
```

---

## Journalctl (Logs)

### View Logs
```bash
# All logs
journalctl

# Follow (like tail -f)
journalctl -f

# Specific service
journalctl -u servicename

# Follow specific service
journalctl -fu servicename

# Since boot
journalctl -b

# Previous boot
journalctl -b -1

# Kernel messages
journalctl -k
```

### Filter by Time
```bash
# Since time
journalctl --since "2024-01-01 00:00:00"

# Until time
journalctl --until "2024-01-02 00:00:00"

# Last hour
journalctl --since "1 hour ago"

# Today
journalctl --since today
```

### Filter by Priority
```bash
# Error and above
journalctl -p err

# Warning and above
journalctl -p warning

# Priority levels: emerg, alert, crit, err, warning, notice, info, debug
```

### Output Formats
```bash
# JSON output
journalctl -o json

# JSON pretty
journalctl -o json-pretty

# Short (default)
journalctl -o short

# Verbose
journalctl -o verbose
```

### Disk Usage
```bash
# Check journal size
journalctl --disk-usage

# Clean old logs
sudo journalctl --vacuum-time=7d
sudo journalctl --vacuum-size=500M
```

---

## Timers (Cron Replacement)

### List Timers
```bash
systemctl list-timers
systemctl list-timers --all
```

### Timer Unit Example
```ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Daily backup timer

[Timer]
OnCalendar=daily
# Or specific time: OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

```ini
# /etc/systemd/system/backup.service
[Unit]
Description=Backup service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

```bash
# Enable and start timer
sudo systemctl enable --now backup.timer
```

### OnCalendar Syntax
```
# Daily at midnight
OnCalendar=daily

# Every hour
OnCalendar=hourly

# Specific time
OnCalendar=*-*-* 14:30:00

# Every Monday at 9am
OnCalendar=Mon *-*-* 09:00:00

# Every 15 minutes
OnCalendar=*:0/15
```

### Other Timer Options
```ini
# Run 5 minutes after boot
OnBootSec=5min

# Run every 10 minutes after activation
OnUnitActiveSec=10min

# Randomize to spread load
RandomizedDelaySec=5min
```

---

## Targets (Runlevels)

### Common Targets
| Target | Old Runlevel | Description |
|--------|--------------|-------------|
| poweroff.target | 0 | Halt |
| rescue.target | 1 | Single user |
| multi-user.target | 3 | Multi-user, no GUI |
| graphical.target | 5 | Multi-user with GUI |
| reboot.target | 6 | Reboot |

### Commands
```bash
# Get current target
systemctl get-default

# Set default target
sudo systemctl set-default multi-user.target

# Change target now
sudo systemctl isolate rescue.target

# Emergency mode
sudo systemctl isolate emergency.target
```

---

## Useful Commands

```bash
# Analyze boot time
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain

# Show unit dependencies
systemctl list-dependencies servicename

# Show unit properties
systemctl show servicename

# Edit unit file (creates override)
sudo systemctl edit servicename

# Edit full unit file
sudo systemctl edit --full servicename

# Reload all daemons
sudo systemctl daemon-reload

# System state
systemctl is-system-running
```

---

## TODO

- [ ] Socket activation
- [ ] Path units
- [ ] Slice/scope (resource control)
- [ ] systemd-tmpfiles
- [ ] systemd-resolved
