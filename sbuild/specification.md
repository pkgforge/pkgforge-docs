# SBUILD Specification

Complete reference for all SBUILD recipe fields. Each field is marked as:

- <Badge type="danger" text="REQUIRED" /> — must be present
- <Badge type="tip" text="RECOMMENDED" /> — optional but encouraged
- <Badge type="info" text="OPTIONAL" /> — fully optional

## Shebang & Control Fields

### `#!/SBUILD` <Badge type="danger" text="REQUIRED" />

All SBUILD recipes must begin with the `#!/SBUILD` shebang line. Optionally append a version assertion: `#!/SBUILD ver @v1.0.0`.

```yaml
#!/SBUILD
```

### `_disabled` <Badge type="danger" text="REQUIRED" />

Controls whether the recipe is enabled.

```yaml
_disabled: false
```

---

## Package Identity

### `pkg` <Badge type="danger" text="REQUIRED" />

The canonical package name. Must be non-empty and contain only `[a-zA-Z0-9+\-_.]`.

```yaml
pkg: "clipcat"
```

### `pkg_id` <Badge type="tip" text="RECOMMENDED" />

Unique package identifier. Same character constraints as `pkg`. If omitted, auto-derived from the first `src_url` entry (e.g. `https://github.com/user/repo` becomes `github.com.user.repo`).

```yaml
pkg_id: "xrelkd.clipcat"
```

::: info
When a repo produces multiple variants, append a tag: `github.com.user.repo.stable`, `github.com.user.repo.nightly`
:::

### `pkg_type` <Badge type="tip" text="RECOMMENDED" />

The package format (must be lowercase). If empty, the runner reads magic bytes to determine the format automatically.

```yaml
pkg_type: "static"
```

Valid values: `appimage`, `appbundle`, `archive`, `dynamic`, `flatimage`, `gameimage`, `nixappimage`, `runimage`, `static`

### `app_id` <Badge type="tip" text="RECOMMENDED" />

