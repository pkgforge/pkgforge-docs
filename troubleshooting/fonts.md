# Fonts

Portable packages don't include fonts to minimize size. They use fonts from your host system. If fonts are missing, you may see boxes instead of text (tofu), missing emojis, garbled non-Latin characters, or missing icons.

## Checking Font Issues

```bash
# Check if fontconfig is working
fc-list | head -10

# Check for common fonts
fc-list | grep -i noto
fc-list | grep -i emoji
```

## Installing Fonts

### Alpine Linux

```bash
apk update
packages="fontconfig font-awesome font-inconsolata font-noto font-terminus font-unifont"
for pkg in $packages; do
  apk add "$pkg"
done
fc-cache --force --verbose
# Log out and back in or reboot
```

### Arch Linux & Derivatives

```bash
pacman -Sy
packages="fontconfig noto-fonts otf-font-awesome terminus-font ttf-dejavu ttf-inconsolata-nerd"
for pkg in $packages; do
  pacman -S "$pkg" --noconfirm
done
fc-cache --force --verbose
# Log out and back in or reboot
```

### Debian & Derivatives

```bash
sudo apt update
sudo apt install fontconfig fonts-noto
fc-cache --force --verbose
# Log out and back in or reboot
```

## Common Font Packages

| Purpose | Packages |
|---|---|
| General use | `fonts-noto`, `fonts-liberation`, `ttf-dejavu` |
| Icons/symbols | `otf-font-awesome`, `ttf-nerd-fonts` |
| CJK (Chinese/Japanese/Korean) | `fonts-noto-cjk`, `fonts-wqy-zenhei` |
| Emojis | `fonts-noto-color-emoji`, `ttf-joypixels` |

## Verifying

```bash
fc-cache -f -v
fc-list | grep -i noto
```
