# Linting

The `sbuild` tool includes a built-in linter that validates SBUILD recipes before execution. It checks for required fields, correct types, valid values, and runs [shellcheck](https://www.shellcheck.net/) on shell scripts.

## Prerequisites

- [shellcheck](https://www.shellcheck.net/) — used to validate `x_exec.run` and `x_exec.pkgver` blocks

```bash
soar install shellcheck
```

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

# Validate in parallel
sbuild lint -p 8 ./packages/*.yaml

# Run in pkgver mode (execute pkgver scripts)
sbuild lint -P ./myapp.yaml

# Skip shellcheck validation
sbuild lint --no-shellcheck ./myapp.yaml
```

## What It Checks

- **Required fields**: `_disabled`, `pkg`, `description`, `src_url`, `ghcr_pkg`, and `x_exec` must be present
- **Field types**: Arrays must be arrays, strings must be strings
- **Valid values**: `pkg_type` must be a recognized format, `category` must match FreeDesktop spec
- **Name constraints**: `pkg`, `pkg_id`, `app_id` only allow `[a-zA-Z0-9+\-_.]`
- **Shell syntax**: Validates `x_exec.pkgver` and `x_exec.run` blocks via shellcheck
- **URL format**: `src_url`, `homepage` entries must be valid URLs
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
2. Test the build locally with `sbuild build`
