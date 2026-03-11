#!/bin/bash
# Manual deploy script - use if automated deployment shows stale data
# This triggers the scrape-and-deploy workflow with latest data

set -e

echo "=== Manual Rate Scrape & Deploy ==="
echo "This will scrape fresh rates and deploy to production"
echo ""

# Ensure we're on latest main
echo "Pulling latest changes..."
git pull origin master

# Check current data
echo ""
echo "Current data status:"
node -e "const d=require('./data/rates.json'); const m=require('./data/metadata.json'); console.log('  Rates:', d.length); console.log('  Lenders:', [...new Set(d.map(r=>r.lender_slug))].length); console.log('  Last updated:', m.last_updated);"

# Trigger workflow via GitHub CLI (if available) or create empty commit
echo ""
echo "Triggering deployment..."

if command -v gh &> /dev/null; then
    # Use GitHub CLI to trigger workflow
    gh workflow run scrape-and-deploy.yml --ref master
    echo "Workflow triggered! Check: https://github.com/drewbotcarrothers/latestmortgagerates/actions"
else
    # Fallback: create empty commit to trigger CI
    git commit --allow-empty -m "Manual deploy trigger"
    git push
    echo "Empty commit pushed to trigger workflow"
fi

echo ""
echo "Done! Check GitHub Actions for progress."
