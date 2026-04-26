import type { Metadata } from "next";
import Link from "next/link";
import SocialShare from "../../components/SocialShare";
import CityLendersSidebar from "../../components/CityLendersSidebar";

export const dynamic="force-static";

const oshawaFaqs=[
{question:"What are current mortgage rates in Oshawa?",answer:"Current Oshawa mortgage rates are competitive with 5-year fixed rates from 4.19% and variable from 3.85%. Oshawa offers excellent value with average home prices around $720,000 - part of the Durham Region with GO Train access to Toronto."},
{question:"Is Oshawa part of the GTA?",answer:"Yes! Oshawa is part of the Greater Toronto Area (GTA) and Durham Region. It's 60km east of Toronto with regular GO Train service. Many residents commute to Toronto while enjoying $500K savings vs Toronto prices."},
{question:"Why is Oshawa popular with first-time buyers?",answer:"GTA location with non-GTA prices! $720K vs $1.2M Toronto average. GO Train access. GM history brought skilled workers. UOIT (Ontario Tech University) brings students. Strong rental demand."},
{question:"What is driving Oshawa's growth?",answer:"Toronto commuters seeking affordability. GM's consolidation created industrial space for new businesses. Ontario Tech University adds students and research jobs. Highway 407 extension. Growing film industry."}
];

export const metadata: Metadata={
title:"Best Mortgage Rates Oshawa 2025 | Durham Region Value",
description:"Find the lowest mortgage rates in Oshawa for 2025. GTA location with affordable prices. Average home price $720K. GO Train to Toronto. 5-year fixed from 4.19%.",
keywords:"Oshawa mortgage rates, Durham Region mortgage, Oshawa mortgage broker, best rates Oshawa, GTA mortgage",
alternates:{canonical:"https://latestmortgagerates.ca/cities/oshawa"},
openGraph:{title:"Best Mortgage Rates Oshawa 2025 | GTA Value",description:"GTA prices without GTA costs! Average $720K. GO Train access. 5-year fixed from 4.19%.",url:"https://latestmortgagerates.ca/cities/oshawa",type:"website",locale:"en_CA"},
twitter:{card:"summary_large_image",title:"Best Mortgage Rates Oshawa 2025",description:"GTA location, non-GTA prices! $720K average. 5-year fixed from 4.19%."}
};

export default function OshawaPage(){
return(
<main className="min-h-screen bg-gray-100">
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"LocalBusiness",name:"Latest Mortgage Rates Canada - Oshawa",description:"Best mortgage rates in Oshawa",areaServed:{"@type":"City",name:"Oshawa",containedIn:"Ontario"},url:"https://latestmortgagerates.ca/cities/oshawa"})}} />
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:oshawaFaqs.map(faq=>({"@type":"Question",name:faq.question,acceptedAnswer:{"@type":"Answer",text:faq.answer}}))})}} />

<header className="bg-white shadow-sm">
<div className="max-w-7xl mx-auto px-4 py-6">
<nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
<ol className="flex items-center space-x-2">
<li><Link href="/" className="hover:text-blue-600">Home</Link></li>
<li><span className="text-gray-400">/</span></li>
<li className="text-gray-900 font-medium">Oshawa</li>
</ol>
</nav>
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
<div>
<div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3"><span>🚆 GTA Location, Durham Prices</span></div>
<h1 className="text-3xl md:text-4xl font-bold text-gray-900">Best Mortgage Rates in Oshawa 2025</h1>
<p className="text-gray-600 mt-2 text-lg">GTA with $500K savings! GO Train commuter hub. Find your rate.</p>
</div>
</div>
</div>
</header>

<div className="max-w-7xl mx-auto px-4 py-8">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2 space-y-6">
<section className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-4">Current Oshawa Mortgage Rates</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Fixed</p><p className="text-3xl font-bold text-blue-600">4.19%</p><p className="text-sm text-gray-500">Best available rate</p></div>
<div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-gray-600">5-Year Variable</p><p className="text-3xl font-bold text-green-600">3.85%</p><p className="text-sm text-gray-500">Prime -0.60%</p></div>
</div>
<div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-700"><strong>GTA Value:</strong> ~$720K average. Save $480K vs Toronto with GO Train access!</p></div>
</section>

<section className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-4">First-Time Buyer Programs</h2>
<div className="space-y-4">
<div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">Ontario LTT Rebate</h3><p className="text-gray-700">Up to $4,000 rebate.</p></div>
<div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Durham First-Time Buyer Incentives</h3><p className="text-gray-700">Regional programs support GTA-area first-time buyers.</p></div>
</div>
</section>

<section className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-2xl font-bold text-gray-900 mb-4">Oshawa Market Factors</h2>
<div className="space-y-4">
<div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-gray-900">Lakeshore GO Train</h3><p className="text-gray-700">Regular service to Toronto Union Station. Oshawa GO is eastern terminus.</p></div>
<div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-gray-900">Ontario Tech University</h3><p className="text-gray-700">UOIT brings 10,000+ students. New research programs attract talent.</p></div>
<div className="border-l-4 border-purple-500 pl-4"><h3 className="font-semibold text-gray-900">GM Heritage</h3><p className="text-gray-700">Skilled trades workforce from auto industry history supports new manufacturing.</p></div>
</div>
</section>
</div>

<aside className="lg:col-span-1">
<div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
<h3 className="font-bold text-gray-900 mb-4">Why Oshawa?</h3>
<ul className="space-y-3 text-sm">
<li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">Official GTA member</span></li>
<li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">$480K savings vs Toronto</span></li>
<li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">GO Train commuter access</span></li>
<li className="flex items-start gap-2"><span className="text-green-500">✓</span><span className="text-gray-700">UOIT university town</span></li>
</ul>
</div>

<div className="bg-white rounded-lg shadow-md p-6 mt-6">
<h3 className="font-bold text-gray-900 mb-4">Compare Cities</h3>
<ul className="space-y-2 text-sm">
<li><Link href="/cities/toronto" className="text-blue-600 hover:underline">Toronto Rates</Link></li>
<li><Link href="/cities/barrie" className="text-blue-600 hover:underline">Barrie Rates</Link></li>
<li><Link href="/cities/hamilton" className="text-blue-600 hover:underline">Hamilton Rates</Link></li>
</ul>
</div>

<div className="bg-blue-50 rounded-lg p-6 mt-6"><h3 className="font-bold text-gray-900 mb-2">Compare Oshawa Rates</h3><p className="text-gray-600 text-sm mb-4">See rates from Durham Region lenders.</p><Link href="/" className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">View Rates</Link></div>

<div className="bg-white rounded-lg shadow-md p-6 mt-6"><h3 className="font-bold text-gray-900 mb-2">Share Oshawa Rates</h3><SocialShare url="https://latestmortgagerates.ca/cities/oshawa" title="Best Mortgage Rates Oshawa 2025" description="GTA location with non-GTA prices! $720K average with GO Train access. 5-year fixed from 4.19%." /></div>
<CityLendersSidebar cityName="Oshawa" />
</aside>
</div>
</div>
</main>
);
}
