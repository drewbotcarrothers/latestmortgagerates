"""
TSX Data Update Script
Merge new TradingView screener files and update TSX_Merged_Data.csv
"""

import pandas as pd
import os
from datetime import datetime
import shutil

# ============================================================================
# CONFIGURATION
# ============================================================================

# Where your new screener files are located
INPUT_FOLDER = '/sessions/gallant-great-fermat/mnt/uploads'

# Where to save the merged data
OUTPUT_FOLDER = '/sessions/gallant-great-fermat/mnt/Stock Analysis'
OUTPUT_FILENAME = 'TSX_Merged_Data.csv'

# Backup settings
CREATE_BACKUP = True
BACKUP_FOLDER = '/sessions/gallant-great-fermat/mnt/Stock Analysis/backups'

# ============================================================================
# BACKUP EXISTING DATA
# ============================================================================

if CREATE_BACKUP:
    # Create backup folder if it doesn't exist
    os.makedirs(BACKUP_FOLDER, exist_ok=True)

    # Check if current merged file exists
    current_file = os.path.join(OUTPUT_FOLDER, OUTPUT_FILENAME)
    if os.path.exists(current_file):
        # Create timestamped backup
        timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
        backup_filename = f'TSX_Merged_Data_backup_{timestamp}.csv'
        backup_path = os.path.join(BACKUP_FOLDER, backup_filename)

        shutil.copy2(current_file, backup_path)
        print(f"✓ Backed up existing data to: {backup_filename}")

        # Read old file to compare later
        old_df = pd.read_csv(current_file)
        old_count = len(old_df)
        old_date = timestamp
    else:
        print("⚠ No existing file to backup (first run)")
        old_count = 0
        old_date = "N/A"
else:
    old_count = 0
    old_date = "N/A"

# ============================================================================
# FIND NEW SCREENER FILES
# ============================================================================

print(f"\n" + "="*80)
print(f"SEARCHING FOR SCREENER FILES")
print(f"="*80)

# Look for CSV files with "TSX Screen" or similar pattern in name
screener_files = []
for filename in os.listdir(INPUT_FOLDER):
    if filename.endswith('.csv') and ('TSX' in filename or 'Screen' in filename):
        filepath = os.path.join(INPUT_FOLDER, filename)
        screener_files.append(filepath)

screener_files.sort()  # Sort alphabetically

print(f"\nFound {len(screener_files)} screener files:")
for i, filepath in enumerate(screener_files, 1):
    print(f"  {i}. {os.path.basename(filepath)}")

if len(screener_files) == 0:
    print("\n⚠ ERROR: No screener files found!")
    print(f"Expected files in: {INPUT_FOLDER}")
    print(f"File pattern: Contains 'TSX' or 'Screen' and ends with .csv")
    exit(1)

# ============================================================================
# LOAD AND MERGE FILES
# ============================================================================

print(f"\n" + "="*80)
print(f"MERGING FILES")
print(f"="*80)

dataframes = []
for i, filepath in enumerate(screener_files, 1):
    print(f"\nLoading file {i}/{len(screener_files)}: {os.path.basename(filepath)}")

    try:
        df = pd.read_csv(filepath)
        print(f"  ✓ Shape: {df.shape[0]} rows, {df.shape[1]} columns")

        # Check for duplicates
        duplicates = df[df.duplicated(subset=['Symbol'], keep=False)]
        if len(duplicates) > 0:
            print(f"  ⚠ Found {len(duplicates)} duplicate rows for {duplicates['Symbol'].nunique()} symbols")
            df = df.drop_duplicates(subset=['Symbol'], keep='first')
            print(f"  ✓ After removing duplicates: {df.shape[0]} rows")

        dataframes.append(df)

    except Exception as e:
        print(f"  ✗ ERROR loading file: {e}")
        continue

if len(dataframes) == 0:
    print("\n✗ ERROR: No files could be loaded successfully!")
    exit(1)

# Start merging
print(f"\n" + "-"*80)
print(f"Starting merge process...")
print(f"-"*80)

merged_df = dataframes[0]
print(f"\nStarting with {merged_df.shape[0]} unique stocks from first file")

