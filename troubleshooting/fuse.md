# FUSE

FUSE (Filesystem in Userspace) allows non-root users to mount filesystems. Many portable packages (AppImage, FlatImage, RunImage, etc.) require FUSE to run.

## Checking FUSE Support

```bash
# Check if the FUSE device exists
ls -l /dev/fuse
# Should show: crw-rw-rw- 1 root root 10, 229 ...

# Check fusermount version
fusermount --version
```

## Installation

### Alpine Linux

```bash
apk update
apk add fuse fuse3
```

### Arch Linux & Derivatives

```bash
pacman -Sy fuse2 fuse3
```

### Debian & Derivatives

```bash
sudo apt update
sudo apt install fuse3
```

## Running Without FUSE

If you cannot install FUSE:

```bash
# AppImage
./package.appimage --appimage-extract-and-run
# or
export APPIMAGE_EXTRACT_AND_RUN=1
./package.appimage

# RunImage
./package.runimage --runtime-extract-and-run
# or
export RUNTIME_EXTRACT_AND_RUN=1
./package.runimage
```

## Common Issues

### "fuse: device not found"

Install FUSE as shown above, then reboot.

### "permission denied" on mount

Ensure you're in the `fuse` group:

```bash
sudo usermod -aG fuse $USER
# Log out and back in
```

## See Also

- [AppImage troubleshooting](https://docs.appimage.org/user-guide/troubleshooting/)
- [Namespaces](/troubleshooting/namespaces)
