# Custom Repositories

Soar supports adding custom repositories beyond the official soarpkgs. You can host your own packages with full metadata, or consume someone else's.

## Adding a Custom Repository

Edit `~/.config/soar/config.toml`:

```toml
[[repositories]]
name = "my-repo"
url = "https://example.com/metadata.json"
```

Then sync:

```bash
soar sync
soar list 'my-repo'
```

The URL can point to a JSON file (`.json` or `.json.zstd`) or a SQLite database (`.sdb` or `.sdb.zstd`).

## Hosting Your Own Repository

To host a custom repository, you need to:

1. Write SBUILD recipes for your packages
2. Build the packages with `sbuild`
3. Push them to GHCR
4. Generate metadata with `sbuild meta`
5. Host the metadata file

### 1. Install the Toolchain

```bash
soar install sbuild
```

Or grab them from [sbuilder releases](https://github.com/pkgforge/sbuilder/releases).

Additional requirements:
- [oras](https://oras.land/) — for pushing packages to GHCR
- [shellcheck](https://www.shellcheck.net/) — for linting shell scripts in recipes

```bash
soar install oras shellcheck
```

### 2. Build Packages

```bash
# Build a single recipe
sbuild build ./myapp.yaml --outdir ./out

# Build and push to GHCR
sbuild build ./myapp.yaml \
  --outdir ./out \
  --push \
  --ghcr-repo "ghcr.io/myorg/myrepo" \
  --ghcr-token "$GHCR_TOKEN"
```

Key `sbuild build` options:

| Flag | Description |
|---|---|
| `--outdir` | Output directory for build artifacts |
| `--push` | Push packages to GHCR after build |
| `--ghcr-repo` | GHCR repository base (e.g. `myorg/myrepo`) |
| `--ghcr-token` | GHCR token for authentication |
| `--sign` | Sign packages with minisign |
| `--checksums` | Generate checksums (default: true) |
| `--ci` | CI mode — output GitHub Actions env vars |
| `--force` | Force rebuild even if package exists |
| `--timeout` | Build timeout in seconds (default: 3600) |

### 3. Generate Metadata

Once packages are pushed to GHCR, generate the metadata index:

```bash
sbuild meta generate \
  --arch x86_64-linux \
  --recipes ./packages/ \
  --output ./metadata/ \
  --ghcr-owner myorg \
  --github-token "$GITHUB_TOKEN"
```

This scans your recipe directories, queries GHCR for package info, and produces JSON metadata files:

```
metadata/
└── x86_64-linux.json
```

Key `sbuild meta generate` options:

| Flag | Description |
|---|---|
| `--arch` | Target architecture (e.g. `x86_64-linux`, `aarch64-linux`) |
| `--recipes` | Recipe directories to scan |
| `--output` | Output directory for JSON files |
| `--ghcr-owner` | GHCR owner/organization |
| `--parallel` | Number of parallel workers (default: 4) |

### 4. Host Metadata

Upload the generated JSON to any URL-accessible location (GitHub Releases, a static file server, S3, etc.). Then share the URL for users to add via `config.toml`.

### 5. Automate with CI (Optional)

For a fully automated workflow, set up GitHub Actions to build, push, and generate metadata on each commit or release. See [soarpkgs](https://github.com/pkgforge/soarpkgs) for a reference CI pipeline.

## Other Toolchain Commands

### Check for Updates

Compare local recipe versions against upstream:

```bash
sbuild meta check-updates \
  --recipes ./packages/ \
  --output ./outdated.json \
  --parallel 5
```

This runs each recipe's `x_exec.pkgver` script and compares the result against the currently cached version, outputting a JSON list of packages with newer upstream versions.

See the [sbuilder README](https://github.com/pkgforge/sbuilder) for full CLI reference.
