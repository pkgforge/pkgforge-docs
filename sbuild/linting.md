# Linting

The `sbuild` tool includes a built-in linter that validates SBUILD recipes before execution. It checks for required fields, correct types, and valid values.

## Installation

```bash
soar install sbuild
```

Or download directly from [sbuilder releases](https://github.com/pkgforge/sbuilder/releases).

## Usage

```bash
# Validate a single file
sbuild lint ./myapp.yaml

# Validate multiple files
sbuild lint ./packages/*.yaml

# Validate with verbose output
sbuild lint -v ./myapp.yaml
```

## What It Checks

- **Required fields**: `_disabled`, `pkg`, `description`, `src_url`, `ghcr_pkg`, and `x_exec` must be present
- **Field types**: Arrays must be arrays, strings must be strings
- **Valid values**: `pkg_type` must be a recognized format, `category` must match FreeDesktop spec
- **Name constraints**: `pkg`, `pkg_id`, `app_id` only allow `[a-zA-Z0-9+\-_.]`
- **Shell syntax**: Validation of `x_exec.pkgver` and `x_exec.run` blocks via shellcheck
- **URL format**: `src_url`, `homepage`, and `build_asset.url` entries must be valid URLs
- **Host triples**: `x_exec.host` entries must match `{arch}-{os}` format

## Common Errors

### Missing required field

```
ERROR: field 'description' is required but missing
```

Add the missing field to your SBUILD.

### Invalid pkg_type

```
ERROR: invalid pkg_type 'Appimage', must be lowercase
```

Use lowercase values: `appimage`, not `Appimage` or `AppImage`.

### Empty x_exec.run

```
ERROR: x_exec.run must not be empty
```

The `run` block must contain actual shell commands.

## Pre-submission Checklist

Before submitting an SBUILD to soarpkgs:

1. Run `sbuild lint` — no errors
2. Check YAML syntax with [yamllint](https://www.yamllint.com/)
3. Check shell syntax with [ShellCheck](https://www.shellcheck.net/)
4. Test the build locally with `sbuild`
