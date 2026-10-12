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

    # 3. Maskable icon for PWA: full bleed background (no rounded corners so launcher mask won't expose transparent corners)
    # In dark_svg, replace rx="128" with rx="0"
    maskable_svg = dark_svg.replace('rx="128"', 'rx="0"')
    maskable_png_1024 = os.path.join(WORKSPACE, "temp_maskable_1024.png")
    render_svg_to_png(maskable_svg, maskable_png_1024, 1024, 1024)
    maskable_img = Image.open(maskable_png_1024).convert("RGBA")
    maskable_512 = maskable_img.resize((512, 512), Image.Resampling.LANCZOS)
    maskable_512.save(os.path.join(WORKSPACE, "public", "icon-maskable-512.png"), "PNG")
    print("  -> public/icon-maskable-512.png")

    # 4. Android Adaptive Icon Foreground
    # Transparent background, only the pillars and cut
    # Remove the container rect
    foreground_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <g transform="rotate(-35 256 256)">
    <!-- Left Pillar (Amber) -->
    <rect x="156" y="126" width="90" height="260" rx="45" fill="#E08E45"/>
    
    <!-- Right Offset Pillar (Amber) -->
    <rect x="266" y="126" width="90" height="260" rx="45" fill="#E08E45"/>
    
    <!-- Negative Space Cut / Interlock Bridge -->
    <path d="M 156 316 L 356 196" stroke="#121218" stroke-width="24" stroke-linecap="round"/>
  </g>
</svg>"""
    fg_png_1024 = os.path.join(WORKSPACE, "temp_fg_1024.png")
    render_svg_to_png(foreground_svg, fg_png_1024, 1024, 1024)
    fg_img = Image.open(fg_png_1024).convert("RGBA")

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
        adaptive_fg = fg_img.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
        adaptive_fg.save(os.path.join(folder, "ic_launcher_foreground.png"), "PNG")

        print(f"  -> mipmap-{density}: legacy ({leg_size}x{leg_size}), round ({leg_size}x{leg_size}), foreground ({fg_size}x{fg_size})")

    # Clean up temp files
    for tmp in [base_png_1024, maskable_png_1024, fg_png_1024]:
        if os.path.exists(tmp):
            os.remove(tmp)

    print("\nAll icon assets successfully generated!")

if __name__ == "__main__":
    main()
