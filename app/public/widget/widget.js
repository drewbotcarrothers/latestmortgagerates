/**
 * Latest Mortgage Rates Widget
 * Embeddable script for Canadian mortgage rate comparison
 * 
 * Usage: <script src="https://latestmortgagerates.ca/widget/widget.js"></script>
 * Or with options: <script src="https://latestmortgagerates.ca/widget/widget.js" data-theme="dark" data-limit="5"></script>
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    apiUrl: 'https://latestmortgagerates.ca/api/rates',
    fallbackRates: [
      { lender: 'nesto', rate: 3.64, type: '5Y Fixed', url: 'https://latestmortgagerates.ca' },
      { lender: 'Butler Mortgage', rate: 3.64, type: '5Y Fixed', url: 'https://latestmortgagerates.ca' },
      { lender: 'Equitable Bank', rate: 3.89, type: '5Y Fixed', url: 'https://latestmortgagerates.ca' }
    ],
    theme: document.currentScript?.getAttribute('data-theme') || 'light',
    limit: parseInt(document.currentScript?.getAttribute('data-limit') || '3'),
    showLogo: document.currentScript?.getAttribute('data-show-logo') !== 'false'
  };

  // Widget container ID
  const containerId = 'lmr-widget-' + Math.random().toString(36).substr(2, 9);

  // Styles
  const styles = {
    light: `
      .lmr-widget { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 320px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background: #fff; border: 1px solid #e5e7eb; }
      .lmr-header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 12px 16px; font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: space-between; }
      .lmr-header a { color: white; text-decoration: none; }
      .lmr-rate-item { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
      .lmr-rate-item:last-child { border-bottom: none; }
      .lmr-lender { font-size: 13px; color: #374151; font-weight: 500; }
      .lmr-rate { font-size: 18px; font-weight: 700; color: #059669; }
      .lmr-type { font-size: 11px; color: #6b7280; }
      .lmr-footer { padding: 10px 16px; background: #f9fafb; text-align: center; font-size: 11px; }
      .lmr-footer a { color: #3b82f6; text-decoration: none; font-weight: 500; }
      .lmr-footer a:hover { text-decoration: underline; }
      .lmr-loading { padding: 20px; text-align: center; color: #6b7280; font-size: 13px; }
      .lmr-error { padding: 16px; text-align: center; color: #dc2626; font-size: 12px; }
    `,
    dark: `
      .lmr-widget { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 320px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.3); background: #1f2937; border: 1px solid #374151; }
      .lmr-header { background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); color: white; padding: 12px 16px; font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: space-between; }
      .lmr-header a { color: white; text-decoration: none; }
      .lmr-rate-item { padding: 12px 16px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center; }
      .lmr-rate-item:last-child { border-bottom: none; }
      .lmr-lender { font-size: 13px; color: #d1d5db; font-weight: 500; }
      .lmr-rate { font-size: 18px; font-weight: 700; color: #34d399; }
      .lmr-type { font-size: 11px; color: #9ca3af; }
      .lmr-footer { padding: 10px 16px; background: #111827; text-align: center; font-size: 11px; }
      .lmr-footer a { color: #60a5fa; text-decoration: none; font-weight: 500; }
      .lmr-footer a:hover { text-decoration: underline; }
      .lmr-loading { padding: 20px; text-align: center; color: #9ca3af; font-size: 13px; }
      .lmr-error { padding: 16px; text-align: center; color: #f87171; font-size: 12px; }
    `
  };

  // Create container
  const container = document.createElement('div');
  container.id = containerId;
  container.innerHTML = '<div class="lmr-loading">Loading rates...</div>';

  // Insert after script tag or at end of body
  const script = document.currentScript;
  if (script && script.parentNode) {
    script.parentNode.insertBefore(container, script.nextSibling);
  } else {
    document.body.appendChild(container);
  }

  // Add styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles[config.theme] || styles.light;
  document.head.appendChild(styleEl);

  // Fetch rates
  async function fetchRates() {
    try {
      // Try to fetch from API
      const response = await fetch(config.apiUrl + '?limit=' + config.limit);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      return data.rates || config.fallbackRates;
    } catch (error) {
      // Fallback to hardcoded rates
      console.log('LMR Widget: Using fallback rates');
      return config.fallbackRates.slice(0, config.limit);
    }
  }

  // Render widget
  function renderWidget(rates) {
    const logoHtml = config.showLogo ? 
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' : '';

    let ratesHtml = rates.map(rate => `
      <div class="lmr-rate-item">
        <div>
          <div class="lmr-lender">${rate.lender}</div>
          <div class="lmr-type">${rate.type}</div>
        </div>
        <div class="lmr-rate">${rate.rate}%</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="lmr-widget">
        <div class="lmr-header">
          <span>🇨🇦 Best Mortgage Rates</span>
          ${logoHtml}
        </div>
        ${ratesHtml}
        <div class="lmr-footer">
          <a href="https://latestmortgagerates.ca" target="_blank" rel="noopener">Compare all rates →</a>
          <br><span style="color: #9ca3af; font-size: 10px;">via LatestMortgageRates.ca</span>
        </div>
      </div>
    `;
  }

  // Initialize
  fetchRates().then(renderWidget).catch(error => {
    container.innerHTML = `
      <div class="lmr-widget">
        <div class="lmr-error">
          Unable to load rates.<br>
          <a href="https://latestmortgagerates.ca" target="_blank">View on site →</a>
        </div>
      </div>
    `;
  });
})();
