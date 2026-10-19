import os
import subprocess
from PIL import Image, ImageDraw

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WORKSPACE = r"C:\Users\Ruth.A\Desktop\New folder\Next"

def render_svg_to_png(svg_string: str, output_png_path: str, width: int = 512, height: int = 512):
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: {width}px; height: {height}px; overflow: hidden; background: transparent; }}
  svg {{ width: {width}px; height: {height}px; display: block; }}
</style>
</head>
<body>
{svg_string}
</body>
</html>"""
    temp_html = os.path.join(WORKSPACE, "temp_render.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    file_url = "file:///" + temp_html.replace("\\", "/")
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--default-background-color=00000000",
        f"--screenshot={output_png_path}",
        f"--window-size={width},{height}",
        file_url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(temp_html):
        os.remove(temp_html)
    
    if not os.path.exists(output_png_path):
        raise RuntimeError(f"Rendering failed. Chrome error: {res.stderr}")

def create_circular_icon(img: Image.Image) -> Image.Image:
    # Create circular mask
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)
    
    output = Image.new("RGBA", img.size, (0, 0, 0, 0))
    output.paste(img, (0, 0), mask=mask)
    return output

def create_maskable_icon(img: Image.Image) -> Image.Image:
    # Keep Pip inside Android's central 80% safe zone, with a full-bleed dark background.
    size = img.size[0]
    inset = img.resize((round(size * 0.8), round(size * 0.8)), Image.Resampling.LANCZOS)
    output = Image.new("RGBA", img.size, (17, 17, 22, 255))
    output.alpha_composite(inset, ((size - inset.width) // 2, (size - inset.height) // 2))
    return output

def create_adaptive_foreground(img: Image.Image, size: int) -> Image.Image:
    # Reuse the Pip artwork, remove its dark backdrop, and leave the 10% adaptive-icon inset.
    inset_size = round(size * 0.8)
    art = img.resize((inset_size, inset_size), Image.Resampling.LANCZOS)
    pixels = art.load()
    for y in range(art.height):
        for x in range(art.width):
            r, g, b, _ = pixels[x, y]
            distance = ((r - 17) ** 2 + (g - 17) ** 2 + (b - 22) ** 2) ** 0.5
            alpha = max(0, min(255, round((distance - 10) * 6)))
            pixels[x, y] = (r, g, b, alpha)
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.alpha_composite(art, ((size - inset_size) // 2, (size - inset_size) // 2))
    return output

def main():
    dark_svg_path = os.path.join(WORKSPACE, "public", "icon-dark.svg")
    with open(dark_svg_path, "r", encoding="utf-8") as f:
        dark_svg = f.read()

    # 1. Full 1024x1024 base render for maximum scaling fidelity
    base_png_1024 = os.path.join(WORKSPACE, "temp_base_1024.png")
    render_svg_to_png(dark_svg, base_png_1024, 1024, 1024)
    base_img = Image.open(base_png_1024).convert("RGBA")

    # 2. Web public icons
    print("Generating public web icons...")
    # icon-512.png
    img_512 = base_img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(WORKSPACE, "public", "icon-512.png"), "PNG")
    print("  -> public/icon-512.png")

    # icon-192.png
    img_192 = base_img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(WORKSPACE, "public", "icon-192.png"), "PNG")
    print("  -> public/icon-192.png")

    # apple-touch-icon.png (180x180)
    img_apple = base_img.resize((180, 180), Image.Resampling.LANCZOS)
    img_apple.save(os.path.join(WORKSPACE, "public", "apple-touch-icon.png"), "PNG")
    print("  -> public/apple-touch-icon.png")

    # 3. Maskable icon with Pip inset into the central safe zone.
    maskable_img = create_maskable_icon(base_img)
    maskable_512 = maskable_img.resize((512, 512), Image.Resampling.LANCZOS)
    maskable_512.save(os.path.join(WORKSPACE, "public", "icon-maskable-512.png"), "PNG")
    print("  -> public/icon-maskable-512.png")

    # Android mipmap densities and dimensions
    android_res_dir = os.path.join(WORKSPACE, "android", "app", "src", "main", "res")
    densities = {
        "mdpi": {"legacy": 48, "foreground": 108},
        "hdpi": {"legacy": 72, "foreground": 162},
        "xhdpi": {"legacy": 96, "foreground": 216},
        "xxhdpi": {"legacy": 144, "foreground": 324},
        "xxxhdpi": {"legacy": 192, "foreground": 432},
    }

    print("\nGenerating Android launcher mipmap resources...")
    for density, sizes in densities.items():
        folder = os.path.join(android_res_dir, f"mipmap-{density}")
        os.makedirs(folder, exist_ok=True)

        leg_size = sizes["legacy"]
        fg_size = sizes["foreground"]

        # ic_launcher.png (legacy rounded squircle)
        leg_img = base_img.resize((leg_size, leg_size), Image.Resampling.LANCZOS)
        leg_img.save(os.path.join(folder, "ic_launcher.png"), "PNG")

        # ic_launcher_round.png (circular)
        # Note: Use full-bleed background for round icon so the circle is fully filled
        maskable_leg = maskable_img.resize((leg_size, leg_size), Image.Resampling.LANCZOS)
        round_img = create_circular_icon(maskable_leg)
        round_img.save(os.path.join(folder, "ic_launcher_round.png"), "PNG")

        # ic_launcher_foreground.png (for adaptive icon)
        adaptive_fg = create_adaptive_foreground(base_img, fg_size)
        adaptive_fg.save(os.path.join(folder, "ic_launcher_foreground.png"), "PNG")

        print(f"  -> mipmap-{density}: legacy ({leg_size}x{leg_size}), round ({leg_size}x{leg_size}), foreground ({fg_size}x{fg_size})")

    # Clean up temp files
    for tmp in [base_png_1024]:
        if os.path.exists(tmp):
            os.remove(tmp)

    print("\nAll icon assets successfully generated!")

if __name__ == "__main__":
    main()
