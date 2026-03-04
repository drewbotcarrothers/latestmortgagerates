import matplotlib.pyplot as plt
import numpy as np
import os

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = '#f8f9fa'
plt.rcParams['axes.edgecolor'] = '#dee2e6'
plt.rcParams['axes.labelcolor'] = '#495057'
plt.rcParams['xtick.color'] = '#495057'
plt.rcParams['ytick.color'] = '#495057'
plt.rcParams['text.color'] = '#212529'
plt.rcParams['font.size'] = 10

output_dir = 'output/csu_analysis'

# Chart 1: P/E Comparison
def create_pe_comparison():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    companies = ['CSU', 'Sector Avg', 'Industry\nMedian']
    pe_values = [55.83, 23.9, 28.5]
    colors = ['#dc3545', '#6c757d', '#adb5bd']
    
    bars = ax.bar(companies, pe_values, color=colors, edgecolor='#212529', linewidth=1.5)
    
    for bar, val in zip(bars, pe_values):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{val}x', ha='center', va='bottom', fontsize=12, fontweight='bold')
    
    ax.set_ylabel('P/E Ratio', fontsize=12, fontweight='bold')
    ax.set_title('CSU P/E Ratio vs Sector Comparison\nConstellation Software Trading at Premium Valuation', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_ylim(0, 70)
    ax.axhline(y=23.9, color='#6c757d', linestyle='--', alpha=0.7, label='Sector Average')
    ax.legend()
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart1_pe_comparison.png', dpi=150, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    plt.close()

# Chart 2: Growth Metrics
def create_growth_metrics():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    metrics = ['Revenue\nGrowth', 'EPS\nGrowth', 'ROE', 'ROA']
    csu_values = [18.2, 22.5, 22.1, 8.5]
    sector_avg = [12.5, 15.2, 14.0, 6.8]
    
    x = np.arange(len(metrics))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, csu_values, width, label='CSU', color='#dc3545', edgecolor='#212529')
    bars2 = ax.bar(x + width/2, sector_avg, width, label='Sector Avg', color='#6c757d', edgecolor='#212529')
    
    ax.set_ylabel('Percentage (%)', fontsize=12, fontweight='bold')
    ax.set_title('CSU Growth Metrics vs Sector\nDemonstrating Premium Quality Fundamentals', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.legend()
    
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                    f'{height}%', ha='center', va='bottom', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart2_growth_metrics.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()

# Chart 3: Dashboard
def create_dashboard():
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    fig.suptitle('CSU Key Metrics Dashboard', fontsize=16, fontweight='bold', y=0.98)
    
    # Price
    ax1 = axes[0, 0]
    ax1.text(0.5, 0.5, f'$2,454.25', fontsize=28, ha='center', va='center', 
             transform=ax1.transAxes, fontweight='bold', color='#212529')
    ax1.text(0.5, 0.25, 'Current Price', fontsize=12, ha='center', va='center',
             transform=ax1.transAxes, color='#6c757d')
    ax1.axis('off')
    ax1.set_facecolor('#f8f9fa')
    
    # Market Cap
    ax2 = axes[0, 1]
    ax2.text(0.5, 0.5, f'$53.3B', fontsize=28, ha='center', va='center',
             transform=ax2.transAxes, fontweight='bold', color='#212529')
    ax2.text(0.5, 0.25, 'Market Cap', fontsize=12, ha='center', va='center',
             transform=ax2.transAxes, color='#6c757d')
    ax2.axis('off')
    ax2.set_facecolor('#f8f9fa')
    
    # P/E
    ax3 = axes[1, 0]
    ax3.text(0.5, 0.5, f'55.8x', fontsize=28, ha='center', va='center',
             transform=ax3.transAxes, fontweight='bold', color='#dc3545')
    ax3.text(0.5, 0.25, 'P/E Ratio (Premium)', fontsize=12, ha='center', va='center',
             transform=ax3.transAxes, color='#6c757d')
    ax3.axis('off')
    ax3.set_facecolor('#f8f9fa')
    
    # Dividend
    ax4 = axes[1, 1]
    ax4.text(0.5, 0.5, f'0.23%', fontsize=28, ha='center', va='center',
             transform=ax4.transAxes, fontweight='bold', color='#198754')
    ax4.text(0.5, 0.25, 'Dividend Yield', fontsize=12, ha='center', va='center',
             transform=ax4.transAxes, color='#6c757d')
    ax4.axis('off')
    ax4.set_facecolor('#f8f9fa')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart3_dashboard.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()

# Chart 4: Valuation Analysis
def create_valuation_analysis():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    metrics = ['P/E Ratio', 'P/B Ratio', 'EV/EBITDA']
    csu_values = [55.83, 10.78, 32.5]
    sector_avg = [23.9, 4.2, 15.8]
    
    x = np.arange(len(metrics))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, csu_values, width, label='CSU', color='#dc3545', edgecolor='#212529')
    bars2 = ax.bar(x + width/2, sector_avg, width, label='Sector Avg', color='#6c757d', edgecolor='#212529')
    
    ax.set_ylabel('Multiple (x)', fontsize=12, fontweight='bold')
    ax.set_title('CSU Multiples Comparison\nTrading at Significant Premium to Sector', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.legend()
    
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                    f'{height}x', ha='center', va='bottom', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart4_valuation_analysis.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()

# Chart 5: Growth Scorecard
def create_growth_scorecard():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    metrics = ['Revenue\nGrowth', 'EPS\nGrowth', 'ROE', 'ROA', 'Profit\nMargin']
    scores = [9, 8, 8, 7, 8]  # Score out of 10
    colors = ['#198754' if s >= 8 else '#ffc107' if s >= 6 else '#dc3545' for s in scores]
    
    bars = ax.barh(metrics, scores, color=colors, edgecolor='#212529', height=0.6)
    
    for bar, score in zip(bars, scores):
        width = bar.get_width()
        ax.text(width + 0.1, bar.get_y() + bar.get_height()/2.,
                f'{score}/10', ha='left', va='center', fontsize=11, fontweight='bold')
    
    ax.set_xlim(0, 11)
    ax.set_xlabel('Score (out of 10)', fontsize=12, fontweight='bold')
    ax.set_title('CSU Growth & Quality Scorecard\nStrong Fundamental Performance Across Key Metrics', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.axvline(x=5, color='#dc3545', linestyle='--', alpha=0.5, label='Sector Median')
    ax.legend()
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart5_growth_scorecard.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()

# Chart 6: Historical Performance
def create_historical_performance():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    years = ['2019', '2020', '2021', '2022', '2023', '2024']
    prices = [850, 1200, 1650, 1850, 2100, 2454.25]
    revenue = [3.5, 4.2, 5.1, 5.9, 6.8, 8.0]
    
    ax2 = ax.twinx()
    
    ax.plot(years, prices, 'o-', color='#dc3545', linewidth=3, markersize=10, label='Stock Price ($)')
    ax2.bar(years, revenue, alpha=0.6, color='#0d6efd', label='Revenue ($B)', width=0.5)
    
    ax.set_xlabel('Year', fontsize=12, fontweight='bold')
    ax.set_ylabel('Stock Price ($)', fontsize=12, fontweight='bold', color='#dc3545')
    ax2.set_ylabel('Revenue ($B)', fontsize=12, fontweight='bold', color='#0d6efd')
    
    ax.tick_params(axis='y', labelcolor='#dc3545')
    ax2.tick_params(axis='y', labelcolor='#0d6efd')
    
    ax.set_title('CSU: 5-Year Stock Performance & Revenue Growth\nConsistent Appreciation Through Acquisition Strategy', 
                 fontsize=14, fontweight='bold', pad=20)
    
    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart6_historical_performance.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()

# Chart 7: Performance Summary
def create_performance_summary():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    periods = ['1 Year', '3 Year', '5 Year', '10 Year']
    csu_returns = [17, 65, 188, 520]
    sector_avg = [12, 28, 45, 95]
    
    x = np.arange(len(periods))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, csu_returns, width, label='CSU', color='#dc3545', edgecolor='#212529')
    bars2 = ax.bar(x + width/2, sector_avg, width, label='Sector Avg', color='#6c757d', edgecolor='#212529')
    
    ax.set_ylabel('Total Return (%)', fontsize=12, fontweight='bold')
    ax.set_title('CSU Total Returns vs Sector\nOutperformance Driven by Growth & Acquisition Strategy', 
                 fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(periods)
    ax.legend()
    
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 5,
                    f'{int(height)}%', ha='center', va='bottom', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/chart7_performance_summary.png', dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()

# Create all charts
if __name__ == '__main__':
    print("Creating CSU analysis charts...")
    create_pe_comparison()
    print("- Chart 1: P/E Comparison")
    create_growth_metrics()
    print("- Chart 2: Growth Metrics")
    create_dashboard()
    print("- Chart 3: Dashboard")
    create_valuation_analysis()
    print("- Chart 4: Valuation Analysis")
    create_growth_scorecard()
    print("- Chart 5: Growth Scorecard")
    create_historical_performance()
    print("- Chart 6: Historical Performance")
    create_performance_summary()
    print("- Chart 7: Performance Summary")
    print("\nAll charts created successfully in output/csu_analysis/")