# Ansible Roles

Role structure and best practices.

## Role Structure

```
roles/
└── webserver/
    ├── defaults/
    │   └── main.yml      # Default variables (lowest precedence)
    ├── files/
    │   └── app.conf      # Static files to copy
    ├── handlers/
    │   └── main.yml      # Handlers
    ├── meta/
    │   └── main.yml      # Role metadata and dependencies
    ├── tasks/
    │   └── main.yml      # Main task list
    ├── templates/
    │   └── config.j2     # Jinja2 templates
    ├── vars/
    │   └── main.yml      # Role variables (high precedence)
    └── README.md         # Documentation
```

---

## Creating a Role

```bash
# Using ansible-galaxy
ansible-galaxy init roles/webserver
```

---

## Example Role

### tasks/main.yml
```yaml
---
- name: Include OS-specific variables
  include_vars: "{{ ansible_os_family }}.yml"

- name: Install packages
  package:
    name: "{{ webserver_packages }}"
    state: present

- name: Configure webserver
  template:
    src: httpd.conf.j2
    dest: "{{ webserver_config_path }}"
  notify: Restart webserver

- name: Start service
  service:
    name: "{{ webserver_service }}"
    state: started
    enabled: yes
```

### defaults/main.yml
```yaml
---
webserver_port: 80
webserver_docroot: /var/www/html
webserver_server_admin: admin@example.com
```

### vars/RedHat.yml
```yaml
---
webserver_packages:
  - httpd
  - mod_ssl
webserver_service: httpd
webserver_config_path: /etc/httpd/conf/httpd.conf
```

### vars/Debian.yml
```yaml
---
webserver_packages:
  - apache2
  - libapache2-mod-ssl
webserver_service: apache2
webserver_config_path: /etc/apache2/apache2.conf
```

### handlers/main.yml
```yaml
---
- name: Restart webserver
  service:
    name: "{{ webserver_service }}"
    state: restarted
```

### meta/main.yml
```yaml
---
galaxy_info:
  author: Sujay
  description: Webserver role
  license: MIT
  min_ansible_version: "2.9"
  platforms:
    - name: EL
      versions:
        - 7
        - 8
    - name: Ubuntu
      versions:
        - focal
        - jammy

dependencies:
  - role: common
```

---

## Using Roles

### In Playbook
```yaml
---
- hosts: webservers
  become: yes
  roles:
    - common
    - webserver
    - { role: nginx, nginx_port: 8080 }
    - role: database
      vars:
        db_name: myapp
      tags: database
```

### With include_role
```yaml
- name: Include role conditionally
  include_role:
    name: webserver
  when: install_webserver | bool
```

---

## Best Practices

### 1. Defaults vs Vars
- `defaults/` — Variables users should override
- `vars/` — Internal variables, rarely overridden

### 2. Documentation
Always include a README.md:
```markdown
# Webserver Role

## Requirements
- RHEL 7+ or Ubuntu 18.04+

## Role Variables
| Variable | Default | Description |
|----------|---------|-------------|
| webserver_port | 80 | HTTP port |

## Example Playbook
\`\`\`yaml
- hosts: servers
  roles:
    - webserver
\`\`\`
```

### 3. Idempotency
Tasks should be safe to run multiple times:
```yaml
# Good - idempotent
- name: Ensure line in file
  lineinfile:
    path: /etc/config
    line: "setting=value"

# Bad - not idempotent
- name: Add line to file
  shell: echo "setting=value" >> /etc/config
```

### 4. Tags
```yaml
- name: Install packages
  package:
    name: "{{ packages }}"
  tags:
    - install
    - packages

- name: Configure
  template:
    src: config.j2
    dest: /etc/app/config
  tags:
    - configure
```

### 5. Molecule Testing
```bash
# Initialize molecule
molecule init scenario -r webserver

# Run tests
molecule test
```

---

## TODO

- [ ] Ansible Collections
- [ ] Galaxy publishing
- [ ] CI/CD for roles
