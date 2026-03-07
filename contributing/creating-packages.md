# Creating Packages

This guide walks you through creating and submitting a PkgForge package.

## Prerequisites

- A Linux system (any distro)
- Basic shell scripting knowledge
- A GitHub account

## Step 1: Choose a Format

Pick a [package format](/formats/) for your application. See each format's page for details on features and trade-offs.

## Step 2: Write Your SBUILD

Create a YAML file following the [SBUILD specification](/sbuild/specification):

```yaml
#!/SBUILD
_disabled: false

pkg: "myapp"
pkg_id: "github.com.user.myapp"
pkg_type: "appimage"
ghcr_pkg: "user/myapp"
app_id: "com.example.myapp"
description: "My awesome application"
homepage:
  - "https://github.com/user/myapp"
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
    soar dl "https://github.com/user/myapp" --match "appimage" -o "./${PKG}" --yes
```

Key things to remember:
- Output files go to `${SBUILD_OUTDIR}` (which is the current directory)
- The main binary must be named `${PKG}`
- Use `${SBUILD_TMPDIR}` for intermediate files

## Step 3: Validate

```bash
# Install sbuild
soar install sbuild

# Validate your SBUILD
sbuild lint ./myapp.yaml

# Check YAML syntax
# Visit: https://www.yamllint.com/

# Check shell syntax
# Visit: https://www.shellcheck.net/
```

## Step 4: Test Locally

```bash
# Run the build
sbuild ./myapp.yaml
```

## Step 5: Submit

1. Fork [pkgforge/soarpkgs](https://github.com/pkgforge/soarpkgs)
2. Add your SBUILD file under `packages/`
3. Open a Pull Request

The maintainers will review, help fix any issues, and merge.

## Tips

- Browse [existing packages](https://github.com/pkgforge/soarpkgs/tree/main/packages) for reference
- Check [pkgs.pkgforge.qaidvoid.dev](https://pkgs.pkgforge.qaidvoid.dev) to make sure the package doesn't already exist
- Use `soar dl` for downloading release assets — it handles GitHub/GitLab URLs automatically
- For multi-arch support, use `case "$(uname -m)"` in your `x_exec.run`
- See [Examples](/sbuild/examples) for common patterns
