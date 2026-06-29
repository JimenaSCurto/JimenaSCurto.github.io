#!/usr/bin/env python3
"""
build/optimize_images.py

Converts PNG/JPEG images in a source folder to WebP, sized for this site's
gallery thumbnails. Run this whenever you add a new project painting/photo
before wiring it up in data/projects.json.

Usage:
    python3 build/optimize_images.py <input_dir> [output_dir]

Defaults:
    output_dir = images/ (the site's image folder)

Requires Pillow:
    pip install Pillow
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install it with: pip install Pillow")
    sys.exit(1)

QUALITY = 82
MAX_DIMENSION = 1400  # paintings are shown small; no need to keep huge originals


def optimize(input_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    exts = {".png", ".jpg", ".jpeg"}
    found = [p for p in input_dir.iterdir() if p.suffix.lower() in exts]

    if not found:
        print(f"No PNG/JPEG files found in {input_dir}")
        return

    for path in found:
        img = Image.open(path).convert("RGB")

        if max(img.size) > MAX_DIMENSION:
            ratio = MAX_DIMENSION / max(img.size)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        out_path = output_dir / (path.stem + ".webp")
        img.save(out_path, "WEBP", quality=QUALITY, method=6)

        before = path.stat().st_size / 1024
        after = out_path.stat().st_size / 1024
        print(f"{path.name}: {before:.0f}KB -> {out_path.name}: {after:.0f}KB")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    in_dir = Path(sys.argv[1])
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("images")

    if not in_dir.is_dir():
        print(f"Not a directory: {in_dir}")
        sys.exit(1)

    optimize(in_dir, out_dir)
