#!/usr/bin/env python3
# ╭──────────────────────────────────────────────────────────────────────────╮
# │                                                                          │
# │   R E F R E S H                                                          │
# │   a snapshot of impasto for the site · pictures, wallpapers, keys        │
# │                                                                          │
# │   github.com/andreumassanet/impasto-docs                                 │
# │                                                                          │
# ╰──────────────────────────────────────────────────────────────────────────╯

# Usage: scripts/refresh.py <path to an impasto clone>
#
# Copies what the site shows from impasto, so the site builds on its own:
# the README's pictures, the wallpapers (1920 px WebP), each wallpaper's
# palette as the shell makes it, and the files the reference pages parse —
# the keybindings, the package lists and the nine palettes. Run it on a
# release, then commit what changed.

import glob
import json
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.normpath(os.path.join(HERE, ".."))
SNAPSHOT = os.path.join(SITE, "src", "snapshot")
README = os.path.join(SITE, "src", "assets", "readme")
WALLPAPERS = os.path.join(SITE, "src", "assets", "wallpapers")

SOURCES = {
    "keybinds.lua": "home/.config/hypr/modules/keybinds.lua",
    "pacman.txt": "packages/pacman.txt",
    "aur.txt": "packages/aur.txt",
    "Palettes.qml": "home/.config/quickshell/theme/Palettes.qml",
}
PICTURES = (".jpg", ".jpeg", ".png", ".webp")


def fresh(path):
    shutil.rmtree(path, ignore_errors=True)
    os.makedirs(path)


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: scripts/refresh.py <path to an impasto clone>")
    repo = os.path.abspath(os.path.expanduser(sys.argv[1]))
    if not os.path.isfile(os.path.join(repo, "setup")):
        sys.exit(f"{repo} is not an impasto clone")

    os.makedirs(SNAPSHOT, exist_ok=True)
    for name, source in SOURCES.items():
        shutil.copyfile(os.path.join(repo, source), os.path.join(SNAPSHOT, name))

    fresh(README)
    for path in sorted(glob.glob(os.path.join(repo, ".github", "assets", "*"))):
        if path.lower().endswith((".jpg", ".png", ".gif")):
            shutil.copyfile(path, os.path.join(README, os.path.basename(path)))

    # build_palette writes nothing, but its module resolves state paths on
    # import; point them away from the running shell's.
    os.environ["XDG_STATE_HOME"] = tempfile.mkdtemp()
    sys.path.insert(0, os.path.join(repo, "home", ".config", "quickshell", "scripts"))
    import theme_manager  # noqa: E402  # pyright: ignore[reportMissingImports]

    fresh(WALLPAPERS)
    walls = []
    for path in sorted(glob.glob(os.path.join(repo, "home", ".local", "share", "wallpapers", "*"))):
        if not path.lower().endswith(PICTURES):
            continue
        name = os.path.basename(path)
        wall_id = os.path.splitext(name)[0]
        image = Image.open(path).convert("RGB")
        if image.width > 1920:
            image = image.resize((1920, round(image.height * 1920 / image.width)), Image.Resampling.LANCZOS)
        image.save(os.path.join(WALLPAPERS, wall_id + ".webp"), "WEBP", quality=76, method=6)
        walls.append({
            "id": wall_id,
            "file": wall_id + ".webp",
            "name": theme_manager.pretty_name(name),
            "palette": theme_manager.build_palette(path),
        })
    with open(os.path.join(SNAPSHOT, "wallpapers.json"), "w", encoding="utf-8") as handle:
        json.dump(walls, handle, indent=1)
        handle.write("\n")

    version = subprocess.run(["git", "-C", repo, "describe", "--tags", "--always"],
                             capture_output=True, text=True).stdout.strip()
    with open(os.path.join(SNAPSHOT, "version.txt"), "w", encoding="utf-8") as handle:
        handle.write((version or "unknown") + "\n")

    print(f"impasto {version or 'unknown'}: {len(SOURCES)} files, "
          f"{len(os.listdir(README))} pictures, {len(walls)} wallpapers")


if __name__ == "__main__":
    main()