for i, df in enumerate(dataframes[1:], 1):
    print(f"\nMerging file {i+1}...")
    print(f"  - File has {df.shape[0]} unique stocks")

    # Find common columns (except Symbol which is the merge key)
    common_cols = list(set(merged_df.columns) & set(df.columns))
    common_cols = [col for col in common_cols if col != 'Symbol']

    if common_cols:
        print(f"  - Removing {len(common_cols)} duplicate columns")
        df_to_merge = df.drop(columns=common_cols, errors='ignore')
    else:
        df_to_merge = df

    # Perform inner join (only keep stocks present in all files)
    before_merge = merged_df.shape[0]
    merged_df = pd.merge(merged_df, df_to_merge, on='Symbol', how='inner')
    print(f"  - After merge: {merged_df.shape[0]} stocks, {merged_df.shape[1]} columns")

# ============================================================================
# SAVE UPDATED DATA
# ============================================================================

print(f"\n" + "="*80)
print(f"SAVING MERGED DATA")
print(f"="*80)

output_path = os.path.join(OUTPUT_FOLDER, OUTPUT_FILENAME)
merged_df.to_csv(output_path, index=False)

print(f"\n✓ Merged data saved to: {OUTPUT_FILENAME}")
print(f"  Location: {output_path}")

# ============================================================================
# SUMMARY STATISTICS
# ============================================================================

print(f"\n" + "="*80)
print(f"UPDATE SUMMARY")
print(f"="*80)

print(f"\n📊 Data Statistics:")
print(f"  Total stocks: {merged_df.shape[0]}")
print(f"  Total columns: {merged_df.shape[1]}")
print(f"  Unique symbols: {merged_df['Symbol'].nunique()}")

if old_count > 0:
    change = merged_df.shape[0] - old_count
    change_pct = (change / old_count) * 100
    print(f"\n📈 Changes from previous version:")
    print(f"  Previous stock count: {old_count}")
    print(f"  Current stock count: {merged_df.shape[0]}")
    print(f"  Net change: {change:+d} stocks ({change_pct:+.1f}%)")

print(f"\n📁 Files processed: {len(screener_files)}")

if 'Sector' in merged_df.columns:
    print(f"\n🏢 Sector distribution:")
    sector_counts = merged_df['Sector'].value_counts()
    for sector, count in sector_counts.head(10).items():
        print(f"  {sector}: {count} stocks")
    if len(sector_counts) > 10:
        print(f"  ... and {len(sector_counts) - 10} more sectors")

# ============================================================================
# DATA QUALITY CHECKS
# ============================================================================

print(f"\n" + "="*80)
print(f"DATA QUALITY CHECKS")
print(f"="*80)

# Check for missing data in key columns
key_columns = [
    'Symbol', 'Description', 'Price', 'Market capitalization',
    'Dividend yield %, Trailing 12 months', 'Price to earnings ratio'
]

print(f"\nMissing data in key columns:")
has_issues = False
for col in key_columns:
    if col in merged_df.columns:
        missing = merged_df[col].isna().sum()
        missing_pct = (missing / len(merged_df)) * 100
        if missing_pct > 5:
            print(f"  ⚠ {col}: {missing} missing ({missing_pct:.1f}%)")
            has_issues = True
        elif missing > 0:
            print(f"  ℹ {col}: {missing} missing ({missing_pct:.1f}%)")
        else:
            print(f"  ✓ {col}: No missing values")

if not has_issues:
    print(f"\n✓ Data quality looks good!")

# ============================================================================
# NEXT STEPS
# ============================================================================

print(f"\n" + "="*80)
print(f"NEXT STEPS")
print(f"="*80)

print(f"\n1. ✓ TSX_Merged_Data.csv has been updated")

if CREATE_BACKUP:
    print(f"2. ✓ Backup saved to: backups/TSX_Merged_Data_backup_{timestamp}.csv")

print(f"\n3. 📋 To use the new data:")
print(f"   - Re-run your analysis scripts (screen_stocks.py, quick_stats.py)")
print(f"   - Any existing filtered_stocks.csv files will use old data")
print(f"   - Re-screen with new criteria to get latest results")

print(f"\n4. 🗑️  Clean up:")
print(f"   - You can delete the old screener files from /uploads if desired")
print(f"   - Backups are kept in /backups folder")

print(f"\n" + "="*80)
print(f"UPDATE COMPLETE!")
print(f"="*80)
