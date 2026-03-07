# Instructions

How the SBUILD runner executes your build script, including available environment variables and required output files.

## Environment Variables

These variables are available inside `x_exec.run` and `x_exec.pkgver`:

### Package Info

| Variable | Description | Availability |
|---|---|---|
| `${PKG}` | Raw value of `.pkg` from the SBUILD | Always |
| `${PKG_ID}` | Raw value of `.pkg_id` | Empty if not set |
| `${PKG_TYPE}` | Raw value of `.pkg_type` | Empty if not set |
| `${PKGVER}` | Version from `.pkgver` or `x_exec.pkgver` output (line 1) | Always |
| `${REMOTE_PKGVER}` | Remote version tag from `x_exec.pkgver` output (line 2) | Only if pkgver outputs 2 lines |
| `${SBUILD_PKG}` | `${PKG}` combined with `${PKG_TYPE}` (e.g. `ripgrep.static`) | Always |
| `${ARCH}` | Target architecture (e.g. `x86_64`, `aarch64`) | Always |
| `${ARCH_ALT}` | Alternative architecture name (e.g. `amd64`, `arm64`) | Always |

### Directories

| Variable | Description |
|---|---|
| `${SBUILD_OUTDIR}` | Root working directory where `x_exec.run` executes. All output files must be placed here. |
| `${SBUILD_TMPDIR}` | Temp directory at `${SBUILD_OUTDIR}/SBUILD_TEMP` for intermediate files. Use this to keep `${SBUILD_OUTDIR}` clean. |

### Tokens (Inherited from Host)

| Variable | Description |
|---|---|
| `${GITHUB_TOKEN}` / `${GH_TOKEN}` | GitHub API token |
| `${GITLAB_TOKEN}` / `${GL_TOKEN}` | GitLab API token |
| `${HF_TOKEN}` | HuggingFace Hub token |
| `${USER_AGENT}` | User-Agent header from host |

::: info
Token variables are only available if they exist on the host. When `--no-hostenv` is used, these are not inherited.
:::

### System Variables

| Variable | Fallback (with `--no-hostenv`) |
|---|---|
| `LANG` | `C.UTF-8` |
| `LC_ALL` | `C.UTF-8` |
| `PATH` | `${SOAR_BINPATH}:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin` |
| `PWD` | Full realpath of `${SBUILD_OUTDIR}` |
| `SHELL` | Full realpath of `x_exec.shell` |
| `TERM` | `xterm` |
| `USER` | Current `whoami` (not inherited with `--no-hostenv`) |

## Output Files

Files that must or may exist in `${SBUILD_OUTDIR}` after `x_exec.run` completes:

### Required

| File | Description |
|---|---|
| `${SBUILD_OUTDIR}/${PKG}` | The built binary/package. Must be > 1KB. |
| `${SBUILD_OUTDIR}/${PKG}.version` | Version file. If empty, a date/bsum-based version is used. |

::: info
For [multi-package recipes](/sbuild/specification#packages), each sub-package's output goes to `${SBUILD_OUTDIR}/packages/${package_name}/` instead.
:::

### Optional (Packages Only)

These apply only to portable package formats (AppImage, FlatImage, etc.), not static/dynamic binaries:

| File | Description |
|---|---|
| `${SBUILD_OUTDIR}/${PKG}.desktop` | Desktop entry file (> 3 bytes) |
| `${SBUILD_OUTDIR}/.DirIcon` | Fallback icon if `${PKG}.png` / `${PKG}.svg` doesn't exist (> 20 bytes) |
| `${SBUILD_OUTDIR}/${PKG}.png` or `.svg` | Application icon (> 20 bytes). Preferred over `.DirIcon`. |
| `${SBUILD_OUTDIR}/${PKG}.metainfo.xml` | AppStream metadata. Prefer `metainfo.xml` over the legacy `appdata.xml`. |
| `${SBUILD_OUTDIR}/LICENSE` | License file (> 3 bytes) |

## Build Process

1. **Validate**: The linter validates the SBUILD recipe
2. **Setup**: Runner creates `${SBUILD_OUTDIR}` and `${SBUILD_TMPDIR}`
3. **Download assets**: `build_asset` entries are downloaded in parallel to `${SBUILD_TMPDIR}`
4. **Install utilities**: `build_util` entries are installed via `soar`
5. **Fetch version**: `x_exec.pkgver` runs and the result is exported as `${PKGVER}`
6. **Execute build**: `x_exec.run` executes in `${SBUILD_OUTDIR}`
7. **Collect output**: Runner checks for [required output files](#required)
8. **Package**: Output is assembled into the final package

## Tips

::: tip
Validate your SBUILD with [yamllint](https://www.yamllint.com/) and your `x_exec.run` shell script with [ShellCheck](https://www.shellcheck.net/).
:::

::: tip
Use `${SBUILD_TMPDIR}` for all intermediate files (downloads, extracted archives, build artifacts). Keep `${SBUILD_OUTDIR}` clean — it should only contain the final output files.
:::
