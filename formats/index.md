# Package Formats

PkgForge supports multiple portable package formats for Linux.

## Formats

| Format | `pkg_type` | Description |
|---|---|---|
| [AppImage](/formats/appimage) | `appimage` | Universal single-file portable app format |
| [AppBundle](/formats/appbundle) | `appbundle` | Portable executable packaging format, AppImage alternative |
| [FlatImage](/formats/flatimage) | `flatimage` | Flatpak sandboxing meets AppImage portability |
| [RunImage](/formats/runimage) | `runimage` | Single-file portable containers |
| [NixAppImage](/formats/nixappimage) | `nixappimage` | AppImages built from Nix derivations |
| [Archive](/formats/archive) | `archive` | Self-extracting or compressed archives |
| [Static](/formats/static) | `static` | Statically linked binaries |
| [Dynamic](/formats/dynamic) | `dynamic` | Dynamically linked binaries (testing only) |

## Common Prerequisites

Many portable formats require host-level support:

- [FUSE](/troubleshooting/fuse) — filesystem mounting for self-contained images
- [Fonts](/troubleshooting/fonts) — host fonts for rendering text
- [User Namespaces](/troubleshooting/namespaces) — kernel feature for sandboxing

::: warning
Never run `strip`, `objcopy`, or other binary rewriting tools on portable packages (AppImage, FlatImage, RunImage, etc.). They are not real ELF binaries — rewriting will strip the embedded filesystem archive, leaving only the runtime stub.
:::
