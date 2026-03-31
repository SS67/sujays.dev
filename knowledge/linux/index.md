# Linux Knowledge Base

System administration, networking, and troubleshooting for RHEL/CentOS/Fedora and general Linux.

## Contents

- [Networking](networking.md) — ip, ss, netstat, firewalld, iptables, DNS
- [Filesystem](filesystem.md) — lvm, xfs, ext4, mount, fstab, df, du
- [Systemd](systemd.md) — services, timers, journalctl, targets
- [Troubleshooting](troubleshooting.md) — strace, lsof, perf, debugging

## Quick Reference

### System Information
```bash
# OS version
cat /etc/os-release

# Kernel version
uname -r

# Hardware info
lscpu
free -h
lsblk

# Uptime and load
uptime
```

### User Management
```bash
# Add user
useradd -m -s /bin/bash username

# Set password
passwd username

# Add to group
usermod -aG groupname username

# Switch user
su - username
sudo -u username command
```

### Package Management (RHEL/dnf)
```bash
# Update system
sudo dnf update

# Install package
sudo dnf install package-name

# Search
dnf search keyword

# List installed
dnf list installed

# Package info
dnf info package-name

# Clean cache
sudo dnf clean all
```

### Process Management
```bash
# List processes
ps aux
ps -ef

# Find process
pgrep -a processname

# Kill process
kill PID
kill -9 PID
pkill processname

# Top/htop
top
htop
```

### Services (systemd)
```bash
# Status
systemctl status service

# Start/stop/restart
sudo systemctl start service
sudo systemctl stop service
sudo systemctl restart service

# Enable/disable on boot
sudo systemctl enable service
sudo systemctl disable service

# List all services
systemctl list-units --type=service
```

---

## Topics TODO

- [ ] SELinux
- [ ] Security hardening
- [ ] Performance tuning
- [ ] Cron and scheduling
- [ ] SSH configuration
- [ ] Log management
