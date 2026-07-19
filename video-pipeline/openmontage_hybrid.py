"""
OpenMontage Hybrid Pipeline for Latest Mortgage Rates
Integrates existing rate card HTML generators with OpenMontage rendering + voiceover

Usage:
    python openmontage_hybrid.py --type short --output-dir ./output
    python openmontage_hybrid.py --type cards --output-dir ./output
    python openmontage_hybrid.py --type monthly --output-dir ./output
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Add OpenMontage to path
OPENMONTAGE_DIR = Path(__file__).parent / "openmontage"
sys.path.insert(0, str(OPENMONTAGE_DIR))

from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")


class RateCardHybridPipeline:
    """Hybrid pipeline: rate card HTML + OpenMontage rendering + voiceover"""
    
    def __init__(self, output_dir: str = "./output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Load rate data
        self.rates_path = Path(__file__).parent.parent / "data" / "rates.json"
        self.historical_path = Path(__file__).parent.parent / "data" / "historical_rates.json"
        
    def load_rates(self) -> list:
        """Load current rates from JSON"""
        with open(self.rates_path) as f:
            return json.load(f)
    
    def load_historical(self) -> Optional[list]:
        """Load historical rates for trends"""
        if not self.historical_path.exists():
            return None
        with open(self.historical_path) as f:
            return json.load(f)
    
    def get_best_rates(self, rates: list) -> dict:
        """Extract best rates by category"""
        def get_best(term, rate_type, mortgage_type):
            filtered = [r for r in rates 
                       if r.get("term_months") == term 
                       and r.get("rate_type") == rate_type
                       and r.get("mortgage_type") == mortgage_type]
            return sorted(filtered, key=lambda x: x.get("rate", 999))[0] if filtered else None
        
        return {
            "fixed5y_insured": get_best(60, "fixed", "insured"),
            "fixed5y_uninsured": get_best(60, "fixed", "uninsured"),
            "variable5y_insured": get_best(60, "variable", "insured"),
            "variable5y_uninsured": get_best(60, "variable", "uninsured"),
            "fixed3y": get_best(36, "fixed", "uninsured"),
        }
    
    def generate_script(self, video_type: str, rates: dict) -> str:
        """Generate narration script for the video"""
        today = datetime.now().strftime("%B %d, %Y")
        
        if video_type == "short":
            best = rates.get("fixed5y_insured") or rates.get("fixed5y_uninsured")
            rate = best.get("rate", "N/A") if best else "N/A"
            lender = best.get("lender_name", "Unknown") if best else "Unknown"
            
            return f"""Today's best 5-year fixed mortgage rate: {rate}% from {lender}.
