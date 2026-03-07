# FlatImage

[FlatImage](https://github.com/ruanformigoni/flatimage) is a hybrid of Flatpak sandboxing with AppImage portability, created by [@ruanformigoni](https://github.com/ruanformigoni).

**`pkg_type`: `flatimage`**

## Features

- Built-in sandboxing ([permissions docs](https://flatimage.github.io/docs/cmd/perms/))
- Uses a base distro image (Alpine, CachyOS, etc.) as rootfs
- Modern desktop integration
- OCI image format

## Naming Convention

FlatImage packages include the base image in the name:

```
firefox-alpine.flatimage        # Alpine base
steam-cachyos.flatimage         # CachyOS base
librewolf-alpine-nix.flatimage  # Alpine + Nix overlay
```

## Prerequisites

- [FUSE](/troubleshooting/fuse) — required for mounting
- [Fonts](/troubleshooting/fonts) — for rendering non-Latin characters and emojis
- [User Namespaces](/troubleshooting/namespaces) — required for sandboxing

## Quirks

::: danger
- **Never** run `strip`, `objcopy`, or any binary rewriting tool on FlatImages. They will destroy the embedded `squashfs|dwarfs` archive, leaving only the runtime stub.
- A `.flatimage` file is **not** a real ELF binary.
:::

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "firefox-alpine"
pkg_id: "pkgforge-dev.firefox-alpine"
pkg_type: "flatimage"
ghcr_pkg: "pkgforge-dev/firefox-alpine"
app_id: "org.mozilla.firefox"
description: "Web browser (FlatImage)"
provides:
  - "firefox-alpine"
src_url:
  - "https://github.com/pkgforge-dev/firefox-flatimage"
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  shell: "bash"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/pkgforge-dev/firefox-flatimage/releases/latest" | jq -r '.tag_name'
  run: |
    soar dl "https://github.com/pkgforge-dev/firefox-flatimage" --match "flatimage" -o "./${PKG}" --yes
```

## See Also

- [FlatImage documentation](https://flatimage.github.io/docs/)
- [FlatImage GitHub](https://github.com/ruanformigoni/flatimage)
