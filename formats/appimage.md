# AppImage

[AppImage](https://appimage.org/) is a universal Linux package format. Applications are packaged as single executable files that work on most Linux distributions without installation.

**`pkg_type`: `appimage`**

## AnyLinux AppImages

Most AppImages hosted by PkgForge are [AnyLinux AppImages](https://github.com/pkgforge-dev/Anylinux-AppImages) — community-built AppImages that bundle **all** dependencies and don't rely on host libraries. Unlike traditional AppImages, they work on:

- **Any glibc or musl-based distro** (Alpine, Void musl, etc.)
- **Non-FHS systems** (NixOS, Guix)
- **Older distributions** with outdated libraries

The only requirements are `/bin/sh` and a writable `/tmp`. They use [sharun](https://github.com/VHSgunzo/sharun) as a runtime with automatic fallback: FUSE → Linux namespaces → extract-and-run. File sizes are kept small through [DwarFS](https://github.com/mhx/dwarfs) compression.

300+ applications are available, maintained by [@Samueru-sama](https://github.com/Samueru-sama) and the community at [pkgforge-dev](https://github.com/pkgforge-dev).

## Features

- Single executable file — no installation needed
- Works on most Linux distributions
- Desktop integration via Soar
- Large ecosystem with upstream support

## Prerequisites

- [FUSE](/troubleshooting/fuse) — required for mounting (can be bypassed, see below)
- [Fonts](/troubleshooting/fonts) — for rendering non-Latin characters and emojis
- [User Namespaces](/troubleshooting/namespaces) — for sandboxing (Chromium-based apps)

## Running Without FUSE

```bash
# Per-invocation
./app.appimage --appimage-extract-and-run

# Via environment variable
export APPIMAGE_EXTRACT_AND_RUN=1
./app.appimage
```

## Sandboxing

AppImages have no built-in sandboxing.

## Quirks

::: danger
- **Never** run `strip`, `objcopy`, or any binary rewriting tool on AppImages. They will destroy the embedded `squashfs|dwarfs` archive, leaving only the runtime stub.
- A `.appimage` file is **not** a real ELF binary.
- On [NixOS](https://nixos.org/), do **not** follow the [NixOS wiki AppImage guide](https://wiki.nixos.org/wiki/Appimage) — it sets up `appimage-run` which uses `squashfuse` and breaks DwarFS-based AppImages (including all AnyLinux AppImages). Instead, just run the AppImage directly — the sharun runtime handles everything automatically.
:::

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "alacritty"
pkg_id: "pkgforge-dev.alacritty"
pkg_type: "appimage"
ghcr_pkg: "pkgforge-dev/alacritty"
description: "A cross-platform, GPU-accelerated terminal emulator"
provides:
  - "alacritty"
src_url:
  - "https://github.com/pkgforge-dev/alacritty-AppImage"
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  shell: "sh"
  pkgver: |
    VERSION=$(curl -qfsSL "https://api.github.com/repos/pkgforge-dev/alacritty-AppImage/releases/latest?per_page=20" | jq -r '.tag_name')
    echo "${VERSION%%@*}" | sed "s/^v//"
    echo "$VERSION"
  run: |
    soar dl "https://github.com/pkgforge-dev/alacritty-AppImage@${REMOTE_PKGVER}" --glob "*${ARCH}*.appimage" -o "./${PKG}" --yes
```

## See Also

- [AppImage documentation](https://docs.appimage.org/)
- [Troubleshooting FUSE](/troubleshooting/fuse)
