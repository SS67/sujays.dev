# Red Hat IdM (Identity Management)

Centralized identity, authentication, and policy.

## Overview

Red Hat IdM (FreeIPA) provides:
- User and group management
- Kerberos authentication
- LDAP directory
- DNS management
- Certificate authority
- Host-based access control (HBAC)
- Sudo rules
- Active Directory trust

## Architecture

```
┌─────────────────┐
│   IdM Server    │  ← Primary (writable)
│   (Primary)     │
└────────┬────────┘
         │ Replication
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Replica│ │Replica│  ← Read replicas
└───────┘ └───────┘
```

---

## Installation

### Server
```bash
# Install packages
sudo dnf install ipa-server ipa-server-dns

# Configure
sudo ipa-server-install \
  --domain=example.com \
  --realm=EXAMPLE.COM \
  --ds-password=DirectoryPassword \
  --admin-password=AdminPassword \
  --setup-dns \
  --forwarder=8.8.8.8

# Verify
kinit admin
ipa user-find
```

### Client
```bash
# Install
sudo dnf install ipa-client

# Configure
sudo ipa-client-install \
  --domain=example.com \
  --server=idm.example.com \
  --realm=EXAMPLE.COM

# Or auto-discover
sudo ipa-client-install --mkhomedir
```

---

## User Management

### CLI Commands
```bash
# Authenticate
kinit admin

# Add user
ipa user-add jdoe --first=John --last=Doe --email=jdoe@example.com

# Set password
ipa user-mod jdoe --password

# Find users
ipa user-find
ipa user-find --login=jdoe

# Show user
ipa user-show jdoe

# Disable user
ipa user-disable jdoe

# Delete user
ipa user-del jdoe
```

### Groups
```bash
# Add group
ipa group-add developers --desc="Development team"

# Add user to group
ipa group-add-member developers --users=jdoe

# List group members
ipa group-show developers
```

---

## Host Management

```bash
# Add host
ipa host-add web01.example.com

# Show host
ipa host-show web01.example.com

# Delete host
ipa host-del web01.example.com

# Generate OTP for enrollment
ipa host-add web02.example.com --random
```

---

## HBAC (Host-Based Access Control)

Control who can access which hosts.

```bash
# Disable default allow_all rule
ipa hbacrule-disable allow_all

# Create rule
ipa hbacrule-add allow_developers_webservers

# Add users/groups
ipa hbacrule-add-user allow_developers_webservers --groups=developers

# Add hosts/hostgroups
ipa hbacrule-add-host allow_developers_webservers --hostgroups=webservers

# Add services
ipa hbacrule-add-service allow_developers_webservers --hbacsvcs=sshd

# Test rule
ipa hbactest --user=jdoe --host=web01.example.com --service=sshd
```

---

## Sudo Rules

Centralized sudo management.

```bash
# Create sudo rule
ipa sudorule-add allow_developers_restart_httpd

# Add users
ipa sudorule-add-user allow_developers_restart_httpd --groups=developers

# Add hosts
ipa sudorule-add-host allow_developers_restart_httpd --hostgroups=webservers

# Add commands
ipa sudocmd-add "/usr/bin/systemctl restart httpd"
ipa sudorule-add-allow-command allow_developers_restart_httpd \
  --sudocmds="/usr/bin/systemctl restart httpd"
```

---

## DNS Management

```bash
# Add DNS zone
ipa dnszone-add internal.example.com

# Add A record
ipa dnsrecord-add example.com web01 --a-rec=192.168.1.10

# Add CNAME
ipa dnsrecord-add example.com www --cname-rec=web01.example.com.

# List records
ipa dnsrecord-find example.com
```

---

## Certificate Management

```bash
# Request certificate
ipa cert-request --principal=HTTP/web01.example.com server.csr

# Show certificate
ipa cert-show SERIAL_NUMBER

# List certificates
ipa cert-find
```

---

## AD Trust

Integrate with Active Directory.

```bash
# Prepare server
sudo ipa-adtrust-install

# Create trust
ipa trust-add ad.example.com --admin Administrator --password

# Show trust
ipa trust-show ad.example.com

# Allow AD users
ipa group-add-member developers --external "AD\Domain Users"
```

---

## Best Practices

1. **Replicas**
   - Minimum 2 replicas for HA
   - Place in different datacenters
   - Use hidden replicas for backups

2. **DNS**
   - Let IdM manage internal DNS
   - Use forwarders for external resolution

3. **Passwords**
   - Enforce password policies
   - Use OTP for privileged accounts

4. **HBAC**
   - Disable default allow_all
   - Least privilege principle
   - Test rules before enabling

5. **Backup**
   - Regular `ipa-backup` runs
   - Test restores periodically

---

## Troubleshooting

```bash
# Check services
ipactl status

# Restart services
sudo ipactl restart

# Check Kerberos
kinit admin
klist

# LDAP search
ldapsearch -x -H ldap://idm.example.com -b "dc=example,dc=com"

# Logs
journalctl -u ipa
/var/log/dirsrv/slapd-EXAMPLE-COM/
```

---

## TODO

- [ ] Replication setup
- [ ] Backup and recovery
- [ ] OTP/2FA
- [ ] Smart card authentication
- [ ] Automount
