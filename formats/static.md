# Static Binaries

Statically linked binaries with no runtime dependencies.

**`pkg_type`: `static`**

## Features

- Zero dependencies — works on any Linux system
- Single executable file
- No FUSE, namespaces, or fonts required
- Maximum portability

## Build Profile

Static binaries in PkgForge are built with:

- [mimalloc](https://github.com/microsoft/mimalloc) allocator for musl builds (better performance than default musl allocator)
- [LTO](https://gcc.gnu.org/wiki/LinkTimeOptimization) (Link-Time Optimization)
- [PIE](https://en.wikipedia.org/wiki/Position-independent_code) (Position-Independent Executable)

About 90% of static packages are built from source. The rest are fetched from upstream releases.

## Naming Convention

| Suffix | Meaning |
|---|---|
| `*source*` | Built from source |
| `*official*` | Built/fetched from official upstream |
| `*stable*` | Fetched from upstream, not built from source |

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "ripgrep"
pkg_id: "burntsushi.ripgrep"
pkg_type: "static"
ghcr_pkg: "burntsushi/ripgrep"
description: "A search tool that combines the usability of ag with the raw speed of grep"
license:
  - "MIT"
  - "Unlicense"
build_deps:
  - "docker"
note:
  - "Built from source with static musl linking"
  - "[PORTABLE] (Portable Static Binary)"
provides:
  - "rg"
src_url:
  - "https://github.com/BurntSushi/ripgrep"
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  container: "ghcr.io/pkgforge/devscripts/alpine-builder"
  shell: "bash"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/BurntSushi/ripgrep/releases/latest" | jq -r '.tag_name'
  run: |
    set -e
    cd "$(mktemp -d)"
    source "$HOME/.cargo/env"
    export RUST_TARGET="${ARCH}-unknown-linux-musl"
    export RUSTFLAGS="-C target-feature=+crt-static -C link-self-contained=yes"
    git clone --filter=blob:none --quiet "https://github.com/BurntSushi/ripgrep"
    cd ripgrep && git checkout "$PKGVER"
    cargo build --target="$RUST_TARGET" --profile=release-lto --features=pcre2
    cp "target/$RUST_TARGET/release-lto/rg" "$SBUILD_OUTDIR/rg"
    cp "LICENSE-MIT" "$SBUILD_OUTDIR/"
```

::: info
If the binary is a desktop application that needs desktop integration, it should use a [package format](/formats/) instead (AppImage, FlatImage, etc.).
:::
