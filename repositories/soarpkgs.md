# soarpkgs

[soarpkgs](https://github.com/pkgforge/soarpkgs) is the official package repository for PkgForge. It contains SBUILD recipes that define how packages are built, tested, and distributed.

## Overview

- **500+ packages** across all supported formats
- **Automated builds** via GitHub Actions
- **Multi-architecture**: x86_64, aarch64, riscv64
- **Package search**: [pkgs.pkgforge.qaidvoid.dev](https://pkgs.pkgforge.qaidvoid.dev)

## Contributing

1. Read the [SBUILD specification](/sbuild/specification) and browse [existing packages](https://github.com/pkgforge/soarpkgs/tree/main/packages)
2. Write your SBUILD and validate with `sbuild lint`
3. Open a [Pull Request](https://github.com/pkgforge/soarpkgs/compare)

We'll help fix any issues and provide feedback. See [Creating Packages](/contributing/creating-packages) for a detailed guide.

## Security

- All packages are reviewed before inclusion
- Unofficial packages are [forked](https://github.com/orgs/pkgforge-community/repositories?q=fork%3Atrue+archived%3Afalse) to [pkgforge-community](https://github.com/pkgforge-community) to preserve complete history
- SBUILD requires `src_url` links for transparency
- Community-sourced packages include a `note` indicating their origin

## FAQ

### Is this an AUR?

Inspired by the AUR concept but curated — packages are reviewed by maintainers before inclusion.

### GLIBC vs MUSL

MUSL binaries use [mimalloc](https://github.com/microsoft/mimalloc) for performance parity with GLIBC. LTO and PIE optimizations are also applied.

### Portability

- Prebuilt packages are provided to avoid build dependencies on the user's system
- Heavy builds requiring containers are marked with a note
