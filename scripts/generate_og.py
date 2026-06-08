"""Generate assets/og-image.png (1200x630) for Sunshine Growth Solutions.
Run:  python scripts/generate_og.py
Uses Pillow only. Composites the real logo lockup; fonts fall back gracefully.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
OUT = os.path.join(ASSETS, "og-image.png")

# Palette — matched to the logo
CREAM = (252, 246, 234)
TEAL = (51, 64, 63)         # heading / --ink
MUTED = (88, 102, 100)      # --ink-soft
GOLD = (201, 154, 92)       # --sun
TERRA = (197, 122, 85)      # --terracotta (the sun)

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

serif_b = lambda s: font(["georgiab.ttf", "Georgia.ttf", "times.ttf"], s)
serif_i = lambda s: font(["georgiai.ttf", "Georgia.ttf", "times.ttf"], s)
sans    = lambda s: font(["segoeui.ttf", "arial.ttf"], s)
script  = lambda s: font(["segoesc.ttf", "Inkfree.ttf", "comici.ttf"], s)

img = Image.new("RGB", (W, H), CREAM)

def glow(color, cx, cy, radius, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                                  fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.45))
    img.paste(Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB"), (0, 0))

# Soft brand glows in the corners
glow(TERRA, 1130, 60, 300, 120)
glow(GOLD, 980, -10, 240, 90)

d = ImageDraw.Draw(img)
PAD = 90

# Eyebrow
d.text((PAD, 88), "hello & welcome", font=script(46), fill=TERRA)

# Headline
hl = serif_b(72)
hi = serif_i(72)
y = 146
for line in ["Strategic growth that", "helps your firm"]:
    d.text((PAD, y), line, font=hl, fill=TEAL)
    y += 80
d.text((PAD, y), "win more work.", font=hi, fill=TERRA)
y += 96

# Subtitle
d.text((PAD, y + 4), "Business development, growth strategy & winning proposals.",
       font=sans(28), fill=MUTED)

# Real logo lockup, bottom-left
try:
    logo = Image.open(os.path.join(ASSETS, "logo-lockup.png")).convert("RGBA")
    lw = 420
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    img.paste(logo, (PAD, H - logo.height - 52), logo)
except Exception as e:
    print("logo composite skipped:", e)

img.save(OUT, "PNG")
print("Wrote", os.path.normpath(OUT), img.size)
