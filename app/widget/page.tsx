import { Metadata } from 'next';
import CopyButton from './CopyButton';

export const metadata: Metadata = {
  title: 'Free Mortgage Rate Widget | Embed Canadian Rates on Your Site',
  description: 'Add a free mortgage rate widget to your website. Display live Canadian mortgage rates from 34+ lenders. Get a free backlink and help your visitors compare rates.',
  keywords: 'mortgage rate widget, embed mortgage rates, Canadian mortgage rates widget, free mortgage widget',
};

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">🇨🇦 Free Mortgage Rate Widget</h1>
          <p className="text-lg opacity-90">Display live Canadian mortgage rates on your website. Get a free backlink.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Customization */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">⚡ Customize Your Widget</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                <select 
                  id="theme-select"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  defaultValue="light"
                >
                  <option value="light">Light (white background)</option>
                  <option value="dark">Dark (dark background)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Number of rates</label>
                <select 
                  id="limit-select"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  defaultValue="3"
                >
                  <option value="3">3 rates</option>
                  <option value="5">5 rates</option>
                  <option value="10">10 rates</option>
                </select>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Preview</p>
              <div className="border rounded-lg overflow-hidden">
                <iframe 
                  src="/widget/index.html" 
                  className="w-full h-64"
                  title="Widget Preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">📋 Embed Code</h2>
          <p className="text-slate-600 mb-4">Copy and paste this into your website HTML:</p>
          <div className="relative">
            <pre className="bg-slate-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code id="embed-code">&lt;script src=&quot;https://latestmortgagerates.ca/widget/widget.js&quot; data-theme=&quot;light&quot; data-limit=&quot;3&quot;&gt;&lt;/script&gt;</code>
            </pre>
            <CopyButton />
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">✨ Why Add This Widget?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '🎯 Help Your Visitors', desc: 'Give readers instant access to Canada\'s best mortgage rates without leaving your site.' },
              { title: '🔗 Free Backlink', desc: 'Every widget includes a "via LatestMortgageRates.ca" link — improving your SEO.' },
              { title: '📱 Fully Responsive', desc: 'Works perfectly on desktop, tablet, and mobile. No extra work needed.' },
              { title: '⚡ Auto-Updates', desc: 'Rates update automatically. No maintenance required on your end.' },
            ].map((benefit) => (
              <div key={benefit.title} className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Perfect For */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">📍 Perfect For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Mortgage Brokers', desc: 'Show competitive rates alongside your offerings', color: 'bg-teal-50' },
              { name: 'Real Estate Agents', desc: 'Help buyers understand financing costs', color: 'bg-emerald-50' },
              { name: 'Financial Blogs', desc: 'Add value to your mortgage articles', color: 'bg-yellow-50' },
              { name: 'Advisor Websites', desc: 'Educate clients on current market rates', color: 'bg-pink-50' },
            ].map((item) => (
              <div key={item.name} className={`${item.color} rounded-lg p-4 text-center`}>
                <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 md:p-8 text-white">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">34+</div>
              <div className="text-blue-100">Lenders Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold">200+</div>
              <div className="text-blue-100">Rates Updated Daily</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Free</div>
              <div className="text-blue-100">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
