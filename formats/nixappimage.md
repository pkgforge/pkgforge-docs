# NixAppImage

[NixAppImage](https://github.com/pkgforge/nix-appimage) is an AppImage created using a Nix bundler. It packages [NixOS](https://nixos.org/) derivations as portable AppImages.

**`pkg_type`: `nixappimage`**

## Features

- Built-in sandboxing (run `SHOW_HELP=1` to see options)
- Absolute portability — includes all dependencies from Nix
- Reproducible builds via Nix
- Sources packages from [nixpkgs](https://github.com/NixOS/nixpkgs)

## Prerequisites

- [FUSE](/troubleshooting/fuse) — required for mounting
- [Fonts](/troubleshooting/fonts) — for rendering non-Latin characters and emojis
- [User Namespaces](/troubleshooting/namespaces) — required for sandboxing

## Known Issues

::: warning
- **LibGL**: Hardware-accelerated OpenGL may not work. See [nixpkgs#9415](https://github.com/NixOS/nixpkgs/issues/9415).
- **Size**: NixAppImages are **2-5x larger** than other formats because they bundle the complete Nix dependency closure. This is the trade-off for absolute portability.
:::

## Quirks

::: danger
- **Never** run `strip`, `objcopy`, or any binary rewriting tool on NixAppImages. They will destroy the embedded `squashfs|dwarfs` archive, leaving only the runtime stub.
- A `.nixappimage` file is **not** a real ELF binary.
:::

## Example SBUILD

```yaml
#!/SBUILD
_disabled: false

pkg: "myapp"
pkg_id: "github.com.user.myapp"
pkg_type: "nixappimage"
ghcr_pkg: "user/myapp"
description: "My app (NixAppImage)"
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
    soar dl "https://github.com/user/myapp" --match "nixappimage" -o "./${PKG}" --yes
```

## See Also

- [nix-appimage](https://github.com/pkgforge/nix-appimage)
- [NixOS Bundlers](https://github.com/NixOS/bundlers)