[AppStream App ID](https://www.freedesktop.org/software/appstream/docs/chap-Metadata.html#tag-id-generic) for desktop integration. Find it on [Flathub](https://flathub.org/) or in AppStream `metainfo.xml` files.

```yaml
app_id: "org.xrelkd.clipcat"
```

::: info
This is **not** the same as `pkg_id`. `app_id` is for desktop integration, `pkg_id` is for identifying the package within PkgForge.
:::

---

## Version

### `pkgver` <Badge type="info" text="OPTIONAL" />

Static package version string. Both `pkgver` and `version` are accepted as keys. When set, `x_exec.pkgver` is still used for update checking.

```yaml
pkgver: "0.24.0"
```

::: warning
Only use this if you want to pin a fixed version and update it manually. In most cases, let `x_exec.pkgver` determine the version dynamically.
:::

---

## Metadata

### `description` <Badge type="danger" text="REQUIRED" />

Package description. Can be a simple string or a mapping with per-program descriptions.

**Simple string:**

```yaml
description: "A clipboard manager written in Rust"
```

**Per-program descriptions** (when a recipe [provides multiple programs](#provides)):

```yaml
description:
  _default: "A toolset for network analysis"
  nmap: "Network exploration and security auditing tool"
  ncat: "Concatenation and redirection utility for networks"
```

When using a mapping, `_default` is used as the primary description.

### `homepage` <Badge type="info" text="OPTIONAL" />

Project homepage URLs (not the download page — that's `src_url`). Must have `http`, `https`, or `ftp` scheme.

```yaml
homepage:
  - "https://github.com/xrelkd/clipcat"
```

### `src_url` <Badge type="danger" text="REQUIRED" />

Source/upstream URLs pointing to the download page or repository. Used for auto-deriving `pkg_id` if not set. Must have `http`, `https`, or `ftp` scheme.

```yaml
src_url:
  - "https://github.com/xrelkd/clipcat"
```

### `category` <Badge type="tip" text="RECOMMENDED" />

[FreeDesktop categories](https://specifications.freedesktop.org/menu-spec/latest/category-registry.html). Defaults to `["Utility"]` if empty.

```yaml
category:
  - "System"
  - "Utility"
```

### `tag` <Badge type="tip" text="RECOMMENDED" />

Free-form metadata tags for better `soar search` results.

```yaml
tag:
  - "clipboard"
  - "daemon"
  - "rust"
```

### `license` <Badge type="info" text="OPTIONAL" />

License identifiers. Use [SPDX identifiers](https://spdx.org/licenses/) when possible.

```yaml
license:
  - "GPL-3.0"
  - "MIT"
```

### `maintainer` <Badge type="info" text="OPTIONAL" />

Author/maintainer of the SBUILD recipe (not the upstream package).

```yaml
maintainer:
  - "QaidVoid (contact@qaidvoid.dev)"
```

### `note` <Badge type="info" text="OPTIONAL" />

Extra information about the package. Certain flag prefixes have special meaning in metadata generation:

| Flag | Effect |
|------|--------|
| `[DEPRECATED]` | Marks the package as deprecated |
| `[EXTERNAL]` | Filtered out of metadata |
| `[NO_INSTALL]` | Filtered out of metadata |
| `[UNTRUSTED]` | Filtered out of metadata |
| `[DO NOT RUN]` | Filtered out of metadata |

```yaml
note:
  - "Official binary from https://github.com/xrelkd/clipcat"
  - "[PORTABLE] (Portable Static Binary)"
  - "[NO_DESKTOP_INTEGRATION]"
```

### `repology` <Badge type="tip" text="RECOMMENDED" />

[Repology](https://repology.org/projects/) project name(s) for version tracking.

```yaml
repology:
  - "clipcat"
```

### `snapshots` <Badge type="info" text="OPTIONAL" />

Snapshot version identifiers.

```yaml
snapshots:
  - "latest"
```

---

## Provides & Aliases

### `provides` <Badge type="tip" text="RECOMMENDED" />

Declares what binaries and packages a recipe produces. If empty, defaults to `pkg`.

```yaml
provides:
  - "clipcatd"
  - "@clipcat-menu"
  - "@clipcat-notify"
  - "@clipcatctl"
```

#### Syntax

| Syntax | Example | Meaning |
|--------|---------|---------|
| Plain name | `"clipcatd"` | Package named `clipcatd` |
| `@` prefix | `"@clipcat-menu"` | Binary-only (not a separate package) |
| `:` alias | `"chaos:chaos-cli"` | Package with search alias |
| `==` symlink | `"busybox==whoami"` | Creates a symlink on install |
| `=>` rename | `"ripgrep=>rg"` | Only the symlink is added to `$PATH` |

Entries prefixed with `@` are excluded from the package list but included in the binary list.

In the example above:
- **Packages**: `["clipcatd"]`
- **Binaries**: `["clipcat-menu", "clipcat-notify", "clipcatctl"]`

---

## Multi-Package Recipes

### `packages` <Badge type="info" text="OPTIONAL" />

For recipes that produce multiple distinct packages. When defined, takes precedence over the top-level `provides` field.

Each key is a package name, each value has a `provides` array:

```yaml
packages:
  clipcatd:
    provides:
      - "clipcatd"
  clipcat-tools:
    provides:
      - "clipcatctl"
      - "@clipcat-menu"
      - "@clipcat-notify"
```

Each sub-package gets its own output directory (`packages/${package_name}/`) during the build and is pushed as a separate GHCR artifact.

---

## Build Configuration

### `build_asset` <Badge type="info" text="OPTIONAL" />

Files to download before running `x_exec.run`. Downloaded in parallel to `${SBUILD_TMPDIR}`. Each entry has `url` and `out` fields.

```yaml
build_asset:
  - url: "https://raw.githubusercontent.com/xrelkd/clipcat/main/LICENSE"
    out: "LICENSE"
  - url: "https://example.com/patch-${PKGVER}.diff"
    out: "fix.patch"
```

### `build_deps` <Badge type="info" text="OPTIONAL" />

Build-time package dependencies (typically used with [`x_exec.container`](#x-exec-container)).

```yaml
build_deps:
  - "gcc"
  - "openssl-dev"
  - "musl-dev"
```

### `build_util` <Badge type="info" text="OPTIONAL" />

Static binaries to install via `soar` before the build. Only use if your distro doesn't provide the tool or you need the latest version.

```yaml
build_util:
  - "curl#bin"
  - "jq#bin"
```

### `ghcr_pkg` <Badge type="danger" text="REQUIRED" />

GHCR (GitHub Container Registry) package path used for publishing. Format: `owner/package`.

```yaml
ghcr_pkg: "xrelkd/clipcat"
```

---

## Execution

### `x_exec` <Badge type="danger" text="REQUIRED" />

The core build/download logic.

```yaml
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  shell: "bash"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/owner/repo/releases/latest" | jq -r '.tag_name'
  run: |
    # Build or download the package
    # Output must be placed in ${SBUILD_OUTDIR}
```

#### `x_exec.shell` <Badge type="danger" text="REQUIRED" />

Shell interpreter for `run` and `pkgver` scripts. Must exist in `PATH` (unless `container` is specified).

```yaml
x_exec:
  shell: "bash"
```

::: tip
Prefer `sh` or `bash` for maximum portability across build environments.
:::

#### `x_exec.run` <Badge type="danger" text="REQUIRED" />

The build/download script. Must produce the [required output files](/sbuild/instructions#output-files) in `${SBUILD_OUTDIR}`. Validated by [ShellCheck](https://www.shellcheck.net/).

```yaml
x_exec:
  run: |
    soar dl "https://github.com/xrelkd/clipcat@v${PKGVER}" \
      --glob "*${ARCH}-unknown-linux-musl.tar.gz" --yes -o clipcat.tar.gz
    tar -xf "clipcat.tar.gz" -C "$SBUILD_TMPDIR/"
    mv "$SBUILD_TMPDIR/clipcatd" "$SBUILD_OUTDIR/clipcatd"
    mv "$SBUILD_TMPDIR/clipcatctl" "$SBUILD_OUTDIR/clipcatctl"
```

#### `x_exec.pkgver` <Badge type="info" text="OPTIONAL" />

Script to dynamically fetch the upstream version. Output:
- **Line 1**: Package version (required)
- **Line 2**: Remote version tag (optional, exported as `${REMOTE_PKGVER}` for use in `run`)

The package version from line 1 is exported as `${PKGVER}`.

```yaml
x_exec:
  pkgver: |
    VERSION=$(curl -qfsSL "https://api.github.com/repos/xrelkd/clipcat/releases/latest" | jq -r '.tag_name')
    echo "${VERSION#v}"
    echo "$VERSION"
```

#### `x_exec.host` <Badge type="info" text="OPTIONAL" />

Combined arch + os restriction. Preferred over separate `arch`/`os` fields. Build terminates if the host doesn't match.

```yaml
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
```

**Valid architectures**: `x86_64`, `aarch64`, `riscv64`, `loongarch64`

**Valid operating systems**: `linux`, `freebsd`, `openbsd`, `netbsd`, `illumos`, `redox`

#### `x_exec.arch` <Badge type="info" text="OPTIONAL" />

Restrict to specific architectures (use `host` instead when possible).

```yaml
x_exec:
  arch:
    - "aarch64"
    - "x86_64"
```

#### `x_exec.os` <Badge type="info" text="OPTIONAL" />

Restrict to specific operating systems (use `host` instead when possible).

```yaml
x_exec:
  os:
    - "linux"
```

#### `x_exec.container` <Badge type="info" text="OPTIONAL" />

Container image for the build environment. When specified, `shell` PATH validation is bypassed.

```yaml
x_exec:
  container: "alpine:edge"
```

#### `x_exec.entrypoint` <Badge type="info" text="OPTIONAL" />

Override the container entrypoint.

```yaml
x_exec:
  entrypoint: "/bin/sh"
```

#### `x_exec.conflicts` <Badge type="info" text="OPTIONAL" />

Packages to uninstall after a successful build (case-insensitive, lowercased).

```yaml
x_exec:
  conflicts:
    - "clipcat-git"
```

#### `x_exec.depends` <Badge type="info" text="OPTIONAL" />

Runtime dependencies to install before `x_exec.run` (case-insensitive, lowercased).

```yaml
x_exec:
  depends:
    - "dbus"
    - "xorg-xclip"
```

---

## Validation Rules

1. **Required fields** `_disabled`, `pkg`, `description`, `src_url`, `ghcr_pkg`, and `x_exec` must be present
2. **Name fields** (`pkg`, `pkg_id`, `app_id`) only allow `[a-zA-Z0-9+\-_.]`
3. **URL fields** (`src_url`, `homepage`, `build_asset.url`) must have `http`, `https`, or `ftp` scheme
4. **Duplicate array entries** are automatically removed with a warning
5. **Empty required fields** produce a fatal validation error
6. **Shell scripts** (`run`, `pkgver`) are validated by shellcheck
7. **`host` triples** must match `{valid_arch}-{valid_os}` format
8. **`packages`** must not be empty if defined; each sub-package must have at least one `provides` entry

---

## Complete Example

A full recipe demonstrating most fields (from [soarpkgs](https://github.com/pkgforge/soarpkgs)):

```yaml
#!/SBUILD
_disabled: false

pkg: "clipcat"
pkg_id: "xrelkd.clipcat"
app_id: "org.xrelkd.clipcat"
pkg_type: "static"
ghcr_pkg: "xrelkd/clipcat"
category:
  - "System"
  - "Utility"
description: "A clipboard manager written in Rust"
homepage:
  - "https://github.com/xrelkd/clipcat"
maintainer:
  - "QaidVoid (contact@qaidvoid.dev)"
license:
  - "GPL-3.0"
note:
  - "Official binary from https://github.com/xrelkd/clipcat"
  - "[PORTABLE] (Portable Static Binary)"
  - "[NO_DESKTOP_INTEGRATION]"
provides:
  - "clipcatd"
  - "@clipcat-menu"
  - "@clipcat-notify"
  - "@clipcatctl"
repology:
  - "clipcat"
src_url:
  - "https://github.com/xrelkd/clipcat"
tag:
  - "clipboard"
  - "daemon"
  - "rust"
  - "cli"
snapshots:
  - "latest"
build_asset:
  - url: "https://raw.githubusercontent.com/xrelkd/clipcat/main/LICENSE"
    out: "LICENSE"
build_util:
  - "jq"
  - "curl"
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  shell: "sh"
  depends:
    - "dbus"
  conflicts:
    - "clipcat-git"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/xrelkd/clipcat/releases/latest" \
      | jq -r '.tag_name' | tr -d 'v'
  run: |
    soar dl "https://github.com/xrelkd/clipcat@v${PKGVER}" \
      --glob "*${ARCH}-unknown-linux-musl.tar.gz" --yes -o clipcat.tar.gz
    tar -xf "clipcat.tar.gz" -C "$SBUILD_TMPDIR/"
    mv "$SBUILD_TMPDIR/clipcat-menu" "$SBUILD_OUTDIR/clipcat-menu"
    mv "$SBUILD_TMPDIR/clipcat-notify" "$SBUILD_OUTDIR/clipcat-notify"
    mv "$SBUILD_TMPDIR/clipcatctl" "$SBUILD_OUTDIR/clipcatctl"
    mv "$SBUILD_TMPDIR/clipcatd" "$SBUILD_OUTDIR/clipcatd"
    rm -rf "clipcat.tar.gz"
```

### Multi-Package Variant

The same recipe using `packages` instead of `provides`, built inside a container:

```yaml
#!/SBUILD
_disabled: false

pkg: "clipcat"
pkg_id: "xrelkd.clipcat"
pkg_type: "static"
ghcr_pkg: "xrelkd/clipcat"
description: "A clipboard manager written in Rust"
src_url:
  - "https://github.com/xrelkd/clipcat"
packages:
  clipcatd:
    provides:
      - "clipcatd"
  clipcat-tools:
    provides:
      - "clipcatctl"
      - "@clipcat-menu"
      - "@clipcat-notify"
x_exec:
  host:
    - "x86_64-linux"
    - "aarch64-linux"
  shell: "sh"
  depends:
    - "dbus"
  pkgver: |
    curl -qfsSL "https://api.github.com/repos/xrelkd/clipcat/releases/latest" \
      | jq -r '.tag_name' | tr -d 'v'
  run: |
    soar dl "https://github.com/xrelkd/clipcat@v${PKGVER}" \
      --glob "*${ARCH}-unknown-linux-musl.tar.gz" --yes -o clipcat.tar.gz
    tar -xf "clipcat.tar.gz" -C "$SBUILD_TMPDIR/"
    mkdir -p "$SBUILD_OUTDIR/packages/clipcatd" "$SBUILD_OUTDIR/packages/clipcat-tools"
    mv "$SBUILD_TMPDIR/clipcatd" "$SBUILD_OUTDIR/packages/clipcatd/clipcatd"
    mv "$SBUILD_TMPDIR/clipcatctl" "$SBUILD_OUTDIR/packages/clipcat-tools/clipcatctl"
    mv "$SBUILD_TMPDIR/clipcat-menu" "$SBUILD_OUTDIR/packages/clipcat-tools/clipcat-menu"
    mv "$SBUILD_TMPDIR/clipcat-notify" "$SBUILD_OUTDIR/packages/clipcat-tools/clipcat-notify"
    rm -rf "clipcat.tar.gz"
```
