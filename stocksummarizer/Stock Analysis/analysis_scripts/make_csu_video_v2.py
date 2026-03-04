"""
CSU Video Generator - Creates MP4 from charts
"""

import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from moviepy import ImageClip, concatenate_videoclips
from moviepy.video.fx import FadeIn, FadeOut

# Paths
OUTPUT_DIR = Path('../output/csu_analysis')
OUTPUT_VIDEO = OUTPUT_DIR / 'csu_analysis_video.mp4'

print("="*70)
print("CSU VIDEO GENERATOR - MoviePy v2.x")
print("="*70)

# Load caption data
captions_file = OUTPUT_DIR / 'csu_captions.json'
if not captions_file.exists():
    print(f"ERROR: {captions_file} not found!")
    exit(1)

with open(captions_file, 'r') as f:
    data = json.load(f)

slides = data['slides']
print(f"Loaded {len(slides)} slides\n")

# Chart mapping
chart_files = {
    1: 'chart1_pe_comparison',
    4: 'chart2_growth_metrics',
    5: 'chart4_valuation_analysis',
    6: 'chart6_historical_performance',
    7: 'chart5_growth_scorecard',
    8: 'chart5_growth_scorecard',
    9: 'chart1_pe_comparison',
    10: 'chart6_historical_performance',
    11: 'chart7_performance_summary',
    13: 'chart4_valuation_analysis',
}

def create_slide_image(chart_path, title, slide_num):
    """Create slide"""
    target_width, target_height = 1920, 1080
    title_height = 100
    
    if chart_path and Path(chart_path).exists():
        img = Image.open(chart_path)
        orig_width, orig_height = img.size
        scale = target_width / orig_width
        new_height = int(orig_height * scale)
        img_resized = img.resize((target_width, new_height), Image.Resampling.LANCZOS)
        
        canvas = Image.new('RGB', (target_width, target_height), '#1a1a2e')
        y_offset = title_height + (target_height - title_height - new_height) // 2
        canvas.paste(img_resized, (0, max(title_height, y_offset)))
        
        draw = ImageDraw.Draw(canvas)
        
        try:
            title_font = ImageFont.truetype("arial.ttf", 48)
            slide_font = ImageFont.truetype("arial.ttf", 24)
            brand_font = ImageFont.truetype("arial.ttf", 20)
        except:
            title_font = slide_font = brand_font = ImageFont.load_default()
        
        draw.text((30, 30), f"Slide {slide_num}", fill='#888888', font=slide_font)
        
        bbox = draw.textbbox((0, 0), title, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (target_width - text_width) // 2
        draw.text((x, 25), title, fill='white', font=title_font)
        draw.text((1650, 1040), "StockSummarizer.com", fill='#666666', font=brand_font)
        
    else:
        canvas = Image.new('RGB', (target_width, target_height), '#1a1a2e')
        draw = ImageDraw.Draw(canvas)
        
        try:
            title_font = ImageFont.truetype("arial.ttf", 72)
            slide_font = ImageFont.truetype("arial.ttf", 24)
            brand_font = ImageFont.truetype("arial.ttf", 20)
        except:
            title_font = slide_font = brand_font = ImageFont.load_default()
        
        draw.text((30, 30), f"Slide {slide_num}", fill='#888888', font=slide_font)
        
        bbox = draw.textbbox((0, 0), title, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (target_width - text_width) // 2
        draw.text((x, 480), title, fill='white', font=title_font)
        draw.text((1650, 1040), "StockSummarizer.com", fill='#666666', font=brand_font)
    
    temp_path = OUTPUT_DIR / f'_temp_slide_{slide_num:02d}.png'
    canvas.save(temp_path, quality=95)
    return str(temp_path)

# Generate clips
clips = []
total_duration = 0

for slide in slides:
    slide_num = slide['slide_num']
    title = slide['title']
    duration = slide['duration_seconds']
    total_duration += duration
    
    print(f"Slide {slide_num:2d}: {title[:40]:<40} ({duration:2d}s)", end=" ")
    
    # Find chart
    temp_img = None
    if slide_num in chart_files and chart_files[slide_num]:
        base = chart_files[slide_num]
        for f in OUTPUT_DIR.glob(f'{base}*.png'):
            if not f.name.startswith('_temp'):
                temp_img = create_slide_image(f, title, slide_num)
                break
    
    if not temp_img:
        temp_img = create_slide_image(None, title, slide_num)
    
    # Create clip
    img_clip = ImageClip(temp_img)
    img_clip = img_clip.with_duration(duration)
    
    # Add fade effects using MoviePy v2.x syntax
    fade_time = min(0.5, duration * 0.2)
    img_clip = FadeIn(fade_time).apply(img_clip)
    img_clip = FadeOut(fade_time).apply(img_clip)
    
    clips.append(img_clip)
    print("OK")

# Concatenate
print("\n" + "-"*70)
print("Assembling video...")
final_clip = concatenate_videoclips(clips)

# Render
print(f"Rendering {total_duration//60}:{total_duration%60:02d} video...")
print("This takes 5-10 minutes...")

final_clip.write_videofile(
    str(OUTPUT_VIDEO),
    fps=24,
    codec='libx264',
    audio=False,
    threads=4,
    preset='ultrafast'
)

print("\n" + "="*70)
print("VIDEO COMPLETE!")
print("="*70)
print(f"Output: {OUTPUT_VIDEO}")
print(f"Duration: {total_duration//60}:{total_duration%60:02d}")
print(f"Resolution: 1920x1080")
print(f"Format: MP4")

# Cleanup
for temp in OUTPUT_DIR.glob('_temp_slide_*.png'):
    temp.unlink()
print("\nTemp files cleaned up.")
