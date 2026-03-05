@echo off
echo Starting Mortgage Rate Scraping Pipeline...
cd /d "%~dp0"
python src/pipeline.py
pause
