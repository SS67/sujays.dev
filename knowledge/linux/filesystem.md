# Linux Filesystem

Storage management, LVM, filesystems, and disk operations.

## Disk Information

```bash
# List block devices
lsblk

# List with filesystem info
lsblk -f

# Disk usage
df -h

# Directory size
du -sh /path/to/dir
du -sh * | sort -h

# Disk partitions
fdisk -l
```

---

## LVM (Logical Volume Manager)

### Concepts
```
Physical Volumes (PV) → Volume Groups (VG) → Logical Volumes (LV)
     /dev/sdb              vg_data              lv_data
     /dev/sdc
```

### Physical Volumes
```bash
# Create PV
sudo pvcreate /dev/sdb

# List PVs
sudo pvs
sudo pvdisplay

# Remove PV
sudo pvremove /dev/sdb
```

### Volume Groups
```bash
# Create VG
sudo vgcreate vg_data /dev/sdb /dev/sdc

# Extend VG (add disk)
sudo vgextend vg_data /dev/sdd

# List VGs
sudo vgs
sudo vgdisplay

# Remove VG
sudo vgremove vg_data
```

### Logical Volumes
```bash
# Create LV (specify size)
sudo lvcreate -L 10G -n lv_data vg_data

# Create LV (use all free space)
sudo lvcreate -l 100%FREE -n lv_data vg_data

# List LVs
sudo lvs
sudo lvdisplay

# Extend LV
sudo lvextend -L +5G /dev/vg_data/lv_data
sudo lvextend -l +100%FREE /dev/vg_data/lv_data

# Resize filesystem after extend
sudo resize2fs /dev/vg_data/lv_data   # ext4
sudo xfs_growfs /mountpoint            # xfs

# Reduce LV (ext4 only, dangerous)
sudo umount /mountpoint
sudo e2fsck -f /dev/vg_data/lv_data
sudo resize2fs /dev/vg_data/lv_data 5G
sudo lvreduce -L 5G /dev/vg_data/lv_data

# Remove LV
sudo lvremove /dev/vg_data/lv_data
```

---

## Filesystems

### Create Filesystem
```bash
# XFS (default RHEL)
sudo mkfs.xfs /dev/vg_data/lv_data

# ext4
sudo mkfs.ext4 /dev/vg_data/lv_data

# Check filesystem type
blkid /dev/vg_data/lv_data
```

### Mount
```bash
# Mount temporarily
sudo mount /dev/vg_data/lv_data /mnt/data

# Mount with options
sudo mount -o rw,noatime /dev/sdb1 /mnt/data

# Unmount
sudo umount /mnt/data

# Force unmount
sudo umount -f /mnt/data

# Lazy unmount
sudo umount -l /mnt/data
```

### fstab (Persistent Mounts)

File: `/etc/fstab`

```
# <device>                <mountpoint>  <type>  <options>        <dump> <fsck>
/dev/vg_data/lv_data      /data         xfs     defaults         0      0
UUID=xxxx-xxxx            /backup       ext4    defaults,noatime 0      2
```

```bash
# Get UUID
blkid

# Test fstab without reboot
sudo mount -a

# Reload systemd after fstab changes
sudo systemctl daemon-reload
```

---

## XFS Commands

```bash
# Create
sudo mkfs.xfs /dev/sdb1

# Grow (online, no shrink)
sudo xfs_growfs /mountpoint

# Check/repair (unmounted)
sudo xfs_repair /dev/sdb1

# Info
xfs_info /mountpoint

# Backup
xfsdump -f /backup/data.dump /data

# Restore
xfsrestore -f /backup/data.dump /data
```

---

## ext4 Commands

```bash
# Create
sudo mkfs.ext4 /dev/sdb1

# Check/repair
sudo e2fsck -f /dev/sdb1

# Resize
sudo resize2fs /dev/sdb1

# Tune options
sudo tune2fs -l /dev/sdb1  # list
sudo tune2fs -L "mylabel" /dev/sdb1  # set label
```

---

## Partitioning

### fdisk (MBR)
```bash
sudo fdisk /dev/sdb
# n - new partition
# d - delete partition
# p - print table
# w - write and exit
```

### gdisk (GPT)
```bash
sudo gdisk /dev/sdb
# Similar commands to fdisk
```

### parted
```bash
sudo parted /dev/sdb
# mklabel gpt
# mkpart primary xfs 0% 100%
# print
# quit
```

---

## Swap

```bash
# Create swap file
sudo dd if=/dev/zero of=/swapfile bs=1G count=4
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to fstab
/swapfile none swap sw 0 0

# Check swap
swapon --show
free -h

# Disable swap
sudo swapoff /swapfile
```

---

## Useful Commands

```bash
# Find large files
find / -type f -size +100M 2>/dev/null

# Find large directories
du -h --max-depth=1 / | sort -h

# Disk I/O stats
iostat -x 1

# Watch disk space
watch -n 1 df -h

# Check what's using a mount
lsof +D /mountpoint
fuser -vm /mountpoint
```

---

## TODO

- [ ] NFS
- [ ] CIFS/SMB
- [ ] iSCSI
- [ ] Stratis
- [ ] RAID (mdadm)
