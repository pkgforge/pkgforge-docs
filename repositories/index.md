# Repositories

PkgForge uses a centralized repository system built around [soarpkgs](https://github.com/pkgforge/soarpkgs), with automated building, publishing, and metadata generation.

## Architecture

```
soarpkgs (github.com/pkgforge/soarpkgs)
├── SBUILD recipes (500+ package definitions)
├── GitHub Actions CI
│   ├── Builds packages from SBUILD
│   ├── Publishes to ghcr.io/pkgforge/*
│   └── Generates metadata
├── GitHub Releases
│   ├── metadata-{arch}-linux.sdb.zstd (package metadata)
│   └── Minisign signatures
└── Soar fetches metadata → downloads packages from ghcr.io
```

## Package Distribution Flow

1. Developer creates SBUILD → pushes to soarpkgs
2. GitHub Actions validates and builds the package (multi-arch)
3. Package is published to `ghcr.io/pkgforge/{name}:{version}`
4. Metadata is generated and released as `.sdb.zstd` files
5. Metadata is signed with minisign
6. Soar downloads metadata → installs packages from ghcr.io

## Metadata

Metadata is published as a compressed SQLite database (`.sdb.zstd`) per architecture:

```
soarpkgs/releases/.../metadata-{arch}-linux.sdb.zstd
```

Supported architectures: `x86_64-Linux`, `aarch64-Linux`, `riscv64-Linux`

## Security

- All packages are built in CI with public logs
- Checksums: BLAKE3 + SHA256
- [GitHub Artifact Attestations](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations)
- Minisign signatures
- Build process meets [SLSA Build L2](https://slsa.dev/spec/v1.0/levels#build-l2)

## Topics

- [soarpkgs](/repositories/soarpkgs) — the main package repository
- [Metadata](/repositories/metadata) — metadata specification and format
- [Custom Repositories](/repositories/custom-repos) — adding third-party repos
