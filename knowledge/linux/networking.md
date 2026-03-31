# Linux Networking

Commands and concepts for network configuration, troubleshooting, and security.

## IP Command (iproute2)

Modern replacement for ifconfig, route, arp.

### Show Information
```bash
# Show all interfaces
ip addr
ip a

# Show specific interface
ip addr show eth0

# Show routing table
ip route
ip r

# Show neighbors (ARP table)
ip neigh
```

### Configure Interfaces
```bash
# Add IP address
sudo ip addr add 192.168.1.100/24 dev eth0

# Remove IP address
sudo ip addr del 192.168.1.100/24 dev eth0

# Bring interface up/down
sudo ip link set eth0 up
sudo ip link set eth0 down

# Add default route
sudo ip route add default via 192.168.1.1
```

---

## SS Command

Socket statistics — replacement for netstat.

```bash
# All listening ports
ss -tuln

# All TCP connections
ss -t

# All UDP sockets
ss -u

# Show process using socket
ss -tulnp

# Filter by port
ss -tuln sport = :22
ss -tuln dport = :443

# Show established connections
ss -t state established
```

### Common Flags
| Flag | Meaning |
|------|---------|
| -t | TCP |
| -u | UDP |
| -l | Listening |
| -n | Numeric (no DNS) |
| -p | Show process |
| -a | All sockets |

---

## Netstat (legacy)

Still useful, but prefer `ss`.

```bash
# Listening ports with process
netstat -tulnp

# All connections
netstat -an

# Routing table
netstat -r
```

---

## Firewalld

Default firewall on RHEL/CentOS 7+.

### Basic Commands
```bash
# Status
sudo firewall-cmd --state

# List all rules
sudo firewall-cmd --list-all

# List zones
sudo firewall-cmd --get-zones
sudo firewall-cmd --get-active-zones
```

### Managing Services
```bash
# Add service (temporary)
sudo firewall-cmd --add-service=http

# Add service (permanent)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# Remove service
sudo firewall-cmd --permanent --remove-service=http

# List available services
sudo firewall-cmd --get-services
```

### Managing Ports
```bash
# Add port
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Remove port
sudo firewall-cmd --permanent --remove-port=8080/tcp

# Add port range
sudo firewall-cmd --permanent --add-port=5000-5100/tcp
```

### Zones
```bash
# Change interface zone
sudo firewall-cmd --zone=trusted --change-interface=eth1

# Set default zone
sudo firewall-cmd --set-default-zone=public
```

---

## iptables

Low-level packet filtering — use when firewalld isn't available.

### View Rules
```bash
# List all rules
sudo iptables -L -n -v

# List with line numbers
sudo iptables -L --line-numbers

# List NAT rules
sudo iptables -t nat -L -n
```

### Common Rules
```bash
# Allow incoming SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow established connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Drop all other incoming
sudo iptables -A INPUT -j DROP

# Allow outgoing
sudo iptables -A OUTPUT -j ACCEPT
```

### Save/Restore
```bash
# Save rules (RHEL)
sudo iptables-save > /etc/sysconfig/iptables

# Restore rules
sudo iptables-restore < /etc/sysconfig/iptables
```

---

## DNS Tools

### dig
```bash
# Basic query
dig example.com

# Query specific record type
dig example.com MX
dig example.com TXT

# Query specific DNS server
dig @8.8.8.8 example.com

# Short output
dig +short example.com

# Trace resolution path
dig +trace example.com
```

### nslookup
```bash
# Basic lookup
nslookup example.com

# Reverse lookup
nslookup 8.8.8.8

# Query specific server
nslookup example.com 8.8.8.8
```

### host
```bash
# Simple lookup
host example.com

# Verbose
host -v example.com
```

---

## Network Troubleshooting

### Connectivity
```bash
# Ping
ping -c 4 example.com

# Traceroute
traceroute example.com
tracepath example.com

# MTR (combines ping + traceroute)
mtr example.com
```

### Port Testing
```bash
# Check if port is open
nc -zv hostname 22

# Telnet test
telnet hostname 80

# curl for HTTP
curl -v http://example.com
```

### tcpdump
```bash
# Capture on interface
sudo tcpdump -i eth0

# Filter by host
sudo tcpdump host 192.168.1.1

# Filter by port
sudo tcpdump port 80

# Write to file
sudo tcpdump -w capture.pcap

# Read from file
tcpdump -r capture.pcap
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `/etc/hosts` | Local hostname resolution |
| `/etc/resolv.conf` | DNS servers |
| `/etc/sysconfig/network-scripts/` | Interface configs (RHEL 7) |
| `/etc/NetworkManager/` | NetworkManager configs |
| `/etc/hostname` | System hostname |

---

## TODO

- [ ] NetworkManager (nmcli)
- [ ] Bonding/teaming
- [ ] VLANs
- [ ] Bridge configuration
- [ ] IPv6
