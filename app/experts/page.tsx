import { Metadata } from 'next';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StructuredData from '../components/StructuredData';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Canadian Mortgage Experts to Follow | Latest Mortgage Rates',
  description: 'Follow Canada\'s top mortgage brokers, economists, and housing market experts on X (Twitter). Get insights from Ron Butler, Hanif Bayat, Daniel Foch, and more leading voices.',
  keywords: [
    'Canadian mortgage experts',
    'mortgage brokers Canada',
    'housing market analysts',
    'Ron Butler',
    'Hanif Bayat',
    'Daniel Foch',
    'mortgage Twitter',
    'Canadian real estate experts',
    'mortgage advice Canada',
    'housing market news Canada'
  ],
  openGraph: {
    title: 'Canadian Mortgage Experts to Follow on Social Media',
    description: 'The top mortgage brokers, economists, and housing analysts sharing insights on the Canadian market.',
    type: 'website',
    locale: 'en_CA',
    siteName: 'Latest Mortgage Rates',
  },
};

interface Expert {
  name: string;
  handle: string;
  url: string;
  role: string;
  company?: string;
  bio: string;
  whyFollow: string[];
  expertise: string[];
}

const experts: Expert[] = [
  {
    name: 'Ron Butler',
    handle: '@ronmortgageguy',
    url: 'https://x.com/ronmortgageguy',
    role: 'Mortgage Broker',
    company: 'Butler Mortgage',
    bio: 'One of Canada\'s most recognized mortgage voices with decades of industry experience. Ron provides straightforward advice on mortgage qualification, rate trends, and navigating challenging lending environments.',
    whyFollow: [
      'Daily market commentary on rate changes and lender policies',
      'Honest takes on mortgage qualification challenges',
      'Insights on private lending and alternative options',
      'Helps consumers understand lender risk assessment'
    ],
    expertise: ['Alternative Lending', 'Private Mortgages', 'Complex Deals', 'Market Analysis']
  },
  {
    name: 'Hanif Bayat',
    handle: '@HanifBayat',
    url: 'https://x.com/HanifBayat',
    role: 'Real Estate Researcher & Analyst',
    bio: 'Data-driven analyst providing deep insights into Canadian housing market fundamentals through charts, graphs, and statistical analysis. Known for objective, numbers-based commentary on market trends.',
    whyFollow: [
      'Excellent data visualizations on housing trends',
      'Research-backed analysis of market fundamentals',
      'Demographic and economic data interpretation',
      'Unbiased market assessments'
    ],
    expertise: ['Data Analysis', 'Market Research', 'Housing Economics', 'Demographics']
  },
  {
    name: 'Daniel Foch',
    handle: '@danielfoch',
    url: 'https://x.com/danielfoch',
    role: 'Real Estate Economist',
    company: 'Royal LePage',
    bio: 'Professional real estate economist providing macro-level analysis of Canadian housing markets. Offers expert commentary on interest rates, government policy, and regional market dynamics.',
    whyFollow: [
      'Economic perspectives on interest rate decisions',
      'Regional market analysis across Canada',
      'Policy impacts on housing affordability',
      'Professional economist insights'
    ],
    expertise: ['Economic Forecasting', 'Interest Rate Policy', 'Regional Markets', 'Housing Policy']
  },
];

const additionalExperts = [
  {
    category: 'Economists & Analysts',
    names: ['Robert Hogue (RBC)', 'Carolyn Cooper (TD)', 'Sal Guatieri (BMO)']
  },
  {
    category: 'Mortgage Brokers',
    names: ['Dave Larock', 'Kim Gibbons', 'Dalia Barsoum']
  },
  {
    category: 'Real Estate Platforms',
    names: ['Housesigma', 'Zealty', 'Wowa.ca']
  }
];

export default function ExpertsPage() {
  // Generate structured data for each expert
  const structuredData = experts.map(expert => ({
    '@type': 'Person',
    'name': expert.name,
    'jobTitle': expert.role,
    'description': expert.bio,
    'url': expert.url,
    'knowsAbout': expert.expertise,
    ...(expert.company ? {
      'worksFor': {
        '@type': 'Organization',
        'name': expert.company
      }
    } : {})
  }));

  return (
    <>
      <StructuredData data={structuredData} />
      
      <div className="min-h-screen bg-slate-50">
        <Navigation currentPage="experts" />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Canadian Mortgage Experts to Follow
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Stay informed with insights from Canada&apos;s top mortgage brokers, 
                economists, and housing market analysts on X (Twitter).
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Curated Social Media Accounts
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Verified Experts
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Experts */}
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Featured Experts</h2>
            <p className="text-slate-600">Leading voices in Canadian mortgages and real estate</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <div 
                key={expert.handle}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-cyan-600 to-slate-700 px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                    {expert.role}
                  </span>
                </div>

                <div className="p-6">
                  {/* Name and handle */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{expert.name}</h3>
                    <a 
                      href={expert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      {expert.handle}
                    </a>
                  </div>

                  {/* Company (if applicable) */}
                  {expert.company && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      {expert.company}
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {expert.bio}
                  </p>

                  {/* Why follow */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Why Follow:</h4>
                    <ul className="space-y-2">
                      {expert.whyFollow.slice(0, 3).map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {expert.expertise.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Follow button */}
                  <a
                    href={expert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Follow on X
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Follow Section */}
        <section className="bg-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Why Follow These Experts?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Stay Ahead of Rate Changes</h3>
                <p className="text-slate-600 text-sm">
                  These experts often post rate updates before they&apos;re widely reported. 
                  Get early warning on rate drops or increases that could save you thousands.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Understand the &quot;Why&quot;</h3>
                <p className="text-slate-600 text-sm">
                  Beyond just numbers, these experts explain market dynamics, policy changes, 
                  and economic factors affecting mortgage rates and housing affordability.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Join the Conversation</h3>
                <p className="text-slate-600 text-sm">
                  Engage with experts and other followers. Ask questions, share experiences, 
                  and learn from a community of mortgage-savvy Canadians.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Other Accounts Worth Following</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalExperts.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.names.map((name, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-cyan-600 to-slate-700 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Get Rate Updates Directly</h2>
            <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
              While social media is great for insights, our rate tracker gives you 
              real-time data from 34+ Canadian lenders. Compare rates anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 rounded-xl font-semibold hover:bg-cyan-50 transition-colors"
              >
                View Today&apos;s Rates
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="/trends"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-800/50 text-white border border-cyan-400 rounded-xl font-semibold hover:bg-cyan-800 transition-colors"
              >
                See Rate Trends
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
