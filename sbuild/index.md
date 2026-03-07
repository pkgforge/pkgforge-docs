# SBUILD

SBUILD is a YAML-based build script format for creating portable Linux packages, inspired by [APKBUILD](https://wiki.alpinelinux.org/wiki/APKBUILD_Reference) and [PKGBUILD](https://wiki.archlinux.org/title/PKGBUILD). It separates package metadata from build logic, making it easy to read, write, and validate.

## Toolchain

| Tool | Description |
|---|---|
| **sbuild** | All-in-one tool: build, lint, generate metadata, and manage cache |

All tools are available in the [sbuilder](https://github.com/pkgforge/sbuilder) repository.

## Quick Example

```yaml
#!/SBUILD
_disabled: false

pkg: "alacritty"
pkg_id: "pkgforge-dev.alacritty"
pkg_type: "appimage"
ghcr_pkg: "pkgforge-dev/alacritty"
category:
  - "TerminalEmulator"
description: "A cross-platform, GPU-accelerated terminal emulator"
homepage:
  - "https://alacritty.org"
  - "https://github.com/alacritty/alacritty"
license:
  - "Apache-2.0"
provides:
  - "alacritty"
repology:
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

## Supported Formats

SBUILD can produce any of the supported [package formats](/formats/):

`appimage` · `appbundle` · `flatimage` · `runimage` · `nixappimage` · `archive` · `static` · `dynamic` · `gameimage`

## Next Steps

- [Specification](/sbuild/specification) — complete field reference
- [Instructions](/sbuild/instructions) — environment variables and output files
- [Examples](/sbuild/examples) — real-world SBUILD recipes
- [Linting](/sbuild/linting) — validating your SBUILD
