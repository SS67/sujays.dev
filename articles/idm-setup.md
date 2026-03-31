# Identity Management with Red Hat IdM

*Centralized authentication and authorization using FreeIPA / Red Hat IdM*

## Overview

Red Hat Identity Management (IdM), built on FreeIPA, provides a single point of control for authentication, authorization, and account management across RHEL systems. It bundles Kerberos, LDAP, a certificate authority, DNS, and host-based access control into one cohesive platform.

---

## Architecture

```
                    ┌──────────────────────────────┐
                    │  IdM Master (Primary)         │
                    │  - Kerberos KDC              │
                    │  - LDAP (389-ds)             │
                    │  - CA (Dogtag)               │
                    │  - DNS                        │
                    └────────────┬─────────────────┘
                                 │ replication
                    ┌────────────▼─────────────────┐
                    │  IdM Replica                  │
                    │  - Kerberos KDC (secondary)  │
                    │  - LDAP replica              │
                    └──────────────────────────────┘
```

- **Always deploy at least two replicas** for high availability.
- Place replicas in different failure domains (racks, availability zones).
- Replicas sync bi-directionally via multi-master replication.

---

## Server Installation

### Prerequisites

```bash
# Set hostname (FQDN required)
hostnamectl set-hostname idm01.example.com

# Disable firewalld during install (re-enable after)
systemctl stop firewalld

# Synchronise time — Kerberos requires < 5 min clock skew
chronyc -a makestep
```

### Install & Configure

```bash
# Install IdM server packages
dnf install ipa-server ipa-server-dns

# Run the installer
ipa-server-install \
  --realm=EXAMPLE.COM \
  --domain=example.com \
  --ds-password='DirectoryPassword!' \
  --admin-password='AdminPassword!' \
  --mkhomedir \
  --setup-dns \
  --forwarder=8.8.8.8 \
  --unattended
```

### Firewall Rules

```bash
firewall-cmd --permanent --add-service=freeipa-ldap
firewall-cmd --permanent --add-service=freeipa-ldaps
firewall-cmd --permanent --add-service=freeipa-replication
firewall-cmd --permanent --add-service=kerberos
firewall-cmd --permanent --add-service=kadmin
firewall-cmd --permanent --add-service=dns
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## User & Group Management

### Users

```bash
# Create a user
ipa user-add jsmith \
  --first=John --last=Smith \
  --email=jsmith@example.com \
  --shell=/bin/bash

# Set password (forces change on first login)
ipa passwd jsmith

# Disable / enable
ipa user-disable jsmith
ipa user-enable  jsmith

# Find users
ipa user-find --all | grep "User login"
```

### Groups

```bash
# Create a group
ipa group-add devops --desc "DevOps Engineers"

# Add members
ipa group-add-member devops --users=jsmith,alee

# Nested groups
ipa group-add-member infra --groups=devops
```

---

## Host-Based Access Control (HBAC)

HBAC rules control which users can log in to which hosts via which services.

```bash
# Create an HBAC rule: devops can SSH to web servers
ipa hbacrule-add allow_devops_web \
  --desc "DevOps SSH access to web tier"

ipa hbacrule-add-user  allow_devops_web --groups=devops
ipa hbacrule-add-host  allow_devops_web --hostgroups=webservers
ipa hbacrule-add-service allow_devops_web --hbacsvcs=sshd

# Test a rule before deploying
ipa hbactest --user=jsmith --host=web01.example.com --service=sshd
```

---

## Sudo Rules

Manage sudo centrally — no more editing `/etc/sudoers` on every host.

```bash
# Create a sudo command group
ipa sudocmd-add /usr/bin/systemctl
ipa sudocmdgroup-add systemctl-cmds
ipa sudocmdgroup-add-member systemctl-cmds --sudocmds=/usr/bin/systemctl

# Create a sudo rule
ipa sudorule-add devops_systemctl \
  --desc "DevOps can manage systemd services"
ipa sudorule-add-user  devops_systemctl --groups=devops
ipa sudorule-add-host  devops_systemctl --hostgroups=webservers
ipa sudorule-add-allow-command devops_systemctl --sudocmdgroups=systemctl-cmds
```

---

## Enrolling Client Hosts

```bash
# Install client packages
dnf install ipa-client

# Enroll the host
ipa-client-install \
  --server=idm01.example.com \
  --domain=example.com \
  --realm=EXAMPLE.COM \
  --principal=admin \
  --password='AdminPassword!' \
  --mkhomedir \
  --unattended
```

For Ansible-managed fleets, use the `freeipa.ansible_freeipa` collection:

```yaml
- name: Enroll hosts into IdM
  hosts: rhel_servers
  roles:
    - role: freeipa.ansible_freeipa.ipaclient
      vars:
        ipaserver_domain: example.com
        ipaserver_realm: EXAMPLE.COM
        ipaadmin_password: "{{ vault_ipa_admin_password }}"
        ipaclient_mkhomedir: true
```

---

## Active Directory Trust

Link IdM to an existing Active Directory forest so AD users can log in to RHEL systems.

```bash
# Install AD trust support
dnf install ipa-server-trust-ad

# Add the trust
ipa trust-add --type=ad corp.example.com \
  --admin=Administrator \
  --password

# Verify
ipa trust-show corp.example.com
```

Once the trust is active, AD groups can be used in HBAC and sudo rules.

---

## Useful Day-Two Commands

```bash
# Check replication status
ipa-replica-manage list
ipa-replica-manage -v list-ruv

# Force password expiry
ipa user-mod jsmith --setattr=krbPasswordExpiration=20250101000000Z

# Show all HBAC rules
ipa hbacrule-find --all

# Kerberos ticket info
klist -v
kinit admin
```

---

*Last updated: 2025*
