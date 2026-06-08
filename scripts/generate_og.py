"""Generate assets/og-image.png (1200x630) for Sunshine Growth Solutions.
Run:  python scripts/generate_og.py
Uses Pillow only. Fonts fall back gracefully if a face is missing.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "og-image.png")

# Palette
CREAM = (252, 246, 234)
INK = (59, 47, 37)
MUTED = (110, 95, 80)
SUN = (235, 166, 58)
SUN_DEEP = (213, 130, 31)
TERRA = (192, 96, 58)
SAGE_DEEP = (95, 107, 67)
BLUSH = (221, 161, 147)

FONTS = "C:/Windows/Fonts"

def font(names, size):
    for n in names:
        p = os.path.join(FONTS, n)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

serif_b   = lambda s: font(["georgiab.ttf", "Georgia.ttf", "times.ttf"], s)
serif_i   = lambda s: font(["georgiai.ttf", "Georgia.ttf", "times.ttf"], s)
serif_reg = lambda s: font(["georgia.ttf", "Georgia.ttf", "times.ttf"], s)
sans      = lambda s: font(["segoeui.ttf", "arial.ttf"], s)
script    = lambda s: font(["segoesc.ttf", "Inkfree.ttf", "comici.ttf"], s)

img = Image.new("RGB", (W, H), CREAM)

def glow(color, cx, cy, radius, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
              fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.45))
    img.paste(Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB"), (0, 0))

# Soft brand glows
glow(SUN, 1120, 40, 300, 150)
glow(BLUSH, 60, 80, 240, 90)

draw = ImageDraw.Draw(img)

PAD = 90

def sun_mark(ox, oy, scale=1.0):
    r = int(34 * scale)
    cx, cy = ox + r + int(18 * scale), oy + r + int(18 * scale)
    lw = max(2, int(6 * scale))
    ray_in, ray_out = int(r + 9 * scale), int(r + 24 * scale)
    import math
    for i in range(8):
        a = math.radians(i * 45)
        x1, y1 = cx + ray_in * math.cos(a), cy + ray_in * math.sin(a)
        x2, y2 = cx + ray_out * math.cos(a), cy + ray_out * math.sin(a)
        draw.line([x1, y1, x2, y2], fill=SUN_DEEP, width=lw)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=SUN, outline=SUN_DEEP, width=lw)
    # leaf
    leaf = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(leaf)
    lr = int(r * 0.78)
    ld.ellipse([cx - lr * 0.42, cy - lr * 1.25, cx + lr * 0.42, cy + lr * 0.35],
               fill=CREAM + (255,), outline=SAGE_DEEP + (255,), width=max(2, int(3 * scale)))
    img.paste(Image.alpha_composite(img.convert("RGBA"), leaf).convert("RGB"), (0, 0))
    return cy + r

# Sun mark top-left of content
sun_mark(PAD, 70, 1.0)

d = ImageDraw.Draw(img)

# Eyebrow
d.text((PAD, 170), "hello & welcome", font=script(46), fill=TERRA)

# Headline (wrapped manually)
hl = serif_b(78)
hi = serif_i(78)
lines = [("Strategic growth that", None), ("helps your business", None)]
y = 224
for text, _ in lines:
    d.text((PAD, y), text, font=hl, fill=INK)
    y += 86
# last line: bloom. in gold italic
d.text((PAD, y), "bloom.", font=hi, fill=SUN_DEEP)
y += 104

# Subtitle
d.text((PAD, y + 6), "Business development, growth strategy & winning proposals.",
       font=sans(30), fill=MUTED)

# Brand block bottom-left (full-width safe; no right-side text to collide with)
by = H - 96
d.text((PAD, by), "Sunshine Growth Solutions", font=serif_b(38), fill=INK)
d.text((PAD, by + 50), "BUSINESS DEVELOPMENT · GROWTH STRATEGY · PROPOSALS",
       font=sans(16), fill=TERRA)

# Decorative script accent — small "by Tonya DiClemente" right side
byline = "by Tonya DiClemente"
bf = script(30)
bw = d.textlength(byline, font=bf)
d.text((W - PAD - bw, H - 64), byline, font=bf, fill=SUN_DEEP)

img.save(OUT, "PNG")
print("Wrote", os.path.normpath(OUT), img.size)