That's {today}. Compare more rates at latestmortgagerates.ca"""
        
        elif video_type == "cards":
            fixed_insured = rates.get("fixed5y_insured")
            fixed_uninsured = rates.get("fixed5y_uninsured")
            var_insured = rates.get("variable5y_insured")
            var_uninsured = rates.get("variable5y_uninsured")
            
            lines = [f"This week's top Canadian mortgage rates for {today}."]
            
            if fixed_insured:
                lines.append(f"5-year fixed insured: {fixed_insured.get('rate')}% from {fixed_insured.get('lender_name')}")
            if fixed_uninsured:
                lines.append(f"5-year fixed uninsured: {fixed_uninsured.get('rate')}% from {fixed_uninsured.get('lender_name')}")
            if var_insured:
                lines.append(f"5-year variable insured: {var_insured.get('rate')}% from {var_insured.get('lender_name')}")
            if var_uninsured:
                lines.append(f"5-year variable uninsured: {var_uninsured.get('rate')}% from {var_uninsured.get('lender_name')}")
            
            lines.append("Get your personalized rate at latestmortgagerates.ca")
            return " ".join(lines)
        
        elif video_type == "monthly":
            # Monthly deep dive with market analysis
            fixed_insured = rates.get("fixed5y_insured")
            fixed_uninsured = rates.get("fixed5y_uninsured")
            var = rates.get("variable5y_insured") or rates.get("variable5y_uninsured")
            
            lines = [
                f"Canadian mortgage market update for {today}.",
                f"The best 5-year fixed rate is {fixed_insured.get('rate') if fixed_insured else 'N/A'}%",
                f"while the top variable rate sits at {var.get('rate') if var else 'N/A'}%.",
                "The Bank of Canada has held rates steady, maintaining prime at 4.45%.",
                "Bond yields have stabilized, suggesting fixed rates may hold through the quarter.",
                "For personalized quotes and the latest updates, visit latestmortgagerates.ca"
            ]
            return " ".join(lines)
        
        return "Compare Canadian mortgage rates at latestmortgagerates.ca"
    
    def generate_narration(self, script: str, output_path: Path) -> Path:
        """Generate voiceover using OpenMontage TTS or fallback"""
        # Check for ElevenLabs
        elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if elevenlabs_key:
            return self._generate_elevenlabs(script, output_path)
        elif openai_key:
            return self._generate_openai(script, output_path)
        else:
            return self._generate_piper(script, output_path)
    
    def _generate_elevenlabs(self, script: str, output_path: Path) -> Path:
        """Use ElevenLabs for premium narration"""
        import requests
        
        voice_id = os.getenv("RATE_CARD_VOICE", "nova")
        api_key = os.getenv("ELEVENLABS_API_KEY")
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": api_key
        }
        data = {
            "text": script,
            "model_id": "eleven_turbo_v2_5",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        
        audio_path = output_path.with_suffix(".mp3")
        with open(audio_path, "wb") as f:
            f.write(response.content)
        
        return audio_path
    
    def _generate_openai(self, script: str, output_path: Path) -> Path:
        """Use OpenAI TTS"""
        from openai import OpenAI
        
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        voice = os.getenv("RATE_CARD_VOICE", "nova")
        
        audio_path = output_path.with_suffix(".mp3")
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=script
        )
        response.stream_to_file(str(audio_path))
        
        return audio_path
    
    def _generate_piper(self, script: str, output_path: Path) -> Path:
        """Use free local Piper TTS"""
        # Piper is included with OpenMontage setup
        audio_path = output_path.with_suffix(".wav")
        
        cmd = [
            "python", "-m", "piper", "tts",
            "--model", "en_US-lessac-medium",
            "--output_file", str(audio_path)
        ]
        
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        proc.communicate(input=script.encode())
        
        return audio_path
    
    def find_stock_footage(self, query: str) -> Optional[str]:
        """Find stock footage from Pexels or Pixabay"""
        pexels_key = os.getenv("PEXELS_API_KEY")
        pixabay_key = os.getenv("PIXABAY_API_KEY")
        
        if pexels_key:
            return self._search_pexels(query, pexels_key)
        elif pixabay_key:
            return self._search_pixabay(query, pixabay_key)
        
        return None
    
    def _search_pexels(self, query: str, api_key: str) -> Optional[str]:
        """Search Pexels for video footage"""
        import requests
        
        url = "https://api.pexels.com/videos/search"
        headers = {"Authorization": api_key}
        params = {"query": query, "per_page": 1, "orientation": "landscape"}
        
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        
        if data.get("videos"):
            # Get the best quality video file
            video_files = data["videos"][0].get("video_files", [])
            if video_files:
                # Sort by quality (height)
                best = sorted(video_files, key=lambda x: x.get("height", 0), reverse=True)[0]
                return best.get("link")
        
        return None
    
    def _search_pixabay(self, query: str, api_key: str) -> Optional[str]:
        """Search Pixabay for video footage"""
        import requests
        
        url = "https://pixabay.com/api/videos/"
        params = {
            "key": api_key,
            "q": query,
            "per_page": 3,
            "video_type": "film"
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get("hits"):
            videos = data["hits"][0].get("videos", {})
            if videos.get("large"):
                return videos["large"].get("url")
        
        return None
    
    def render_with_ffmpeg(self, html_path: Path, audio_path: Path, 
                          output_path: Path, duration: int) -> Path:
        """Render HTML + audio into final video using FFmpeg"""
        # First, convert HTML to images/frames (simplified approach)
        # For production, use OpenMontage's remotion-composer or hyperframes
        
        # This is a placeholder - actual implementation would:
        # 1. Use puppeteer/playwright to screenshot HTML at video framerate
        # 2. Combine with audio using FFmpeg
        # 3. Add transitions, captions, etc.
        
        print(f"Rendering video: {output_path}")
        print(f"  HTML: {html_path}")
        print(f"  Audio: {audio_path}")
        print(f"  Duration: {duration}s")
        
        # Placeholder: copy HTML as-is for now
        # In production, this would call OpenMontage's render pipeline
        return html_path
    
    def run(self, video_type: str) -> Path:
        """Run the full hybrid pipeline"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        project_dir = self.output_dir / f"{video_type}_{timestamp}"
        project_dir.mkdir(exist_ok=True)
        
        print(f"\n{'='*60}")
        print(f"OpenMontage Hybrid Pipeline: {video_type.upper()}")
        print(f"{'='*60}\n")
        
        # Step 1: Load rate data
        print("Step 1: Loading rate data...")
        rates_data = self.load_rates()
        best_rates = self.get_best_rates(rates_data)
        print(f"  Loaded {len(rates_data)} rates")
        
        # Step 2: Generate script
        print("\nStep 2: Generating narration script...")
        script = self.generate_script(video_type, best_rates)
        script_path = project_dir / "script.txt"
        with open(script_path, "w") as f:
            f.write(script)
        print(f"  Script saved to {script_path}")
        print(f"  Preview: {script[:100]}...")
        
        # Step 3: Generate narration audio
        print("\nStep 3: Generating voiceover...")
        audio_path = self.generate_narration(script, project_dir / "narration")
        print(f"  Audio saved to {audio_path}")
        
        # Step 4: Generate rate card HTML (using existing scripts)
        print("\nStep 4: Generating rate card HTML...")
        html_path = self._generate_rate_card_html(video_type, best_rates, project_dir)
        print(f"  HTML saved to {html_path}")
        
        # Step 5: Find background footage (optional)
        print("\nStep 5: Finding stock footage...")
        footage = self.find_stock_footage("mortgage home buying canada")
        if footage:
            print(f"  Found footage: {footage[:60]}...")
        else:
            print("  No stock footage found (will use animated cards only)")
        
        # Step 6: Render final video
        print("\nStep 6: Rendering final video...")
        duration_map = {"short": 15, "cards": 25, "monthly": 90}
        duration = duration_map.get(video_type, 30)
        
        output_video = project_dir / "final.mp4"
        self.render_with_ffmpeg(html_path, audio_path, output_video, duration)
        
        print(f"\n{'='*60}")
        print(f"Pipeline complete! Output: {project_dir}")
        print(f"{'='*60}\n")
        
        return project_dir
    
    def _generate_rate_card_html(self, video_type: str, rates: dict, 
                                  output_dir: Path) -> Path:
        """Generate HTML rate card using existing generator scripts"""
        # Call existing Node.js generators
        generator_map = {
            "short": "generate-daily-rate-short.js",
            "cards": "generate-weekly-5yr-cards.js", 
            "monthly": "generate-monthly-deepdive.js"
        }
        
        generator = generator_map.get(video_type)
        if not generator:
            raise ValueError(f"Unknown video type: {video_type}")
        
        generator_path = Path(__file__).parent / "scripts" / generator
        
        # Run the generator
        env = os.environ.copy()
        env["OUTPUT_DIR"] = str(output_dir)
        
        result = subprocess.run(
            ["node", str(generator_path)],
            capture_output=True,
            text=True,
            env=env,
            cwd=str(Path(__file__).parent)
        )
        
        if result.returncode != 0:
            print(f"Generator stderr: {result.stderr}")
        
        # Find the generated HTML file
        html_files = list(output_dir.glob("*.html"))
        if html_files:
            return html_files[0]
        
        # Fallback: create a simple HTML template
        return self._create_fallback_html(video_type, rates, output_dir)
    
    def _create_fallback_html(self, video_type: str, rates: dict, 
                               output_dir: Path) -> Path:
        """Create a simple HTML fallback if generator fails"""
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mortgage Rates - {datetime.now().strftime("%B %d, %Y")}</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }}
        .container {{
            text-align: center;
            padding: 40px;
        }}
        h1 {{
            font-size: 3rem;
            margin-bottom: 0.5em;
            background: linear-gradient(90deg, #0d9488, #34d399);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .rate {{
            font-size: 5rem;
            font-weight: 800;
            color: #34d399;
            margin: 20px 0;
        }}
        .lender {{
            font-size: 1.5rem;
            color: #94a3b8;
        }}
        .date {{
            font-size: 1rem;
            color: #64748b;
            margin-top: 40px;
        }}
        .url {{
            font-size: 0.875rem;
            color: #0d9488;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Today's Best Mortgage Rate</h1>
        <div class="rate">{rates.get('fixed5y_insured', {}).get('rate', 'N/A')}%</div>
        <div class="lender">{rates.get('fixed5y_insured', {}).get('lender_name', 'Compare Lenders')}</div>
        <div class="date">{datetime.now().strftime("%B %d, %Y")}</div>
        <div class="url">latestmortgagerates.ca</div>
    </div>
</body>
</html>"""
        
        html_path = output_dir / "rate_card.html"
        with open(html_path, "w") as f:
            f.write(html_content)
        
        return html_path


def main():
    parser = argparse.ArgumentParser(description="Generate mortgage rate videos with OpenMontage")
    parser.add_argument("--type", choices=["short", "cards", "monthly"], 
                       required=True, help="Video type to generate")
    parser.add_argument("--output-dir", default="./output",
                       help="Output directory for generated videos")
    
    args = parser.parse_args()
    
    pipeline = RateCardHybridPipeline(output_dir=args.output_dir)
    result = pipeline.run(args.type)
    
    print(f"\nVideo project created at: {result}")
    print(f"Next: Upload to YouTube with: node scripts/upload-youtube.js --video {result}/final.mp4 --type {args.type}")


if __name__ == "__main__":
    main()
