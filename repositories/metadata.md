# Metadata

soarpkgs generates metadata for all prebuilt packages, split into two views:

- **bincache** — static binary metadata
- **pkgcache** — portable package metadata (AppImage, FlatImage, etc.)

## URLs

Metadata is available in JSON and SQLite formats:

```
https://github.com/pkgforge/soarpkgs/releases/latest/download/bincache-${HOST}.json
https://github.com/pkgforge/soarpkgs/releases/latest/download/pkgcache-${HOST}.json
```

Append `.zstd` for compressed versions. SQLite format uses `.sdb` / `.sdb.zstd`.

`${HOST}` is one of: `aarch64-Linux`, `x86_64-Linux`

## Fields

```json5
// @string → single value, @array → multiple values

// Package identification
disabled: "false",            // If true, package is broken
host: "@string",              // Build target (arch-os)
pkg: "@string",               // Package name
pkg_family: "@string",        // Package family
pkg_id: "@string",            // Unique package ID
pkg_name: "@string",          // Install name (fallback to pkg)
pkg_type: "@string",          // Package type
pkg_webpage: "@string",       // Web index page

// App metadata
app_id: "@string",            // AppStream application ID
appstream: "@string",         // Appstream XML URL
category: "@array",           // FreeDesktop categories
description: "@string",       // Package description
desktop: "@string",           // Desktop file URL
homepage: "@array",           // Project homepage URLs
icon: "@string",              // Icon file URL
license: "@array",            // License info
maintainer: "@array",         // SBUILD maintainer
note: "@array",               // Additional notes
provides: "@array",           // Provided binaries
repology: "@array",           // Repology mapping
screenshots: "@array",        // Screenshot URLs
src_url: "@array",            // Source URLs
tag: "@array",                // Tags

// Version info
version: "@string",           // Package version (HEAD- = built from source)
version_upstream: "@string",  // Upstream version

// Build info
bsum: "@string",              // BLAKE3 checksum
build_date: "@string",        // Build date (YYYY-MM-DDTHH:MM:SS)
build_gha: "@string",         // GitHub Actions run URL
build_id: "@string",          // Build ID
build_log: "@string",         // Build log URL
build_script: "@string",      // SBUILD script URL

// GHCR info
download_url: "@string",      // Direct download URL
ghcr_blob: "@array",          // GHCR blob digests
ghcr_files: "@array",         // Artifacts in package
ghcr_pkg: "@string",          // GHCR package name + tag
ghcr_size: "@string",         // Total size (human readable)
ghcr_size_raw: "@string",     // Total size (bytes)
ghcr_url: "@string",          // Registry URL
shasum: "@string",            // SHA256 checksum
size: "@string",              // Package size (human readable)
size_raw: "@string",          // Package size (bytes)
snapshots: "@array"           // Version tags
```

## JQ Examples

```bash
# List all packages
curl -qfsSL "https://github.com/pkgforge/soarpkgs/releases/latest/download/bincache-$(uname -m)-$(uname -s).json" \
  | jq -r '.[] | .pkg'

# Search for a package
curl -qfsSL "https://github.com/pkgforge/soarpkgs/releases/latest/download/bincache-$(uname -m)-$(uname -s).json" \
  | jq -r '.[] | select(.pkg | test("qbittorrent"; "i"))'
```

## Security

Metadata is generated in [pkgforge/soarpkgs](https://github.com/pkgforge/soarpkgs). Verify provenance via [GitHub Attestations](https://github.com/pkgforge/soarpkgs/attestations).
