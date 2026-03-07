# Examples

Real-world SBUILD recipes from [soarpkgs](https://github.com/pkgforge/soarpkgs).

## Static Binary — fzf

Downloads a prebuilt static binary from GitHub:

```yaml
#!/SBUILD
_disabled: false

pkg: "fzf"
pkg_id: "junegunn.fzf"
pkg_type: "static"
ghcr_pkg: "junegunn/fzf"
category:
  - "ConsoleOnly"
  - "Utility"
description: "A command-line fuzzy finder"
homepage:
  - "https://github.com/junegunn/fzf"
maintainer:
  - "QaidVoid (contact@qaidvoid.dev)"
license:
  - "MIT"
build_asset:
  - url: "https://raw.githubusercontent.com/junegunn/fzf/master/LICENSE"
    out: "LICENSE"
note:
  - "Official binary from https://github.com/junegunn/fzf"
  - "[PORTABLE] (Portable Static Binary)"
  - "[NO_DESKTOP_INTEGRATION]"
provides:
  - "fzf"
repology:
  - "fzf"
src_url:
  - "https://github.com/junegunn/fzf"
tag:
  - "dev-tools"
  - "cli"
  - "utility"
  - "fuzzy-finder"
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
    mv "$SBUILD_TMPDIR/LICENSE" "$SBUILD_OUTDIR/LICENSE"
    rm -f "fzf.tar.gz"
```

## Static Binary — Built from Source

Building from source inside a container with static musl linking:

```yaml
#!/SBUILD
_disabled: false

pkg: "ripgrep"
pkg_id: "burntsushi.ripgrep"
pkg_type: "static"
ghcr_pkg: "burntsushi/ripgrep"
category:
  - "ConsoleOnly"
  - "Utility"
description: "A search tool that combines the usability of ag with the raw speed of grep"
homepage:
  - "https://github.com/BurntSushi/ripgrep"
maintainer:
  - "QaidVoid (contact@qaidvoid.dev)"
license:
  - "MIT"
  - "Unlicense"
build_deps:
  - "docker"
note:
  - "Built from source with static musl linking"
  - "[PORTABLE] (Portable Static Binary)"
  - "[NO_DESKTOP_INTEGRATION]"
provides:
  - "rg"
repology:
  - "ripgrep"
src_url:
  - "https://github.com/BurntSushi/ripgrep"
tag:
  - "dev-tools"
  - "cli"
  - "utility"
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
    cd ripgrep
    git checkout "$PKGVER"
    cargo build --target="$RUST_TARGET" --profile=release-lto --features=pcre2
    cp "target/$RUST_TARGET/release-lto/rg" "$SBUILD_OUTDIR/rg"
    cp "LICENSE-MIT" "$SBUILD_OUTDIR/"
```

## AppImage — Prebuilt Download

Downloading a prebuilt AppImage with multi-architecture support:

```yaml
#!/SBUILD
_disabled: false

pkg: "ghostty"
pkg_id: "pkgforge-dev.ghostty"
pkg_type: "appimage"
ghcr_pkg: "pkgforge-dev/ghostty"
category:
  - "TerminalEmulator"
description: "Fast, native, feature-rich terminal emulator pushing modern features"
homepage:
  - "https://ghostty.org"
  - "https://github.com/ghostty-org/ghostty"
maintainer:
  - "psadi (https://github.com/psadi)"
license:
  - "MIT"
build_asset:
  - url: "https://github.com/ghostty-org/ghostty/raw/918ccdba5cc65ccd1fb48a54c71306d869299441/LICENSE"
    out: "LICENSE"
note:
  - "Fetched from Pre Built Community Created AppImage. Check/Report @ https://github.com/pkgforge-dev/ghostty-appimage"
  - "[PORTABLE] (Works on AnyLinux)"
provides:
  - "ghostty"
repology:
  - "ghostty"
src_url:
  - "https://github.com/pkgforge-dev/ghostty-appimage"
tag:
  - "terminal"
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  shell: "sh"
  pkgver: |
    VERSION=$(curl -qfsSL "https://api.github.com/repos/pkgforge-dev/ghostty-appimage/releases/latest?per_page=20" | jq -r '.tag_name');
    echo "${VERSION#v}"
    echo "${VERSION}"
  run: |
    soar dl "https://github.com/pkgforge-dev/ghostty-appimage@${REMOTE_PKGVER}" --glob "*${ARCH}*.appimage" -o "./${PKG}" --yes
```

## Rolling Build

For packages without versioned releases — just use `x_exec.pkgver` without setting a static `pkgver`:

```yaml
#!/SBUILD
_disabled: false

pkg: "example-nightly"
pkg_type: "static"
ghcr_pkg: "example/example-nightly"
description: "Nightly build example"
src_url:
  - "https://github.com/example/repo"
provides:
  - "example"
x_exec:
  host:
    - "aarch64-linux"
    - "x86_64-linux"
  shell: "bash"
  pkgver: |
    echo "nightly-$(date +%Y%m%d)"
  run: |
    git clone "https://github.com/example/repo" --depth=1
    cd repo && make
    cp build/example "${SBUILD_OUTDIR}/${PKG}"
```

## Building Your Package

1. Create an SBUILD recipe (e.g. `.github/SBUILD/myapp.yaml`)
2. Validate: `sbuild lint .github/SBUILD/myapp.yaml`
3. Test locally: `sbuild .github/SBUILD/myapp.yaml`
4. Submit to [soarpkgs](https://github.com/pkgforge/soarpkgs) via PR

Browse more examples at [github.com/pkgforge/soarpkgs/tree/main/packages](https://github.com/pkgforge/soarpkgs/tree/main/packages).
