# RunImage

[RunImage](https://github.com/VHSgunzo/runimage) is a portable single-file Linux container format, created by [@VHSgunzo](https://github.com/VHSgunzo). Packages are built on top of a [base RunImage](https://github.com/pkgforge-dev/runimage-base).

**`pkg_type`: `runimage`**

## Features

- Built-in sandboxing ([usage docs](https://github.com/VHSgunzo/runimage#usage))
- Self-contained runtime with full rootfs
- No host dependencies
- Can run without FUSE

## Prerequisites

- [FUSE](/troubleshooting/fuse) — required for mounting (can be bypassed, see below)
- [Fonts](/troubleshooting/fonts) — for rendering non-Latin characters and emojis
- [User Namespaces](/troubleshooting/namespaces) — required for sandboxing

## Running Without FUSE

```bash
# Per-invocation
./app.runimage --runtime-extract-and-run

# Via environment variable
export RUNTIME_EXTRACT_AND_RUN=1
./app.runimage
```

## Quirks

::: danger
- **Never** run `strip`, `objcopy`, or any binary rewriting tool on RunImages. They will destroy the embedded `squashfs|dwarfs` archive, leaving only the runtime stub.
- A `.runimage` file is **not** a real ELF binary.
:::

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "mytool"
pkg_id: "github.com.user.mytool"
pkg_type: "runimage"
ghcr_pkg: "user/mytool"
description: "My CLI tool"
provides:
  - "mytool"
src_url:
  - "https://github.com/user/mytool"
x_exec:
  host:
    - "aarch64-linux"
    - "x86_64-linux"
  shell: "bash"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/user/mytool/releases/latest" | jq -r '.tag_name'
  run: |
    soar dl "https://github.com/user/mytool" --match "runimage" -o "./${PKG}" --yes
```

## See Also

- [RunImage GitHub](https://github.com/VHSgunzo/runimage)
- [RunImage Base](https://github.com/pkgforge-dev/runimage-base)
