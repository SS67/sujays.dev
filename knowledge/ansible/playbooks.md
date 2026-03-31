# Ansible Playbook Patterns

Common patterns and examples for automation.

## Conditionals

```yaml
- name: Install on RHEL
  yum:
    name: httpd
    state: present
  when: ansible_os_family == "RedHat"

- name: Install on Debian
  apt:
    name: apache2
    state: present
  when: ansible_os_family == "Debian"

# Multiple conditions
- name: Configure production
  template:
    src: prod.conf.j2
    dest: /etc/app/config
  when:
    - env == "production"
    - ansible_memory_mb.real.total > 4096
```

---

## Loops

```yaml
# Simple list
- name: Install packages
  yum:
    name: "{{ item }}"
    state: present
  loop:
    - httpd
    - vim
    - git

# With index
- name: Create users
  user:
    name: "{{ item.name }}"
    groups: "{{ item.groups }}"
  loop:
    - { name: 'alice', groups: 'admin' }
    - { name: 'bob', groups: 'users' }

# Loop with dict
- name: Configure services
  service:
    name: "{{ item.key }}"
    state: "{{ item.value }}"
  loop: "{{ services | dict2items }}"
  vars:
    services:
      httpd: started
      firewalld: started
```

---

## Variables

### Variable Precedence (lowest to highest)
1. Role defaults
2. Inventory vars
3. Playbook vars
4. Role vars
5. Block vars
6. Task vars
7. Extra vars (-e)

### Using Variables
```yaml
vars:
  app_name: myapp
  app_port: 8080
  app_config:
    debug: false
    log_level: info

tasks:
  - name: Configure app
    template:
      src: config.j2
      dest: "/etc/{{ app_name }}/config.yml"

  - debug:
      msg: "Port is {{ app_port }}"

  - debug:
      var: app_config.log_level
```

---

## Handlers

```yaml
tasks:
  - name: Update config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify:
      - Reload nginx
      - Clear cache

handlers:
  - name: Reload nginx
    service:
      name: nginx
      state: reloaded

  - name: Clear cache
    command: /usr/local/bin/clear-cache.sh
```

---

## Error Handling

```yaml
# Ignore errors
- name: Check optional service
  command: systemctl status optional-service
  ignore_errors: yes

# Fail with message
- name: Check disk space
  fail:
    msg: "Not enough disk space"
  when: ansible_mounts[0].size_available < 1000000000

# Block with rescue
- name: Handle errors
  block:
    - name: Try something risky
      command: /opt/risky-command.sh

    - name: Continue if successful
      debug:
        msg: "Success!"

  rescue:
    - name: Handle failure
      debug:
        msg: "Something went wrong, cleaning up"

  always:
    - name: Always run this
      debug:
        msg: "Cleanup complete"
```

---

## Register and Debug

```yaml
- name: Get disk usage
  command: df -h
  register: disk_result

- name: Show result
  debug:
    var: disk_result.stdout_lines

- name: Check result
  debug:
    msg: "Low disk space!"
  when: "'100%' in disk_result.stdout"
```

---

## Templates (Jinja2)

```jinja2
{# templates/nginx.conf.j2 #}
server {
    listen {{ http_port }};
    server_name {{ server_name }};

    {% for location in locations %}
    location {{ location.path }} {
        proxy_pass {{ location.backend }};
    }
    {% endfor %}

    {% if ssl_enabled %}
    ssl_certificate {{ ssl_cert }};
    ssl_certificate_key {{ ssl_key }};
    {% endif %}
}
```

---

## Includes and Imports

```yaml
# Import (static, processed at parse time)
- import_tasks: common.yml

# Include (dynamic, processed at runtime)
- include_tasks: "{{ os_family }}.yml"

# Import playbook
- import_playbook: webservers.yml

# Include role
- include_role:
    name: nginx
  vars:
    nginx_port: 8080
```

---

## Delegation

```yaml
# Run on localhost
- name: Add to load balancer
  command: /usr/local/bin/add-to-lb {{ inventory_hostname }}
  delegate_to: localhost

# Run on specific host
- name: Update DNS
  nsupdate:
    server: "dns.example.com"
    zone: "example.com"
    record: "{{ inventory_hostname }}"
    value: "{{ ansible_default_ipv4.address }}"
  delegate_to: dns.example.com
```

---

## Common Modules

| Module | Purpose |
|--------|---------|
| `yum/apt/dnf` | Package management |
| `service` | Service management |
| `template` | Template files |
| `copy` | Copy files |
| `file` | File/directory management |
| `user/group` | User management |
| `command/shell` | Run commands |
| `lineinfile` | Edit single line |
| `blockinfile` | Edit block of lines |
| `git` | Git operations |
| `cron` | Cron jobs |
| `firewalld` | Firewall rules |
| `sysctl` | Kernel parameters |

---

## TODO

- [ ] Async tasks
- [ ] Strategy plugins
- [ ] Callback plugins
- [ ] Inventory plugins
