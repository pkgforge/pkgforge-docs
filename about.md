# About PkgForge

[PkgForge](https://github.com/pkgforge) provides portable packages, static binaries, and [Soar](https://github.com/pkgforge/soar) — a package manager written in Rust.

## Projects

### Soar

Fast, portable package manager for Linux. Zero dependencies, no root required.

- [GitHub](https://github.com/pkgforge/soar)
- [Documentation](https://soar.qaidvoid.dev)

### SBUILD / sbuilder

YAML-based build script format for creating portable packages. Includes a linter, runner, and meta-generator.

- [GitHub](https://github.com/pkgforge/sbuilder)

### soarpkgs

The main package repository with 500+ SBUILD recipes, automated CI builds, and multi-architecture support.

- [GitHub](https://github.com/pkgforge/soarpkgs)
- [Package Search](https://pkgs.pkgforge.qaidvoid.dev)

## Organizations

| Organization | Purpose |
|---|---|
| [pkgforge](https://github.com/pkgforge) | Core projects (Soar, sbuilder, soarpkgs) |
| [pkgforge-dev](https://github.com/pkgforge-dev) | Development and experimental projects (base images, tooling) |
| [pkgforge-community](https://github.com/pkgforge-community) | Community-maintained forks of dependencies with preserved history |

## Philosophy

1. **Portability** — packages work on as many distros as possible
2. **Simplicity** — easy to create, easy to install
3. **Transparency** — all builds are public with full logs and attestations
4. **Performance** — static binaries, no compilation needed for users

## History

- **July 2023**: [Toolpacks](https://github.com/Azathothas/Toolpacks) created — scripts for fetching precompiled binaries
- **Nov 2023**: [Hysp](https://github.com/pwnwriter/hysp), the first package manager for Toolpacks
- **Oct 2024**: [Soar](https://github.com/pkgforge/soar) receives its first commit
- **Nov 2024**: [PkgForge](https://github.com/pkgforge) organization created, soarpkgs established
- **Jan 2025**: Toolpacks archived, fully replaced by soarpkgs

## Resources

- **GitHub**: [github.com/pkgforge](https://github.com/pkgforge)
- **Discord**: [discord.gg/djJUs48Zbu](https://discord.gg/djJUs48Zbu)
- **Packages**: [pkgs.pkgforge.qaidvoid.dev](https://pkgs.pkgforge.qaidvoid.dev)
