---
layout: home

hero:
  name: PkgForge
  text: Portable Packages for Linux
  tagline: An ecosystem of tools and infrastructure for distributing and installing self-contained packages on any Linux distribution
  image:
    src: /logo.png
    alt: PkgForge
  actions:
    - theme: brand
      text: Browse Packages
      link: https://pkgs.pkgforge.qaidvoid.dev
    - theme: alt
      text: Soar Docs
      link: https://soar.qaidvoid.dev
    - theme: alt
      text: Create a Package
      link: /contributing/creating-packages

features:
  - title: AnyLinux AppImages
    details: 300+ AppImages that truly work on any Linux system — including musl-libc, non-FHS, and older distros. Zero host dependencies required.
  - title: Multiple Formats
    details: AppImage, AppBundle, FlatImage, RunImage, NixAppImage, Archive, and static binaries — all self-contained.
  - title: Simple Build System
    details: Declarative YAML-based SBUILD recipes make packaging applications straightforward.
  - title: Verified & Transparent
    details: All packages are built in CI with public logs, checksums, attestations, and minisign signatures.
---

## AnyLinux AppImages

Most AppImages from PkgForge are [AnyLinux AppImages](https://github.com/pkgforge-dev/Anylinux-AppImages) — they bundle **all** dependencies and don't rely on host libraries. Unlike traditional AppImages:

- Work on **any glibc or musl-based distro** (Alpine, Void musl, NixOS, Guix, etc.)
- **No FUSE required** — the [sharun](https://github.com/VHSgunzo/sharun) runtime falls back automatically (FUSE → namespaces → extract-and-run)
- Only need `/bin/sh` and a writable `/tmp`
- Smaller sizes via [DwarFS](https://github.com/mhx/dwarfs) compression

300+ applications available and growing. See the [AppImage format page](/formats/appimage) for details.

## Quick Start

Install [Soar](https://soar.qaidvoid.dev), the package manager:

```bash
curl -fsSL "https://soar.qaidvoid.dev/install.sh" | sh
```

Then install packages:

```bash
soar install firefox       # Install a package
soar search ripgrep        # Search for packages
soar update                # Update all packages
soar remove firefox        # Remove a package
```

## Create Your Own Package

Write an SBUILD recipe to package any application:

```yaml
#!/SBUILD
_disabled: false

pkg: "fzf"
pkg_id: "junegunn.fzf"
pkg_type: "static"
ghcr_pkg: "junegunn/fzf"
description: "A command-line fuzzy finder"
homepage:
  - "https://github.com/junegunn/fzf"
license:
  - "MIT"
provides:
  - "fzf"
src_url:
  - "https://github.com/junegunn/fzf"
x_exec:
  host:
    - "aarch64-linux"
    - "x86_64-linux"
  shell: "sh"
  pkgver: |
    VERSION=$(curl -qfsSL "https://api.github.com/repos/junegunn/fzf/releases/latest" | jq -r '.tag_name')
    echo "${VERSION#v}"
  run: |
    soar dl "github:junegunn/fzf@v${PKGVER}" --glob "*linux_${ARCH_ALT}.tar.gz" -o "./fzf.tar.gz" --yes
    tar -xf "fzf.tar.gz" -C "$SBUILD_TMPDIR/"
    mv "$SBUILD_TMPDIR/fzf" "$SBUILD_OUTDIR/$PKG"
```

See [Creating Packages](/contributing/creating-packages) for the full guide, or read the [SBUILD Specification](/sbuild/specification).
