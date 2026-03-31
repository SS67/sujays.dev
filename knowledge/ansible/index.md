# Ansible Knowledge Base

Automation playbooks, roles, and patterns.

## Contents

- [Playbooks](playbooks.md) — Common patterns and examples
- [Roles](roles.md) — Role structure and best practices

## Quick Reference

### Commands
```bash
# Run playbook
ansible-playbook playbook.yml

# With inventory
ansible-playbook -i inventory.ini playbook.yml

# Limit hosts
ansible-playbook playbook.yml --limit webservers

# Check mode (dry run)
ansible-playbook playbook.yml --check

# Diff mode (show changes)
ansible-playbook playbook.yml --diff

# Verbose
ansible-playbook playbook.yml -v
ansible-playbook playbook.yml -vvv

# Extra variables
ansible-playbook playbook.yml -e "env=prod version=1.0"

# Ask for passwords
ansible-playbook playbook.yml --ask-become-pass
ansible-playbook playbook.yml -K

# Tags
ansible-playbook playbook.yml --tags "install,configure"
ansible-playbook playbook.yml --skip-tags "debug"

# List tasks/hosts
ansible-playbook playbook.yml --list-tasks
ansible-playbook playbook.yml --list-hosts
```

### Ad-hoc Commands
```bash
# Ping
ansible all -m ping

# Run command
ansible webservers -m command -a "uptime"

# Shell (with pipes)
ansible all -m shell -a "df -h | grep /dev"

# Copy file
ansible all -m copy -a "src=file.txt dest=/tmp/file.txt"

# Install package
ansible all -m yum -a "name=httpd state=present" -b

# Service
ansible all -m service -a "name=httpd state=started" -b
```

---

## Basic Playbook

```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes

  vars:
    http_port: 80

  tasks:
    - name: Install httpd
      yum:
        name: httpd
        state: present

    - name: Start and enable httpd
      service:
        name: httpd
        state: started
        enabled: yes

    - name: Copy index.html
      template:
        src: index.html.j2
        dest: /var/www/html/index.html
      notify: Restart httpd

  handlers:
    - name: Restart httpd
      service:
        name: httpd
        state: restarted
```

---

## Inventory

### INI Format
```ini
# inventory.ini
[webservers]
web1.example.com
web2.example.com

[dbservers]
db1.example.com

[production:children]
webservers
dbservers

[webservers:vars]
http_port=80
```

### YAML Format
```yaml
# inventory.yml
all:
  children:
    webservers:
      hosts:
        web1.example.com:
        web2.example.com:
      vars:
        http_port: 80
    dbservers:
      hosts:
        db1.example.com:
```

---

## Topics TODO

- [ ] Ansible Vault
- [ ] Dynamic inventory
- [ ] AWX / Tower
- [ ] Collections
- [ ] Molecule testing
- [ ] Custom modules
- [ ] Jinja2 templates
- [ ] Error handling
