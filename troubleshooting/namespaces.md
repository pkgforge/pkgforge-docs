# User Namespaces

User namespaces isolate user and group IDs between processes. They allow packages to run sandboxed without root privileges. Many portable packages (AppImage, FlatImage, RunImage) require user namespaces for sandboxing and security.

## Checking Support

```bash
# Check if enabled at kernel level
sysctl -n user.max_user_namespaces
# Should print a number (not 0)

# Check if unshare works
unshare --user echo "User namespaces supported"
```

## Common Issues

### "Your kernel does not support user namespaces"

**Cause**: `/proc/self/ns/user` doesn't exist or kernel lacks support.

**Solutions**:

1. Install SUID Bubblewrap (for RunImage):
```bash
wget "https://bin.pkgforge.dev/$(uname -m)/bwrap" -O "/tmp/bwrap"
sudo cp -f "/tmp/bwrap" "/usr/bin/bwrap"
sudo chmod u+s "/usr/bin/bwrap"
```

2. Install a kernel with user namespace support (e.g., XanMod kernel)

### "You must Enable unprivileged_userns_clone"

**Cause**: `/proc/sys/kernel/unprivileged_userns_clone == 0`

```bash
echo "kernel.unprivileged_userns_clone=1" | sudo tee "/etc/sysctl.d/98-unprivileged-userns-clone.conf"
echo "1" | sudo tee "/proc/sys/kernel/unprivileged_userns_clone"
sudo service procps restart
sudo sysctl -p "/etc/sysctl.conf"
# Reboot
```

### "You must Enable max_user_namespaces"

**Cause**: `/proc/sys/user/max_user_namespaces == 0`

```bash
echo "user.max_user_namespaces=10000" | sudo tee "/etc/sysctl.d/98-max-user-namespaces.conf"
echo "100000" | sudo tee "/proc/sys/user/max_user_namespaces"
sudo service procps restart
sudo sysctl -p "/etc/sysctl.conf"
# Reboot
```

### "You must Disable userns_restrict"

**Cause**: `/proc/sys/kernel/userns_restrict == 1`

```bash
echo "kernel.userns_restrict=0" | sudo tee "/etc/sysctl.d/98-userns.conf"
echo "0" | sudo tee "/proc/sys/kernel/userns_restrict"
sudo service procps restart
sudo sysctl -p "/etc/sysctl.conf"
# Reboot
```

### "You must Disable apparmor_restrict_unprivileged_userns"

**Cause**: Ubuntu 23.10+ restricts unprivileged user namespaces via AppArmor. See [Ubuntu's blog post](https://ubuntu.com/blog/ubuntu-23-10-restricted-unprivileged-user-namespaces).

```bash
echo "kernel.apparmor_restrict_unprivileged_userns=0" | sudo tee "/etc/sysctl.d/98-apparmor-unuserns.conf"
echo "0" | sudo tee "/proc/sys/kernel/apparmor_restrict_unprivileged_userns"
sudo service procps restart
sudo sysctl -p "/etc/sysctl.conf"
# Reboot
```

## Verifying

```bash
unshare --user echo "User namespaces supported"
```

## See Also

- [FUSE](/troubleshooting/fuse) — filesystem requirements
- [Baeldung Guide](https://www.baeldung.com/linux/kernel-enable-user-namespaces)
- [man user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)
