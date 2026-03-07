# AppBundle

[AppBundle](https://github.com/xplshn/pelf/) is a portable executable packaging format and AppImage alternative, created by [@xplshn](https://github.com/xplshn). Applications are packed into single portable files with embedded dependencies, supporting both `dwarfs` and `squashfs` filesystems.

**`pkg_type`: `appbundle`**

## Features

- Easy to create and modify
- Embedded dependencies
- Self-contained structure
- Prebuilts available from [AppBundleHUB](https://github.com/xplshn/AppBundleHUB)

## Prerequisites

- [FUSE](/troubleshooting/fuse) — required for mounting
- [Fonts](/troubleshooting/fonts) — for rendering non-Latin characters and emojis
- [User Namespaces](/troubleshooting/namespaces) — for sandboxing

## Quirks

::: danger
- **Never** run `strip`, `objcopy`, or any binary rewriting tool on AppBundles. They will destroy the embedded `squashfs|dwarfs` archive, leaving only the runtime stub.
- A `.appbundle` file is **not** a real ELF binary.
:::

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "myapp"
pkg_id: "github.com.user.myapp"
pkg_type: "appbundle"
ghcr_pkg: "user/myapp"
description: "My application"
provides:
  - "myapp"
src_url:
  - "https://github.com/user/myapp"
x_exec:
  host:
    - "aarch64-linux"
    - "x86_64-linux"
  shell: "bash"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/user/myapp/releases/latest" | jq -r '.tag_name'
  run: |
    soar dl "https://github.com/user/myapp" --match "appbundle" -o "./${PKG}" --yes
```

## See Also

- [pelf — AppBundle creator](https://github.com/xplshn/pelf/)
- [AppBundleHUB](https://github.com/xplshn/AppBundleHUB)
