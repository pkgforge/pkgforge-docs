# Archive

Self-extracting or compressed archives for portable distribution.

**`pkg_type`: `archive`**

## Features

- Simplest format — no runtime required
- Universal support across all systems
- No FUSE or namespace requirements
- Supports multiple compression formats

## Supported Formats

`.7z`, `.bz`, `.bz2`, `.gz`, `.lz4`, `.lzma`, `.rar`, `.sz`, `.tar`, `.xz`, `.zst`, and combinations thereof. Also includes self-extracting formats like [alpix](https://github.com/QaidVoid/alpix) and [staticx](https://github.com/JonathonReinhart/staticx).

## Build Profiles

Packages are typically built with:

- [wrappe](https://github.com/Systemcluster/wrappe) — if the upstream source is already portable
- [sharun](https://github.com/VHSgunzo/sharun) + [wrappe](https://github.com/Systemcluster/wrappe)/[uruntime](https://github.com/VHSgunzo/uruntime) — if the upstream source needs to be made portable

## Naming Convention

Archive package names often include a build method suffix:

| Suffix | Meaning |
|---|---|
| `*sharun*` | Packaged with [sharun](https://github.com/VHSgunzo/sharun) |
| `*wrappe*` | Packaged with [wrappe](https://github.com/Systemcluster/wrappe) |
| `*source*` | Built from source |
| `*stable*` | Fetched from upstream prebuilt |
| `*npm*` | Packaged from [npm](https://www.npmjs.com/) |
| `*pypi*` | Packaged from [PyPI](https://pypi.org/) |

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "mytool"
pkg_id: "github.com.user.mytool"
pkg_type: "archive"
ghcr_pkg: "user/mytool"
description: "My tool (archive)"
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
    soar dl "https://github.com/user/mytool" --match "tar.gz" -o "./${PKG}" --yes
```
