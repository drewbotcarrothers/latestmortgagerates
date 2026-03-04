"""
CSU Video Generator Package Creator
Creates a script that generates video using MoviePy
"""

video_code = '''"""
CSU Video Generator - Requires MoviePy and FFmpeg

This script generates a 12-minute video slideshow using:
- CSU charts (output/csu_analysis/chart*.png)
- Captions (output/csu_analysis/csu_captions.json)

Install dependencies:
    pip install moviepy pillow
    
Also requires FFmpeg installed on system:
    Ubuntu/Debian: sudo apt-get install ffmpeg
    Windows: Download from https://www.gyan.dev/ffmpeg/builds/
    macOS: brew install ffmpeg
"""

import json
from pathlib import Path
try:
    from moviepy.editor import ImageClip, concatenate_videoclips, CompositeVideoClip, TextClip
    from moviepy.video.fx.all import fadein, fadeout
    MOVIEPY_AVAILABLE = True
except ImportError:
    MOVIEPY_AVAILABLE = False
    print("ERROR: MoviePy not installed. Run: pip install moviepy")
    print("Also requires FFmpeg - see script header for install instructions.")
    exit(1)

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("ERROR: Pillow not installed. Run: pip install pillow")
    exit(1)

# Configuration
OUTPUT_DIR = Path('../output/csu_analysis')
OUTPUT_VIDEO = OUTPUT_DIR / 'csu_stock_analysis_video.mp4'

def create_slide_with_title(chart_path, title_text, duration, slide_num):
    """Create a slide with chart and title overlay"""
    # Load chart
    img = Image.open(chart_path)
    orig_width, orig_height = img.size
    
    # Target 1080p (1920x1080) with space for title
    target_width = 1920
    target_height = 1080
    title_height = 100
    
    # Scale chart to fit width while maintaining aspect ratio
    scale_factor = target_width / orig_width
    new_height = int(orig_height * scale_factor)
    
    # Resize chart
    img_resized = img.resize((target_width, new_height), Image.Resampling.LANCZOS)
    
    # Create 1080p canvas
    canvas = Image.new('RGB', (target_width, target_height), '#1a1a2e')
    
    # Paste chart (centered vertically with space for title)
    y_offset = title_height + (target_height - title_height - new_height) // 2
    canvas.paste(img_resized, (0, y_offset))
    
    # Add title
    draw = ImageDraw.Draw(canvas)
    try:
        # Try to use a nice font
        title_font = ImageFont.truetype("C:/Windows/Fonts/Arial.ttf", 48)
        slide_font = ImageFont.truetype("C:/Windows/Fonts/Arial.ttf", 24)
    except:
        title_font = ImageFont.load_default()
        slide_font = ImageFont.load_default()
    
    # Draw slide number
    slide_text = f"Slide {slide_num}"
    draw.text((30, 30), slide_text, fill='#888888', font=slide_font)
    
    # Draw title (centered)
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    text_width = bbox[2] - bbox[0]
    x = (target_width - text_width) // 2
    draw.text((x, 25), title_text, fill='white', font=title_font)
    
    # Save temp
    temp_path = OUTPUT_DIR / f'_temp_slide_{slide_num:02d}.png'
    canvas.save(temp_path, quality=95)
    return str(temp_path)

def create_title_card(title, subtitle, duration, slide_num):
    """Create a title-only slide"""
    target_width, target_height = 1920, 1080
    img = Image.new('RGB', (target_width, target_height), '#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/Arial.ttf", 72)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/Arial.ttf", 36)
        slide_font = ImageFont.truetype("C:/Windows/Fonts/Arial.ttf", 24)
    except:
        title_font = subtitle_font = slide_font = ImageFont.load_default()
    
    # Draw slide number
    draw.text((30, 30), f"Slide {slide_num}", fill='#888888', font=slide_font)
    
    # Center title
    bbox = draw.textbbox((0, 0), title, font=title_font)
    text_width = bbox[2] - bbox[0]
    x = (target_width - text_width) // 2
    draw.text((x, 420), title, fill='white', font=title_font)
    
    # Center subtitle
    if subtitle:
        bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        text_width = bbox[2] - bbox[0]
        x = (target_width - text_width) // 2
        draw.text((x, 520), subtitle, fill='#1E88E5', font=subtitle_font)
    
    # Add brand
    brand = "StockSummarizer.com"
    bbox = draw.textbbox((0, 0), brand, font=slide_font)
    text_width = bbox[2] - bbox[0]
    x = (target_width - text_width) // 2
    draw.text((x, 980), brand, fill='#666666', font=slide_font)
    
    temp_path = OUTPUT_DIR / f'_temp_slide_{slide_num:02d}.png'
    img.save(temp_path, quality=95)
    return str(temp_path)

def generate_video():
    """Generate the video"""
    print("="*70)
    print("CSU VIDEO GENERATOR")
    print("="*70)
    print("\nLoading caption data...")
    
    # Load captions
    captions_file = OUTPUT_DIR / 'csu_captions.json'
    if not captions_file.exists():
        print(f"ERROR: {captions_file} not found!")
        print("Run csu_youtube_script.py first.")
        return
    
    with open(captions_file, 'r') as f:
        data = json.load(f)
    
    slides = data['slides']
    print(f"Found {len(slides)} slides to process\n")
    
    # Chart mapping: which slide uses which chart
    chart_mapping = {
        1: 'chart1_pe_comparison',
        2: None,  # Title card
        3: None,  # Title card
        4: 'chart2_growth_metrics',
        5: 'chart4_valuation_analysis',
        6: 'chart6_historical_performance',
        7: 'chart5_growth_scorecard',
        8: 'chart5_growth_scorecard', 
        9: 'chart1_pe_comparison',
        10: 'chart6_historical_performance',
        11: 'chart7_performance_summary',
        12: None,
        13: 'chart4_valuation_analysis',
        14: None,
        15: None,
        16: None,
        17: None,
        18: None,
        19: None,
        20: None,
    }
    
    clips = []
    total_duration = 0
    
    for slide in slides:
        slide_num = slide['slide_num']
        title = slide['title']
        duration = slide['duration_seconds']
        total_duration += duration
        
        print(f"Processing Slide {slide_num:2d}: {title[:40]:<40} ({duration:2d}s)")
        
        # Find chart file
        temp_img = None
        if slide_num in chart_mapping and chart_mapping[slide_num]:
            base_name = chart_mapping[slide_num]
            # Find the file
            for f in OUTPUT_DIR.glob(f'{base_name}*.png'):
                if not f.name.startswith('_temp'):
                    temp_img = create_slide_with_title(f, title, duration, slide_num)
                    break
        
        if not temp_img:
            # Create title card
            subtitle = slide['section'] if slide['section'] != 'CTA' else 'Thanks for watching'
            temp_img = create_title_card(title, subtitle, duration, slide_num)
        
        # Create video clip
        img_clip = ImageClip(temp_img).set_duration(duration)
        
        # Add fade in/out (0.5s each, but capped at 30% of duration)
        fade_time = min(0.5, duration * 0.15)
        img_clip = fadein(img_clip, fade_time)
        img_clip = fadeout(img_clip, fade_time)
        
        clips.append(img_clip)
    
    # Concatenate
    print("\n" + "-"*70)
    print("Concatenating slides...")
    final_clip = concatenate_videoclips(clips, method="compose")
    
    # Render
    print(f"Rendering {total_duration//60}:{total_duration%60:02d} video...")
    print("This may take 5-10 minutes...\n")
    
    final_clip.write_videofile(
        str(OUTPUT_VIDEO),
        fps=24,
        codec='libx264',
        audio=False,
        threads=4,
        preset='ultrafast',  # Fast encoding
        logger=None  # Reduce output
    )
    
    print("\n" + "="*70)
    print("VIDEO GENERATION COMPLETE!")
    print("="*70)
    print(f"\nOutput: {OUTPUT_VIDEO}")
    print(f"Duration: {total_duration//60}:{total_duration%60:02d}")
    print(f"Resolution: 1920x1080 (1080p)")
    print(f"Format: MP4 (H.264)")
    
    # Cleanup
    print("\nCleaning up temp files...")
    for temp in OUTPUT_DIR.glob('_temp_slide_*.png'):
        temp.unlink()
    print("Done!")

if __name__ == '__main__':
    generate_video()
'''

# Save the script
output_path = Path('C:/Users/acarr/.openclaw/workspace/stocksummarizer/Stock Analysis/analysis_scripts/generate_csu_video.py')
output_path.unlink(missing_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(video_code)

print("="*70)
print("CSU VIDEO GENERATOR SCRIPT CREATED")
print("="*70)
print(f"\nLocation: {output_path}")
print("\nWHAT IT DOES:")
print("  - Creates a 1920x1080 (1080p) video")
print("  - Uses CSU charts with title overlays")
print("  - 20 slides, ~12 min duration")
print("  - Fade transitions between slides")
print("  - Exports to MP4 (H.264)")
print("\nREQUIREMENTS:")
print("  1. pip install moviepy pillow")
print("  2. FFmpeg installed (see script header)")
print("\nTO RUN:")
print("  cd \"analysis_scripts\"")
print("  python generate_csu_video.py")
print("\nESTIMATED TIME: 5-10 minutes to render")
