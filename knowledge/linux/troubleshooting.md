# Linux Troubleshooting

Debugging tools, performance analysis, and diagnostic commands.

## Process Debugging

### strace
Trace system calls made by a process.

```bash
# Trace a command
strace ls -la

# Trace running process
sudo strace -p PID

# Trace with timestamps
strace -t command

# Trace specific syscalls
strace -e open,read,write command

# Trace child processes
strace -f command

# Output to file
strace -o trace.log command

# Summary only
strace -c command
```

### ltrace
Trace library calls.

```bash
ltrace command
ltrace -p PID
```

### lsof
List open files.

```bash
# All open files
lsof

# Files opened by process
lsof -p PID

# Files opened by user
lsof -u username

# What's using a port
lsof -i :80

# What's using a file/directory
lsof /path/to/file
lsof +D /path/to/dir

# Network connections
lsof -i

# TCP connections
lsof -i TCP

# Specific host
lsof -i @hostname
```

### fuser
Find processes using files.

```bash
# What's using a file
fuser /path/to/file

# What's using a mount
fuser -vm /mountpoint

# What's using a port
fuser -n tcp 80

# Kill processes using file
fuser -k /path/to/file
```

---

## Performance Analysis

### top / htop
```bash
# Basic top
top

# Sort by memory
top -o %MEM

# Specific user
top -u username

# Batch mode (for scripts)
top -b -n 1
```

### htop shortcuts
| Key | Action |
|-----|--------|
| F5 | Tree view |
| F6 | Sort by column |
| F9 | Kill process |
| / | Search |
| u | Filter by user |

### vmstat
Virtual memory statistics.

```bash
# Run every 2 seconds
vmstat 2

# With timestamps
vmstat -t 2

# Disk stats
vmstat -d
```

Output columns:
- `r` — runnable processes
- `b` — blocked processes
- `swpd` — swap used
- `free` — free memory
- `si/so` — swap in/out
- `bi/bo` — block I/O
- `us/sy/id/wa` — CPU user/system/idle/wait

### iostat
I/O statistics.

```bash
# Basic
iostat

# Extended stats every 2 seconds
iostat -x 2

# Specific device
iostat -x sda 2

# Human readable
iostat -h
```

Key metrics:
- `%util` — device utilization (100% = saturated)
- `await` — average I/O wait time
- `r/s`, `w/s` — reads/writes per second

### mpstat
CPU statistics per processor.

```bash
# All CPUs
mpstat -P ALL 2

# Specific CPU
mpstat -P 0 2
```

### sar
System activity reporter (historical data).

```bash
# CPU usage
sar -u 2 5

# Memory usage
sar -r 2 5

# Disk I/O
sar -d 2 5

# Network
sar -n DEV 2 5

# From log file
sar -f /var/log/sa/sa01
```

---

## Memory Analysis

### free
```bash
# Human readable
free -h

# Continuous
watch free -h

# Wide output
free -hw
```

### /proc/meminfo
```bash
cat /proc/meminfo

# Specific values
grep MemTotal /proc/meminfo
grep MemAvailable /proc/meminfo
```

### ps memory
```bash
# Sort by memory
ps aux --sort=-%mem | head

# Memory for specific process
ps -o pid,rss,vsz,comm -p PID
```

### pmap
Memory map of process.

```bash
pmap PID
pmap -x PID  # extended
```

---

## perf (Performance Counters)

```bash
# Record CPU profile
sudo perf record -g ./myapp

# View report
sudo perf report

# Real-time top
sudo perf top

# CPU stats for command
sudo perf stat ./myapp

# Flame graph (with tools)
sudo perf record -F 99 -g ./myapp
sudo perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg
```

---

## Network Debugging

### tcpdump
```bash
# Capture on interface
sudo tcpdump -i eth0

# Filter by host
sudo tcpdump host 192.168.1.1

# Filter by port
sudo tcpdump port 80

# Filter by protocol
sudo tcpdump tcp
sudo tcpdump icmp

# Write to file
sudo tcpdump -w capture.pcap

# Read from file
tcpdump -r capture.pcap

# Verbose with hex
sudo tcpdump -XX
```

### netstat / ss
```bash
# Connections and listening
ss -tunapl

# Statistics
ss -s
netstat -s

# Routing
ip route
netstat -r
```

### Network performance
```bash
# Bandwidth test
iperf3 -s  # server
iperf3 -c server_ip  # client

# Check latency
ping -c 10 hostname
mtr hostname

# DNS lookup time
time dig example.com
```

---

## Disk Debugging

### Check filesystem
```bash
# ext4 (unmounted)
sudo e2fsck -f /dev/sdb1

# xfs (unmounted)
sudo xfs_repair /dev/sdb1

# Check for bad blocks
sudo badblocks -v /dev/sdb1
```

### SMART status
```bash
# Install smartmontools
sudo dnf install smartmontools

# Check health
sudo smartctl -H /dev/sda

# Full info
sudo smartctl -a /dev/sda

# Run short test
sudo smartctl -t short /dev/sda
```

### Debug I/O
```bash
# What's doing I/O
sudo iotop

# Block device stats
cat /proc/diskstats

# Trace block I/O
sudo blktrace -d /dev/sda -o - | blkparse -i -
```

---

## Kernel / System

### dmesg
```bash
# View kernel messages
dmesg

# Follow
dmesg -w

# Human timestamps
dmesg -T

# Filter by level
dmesg --level=err,warn
```

### /proc filesystem
```bash
# CPU info
cat /proc/cpuinfo

# Memory info
cat /proc/meminfo

# Process info
ls /proc/PID/
cat /proc/PID/status
cat /proc/PID/cmdline

# System uptime
cat /proc/uptime
```

### sysctl
```bash
# View all
sysctl -a

# View specific
sysctl net.ipv4.ip_forward

# Set temporarily
sudo sysctl -w net.ipv4.ip_forward=1

# Set permanently
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-custom.conf
sudo sysctl -p /etc/sysctl.d/99-custom.conf
```

---

## Quick Checklist

When troubleshooting, check:

1. **Logs** — `journalctl -xe`, `/var/log/messages`
2. **Resources** — `top`, `free -h`, `df -h`
3. **Network** — `ss -tuln`, `ip a`, `ping`
4. **Services** — `systemctl status`, `systemctl --failed`
5. **Recent changes** — `rpm -qa --last`, `/var/log/dnf.log`
6. **Disk** — `iostat`, `dmesg | grep -i error`

---

## TODO

- [ ] gdb basics
- [ ] Core dump analysis
- [ ] Auditd
- [ ] SELinux troubleshooting
