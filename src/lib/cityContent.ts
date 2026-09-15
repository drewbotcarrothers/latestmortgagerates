import {
  CITIES,
  PROVINCE_NAMES,
  cityPath,
  requireCity,
  type CityRecord,
  type ProvinceId,
} from "./cities.ts";

export interface CityFaq {
  question: string;
  answer: string;
}

export interface CityLink {
  href: string;
  label: string;
}

export interface BuyerPoint {
  heading: string;
  body: string;
}

export interface LocalLender {
  href: string;
  label: string;
  note: string;
}

export interface CitySeo {
  title: string;
  description: string;
  canonical: string;
  keywords: string;
  h1: string;
}

export interface ResolvedCityContent {
  slug: string;
  name: string;
  province: ProvinceId;
  provinceName: string;
  region?: string;
  featured: boolean;
  seo: CitySeo;
  heroTagline: string;
  intro: string;
  lttHeadline: string;
  lttBody: string;
  lttHasProvincialTax: boolean;
  lttToolHref: string;
  lttToolLabel: string;
  firstTimeBuyer: { intro: string; points: BuyerPoint[] };
  renewal: { intro: string; points: BuyerPoint[] };
  marketNotes: string[];
  faqs: CityFaq[];
  relatedLinks: CityLink[];
  localLenders: LocalLender[];
  nearby: { slug: string; name: string }[];
}

interface ProvinceLayer {
  seoTitleSuffix: string;
  heroTagline: string;
  lttHeadline: string;
  lttBody: string;
  lttHasProvincialTax: boolean;
  lttToolHref: string;
  lttToolLabel: string;
  firstTimeIntro: string;
  firstTimePoints: BuyerPoint[];
  renewalIntro: string;
  renewalPoints: BuyerPoint[];
  marketNotes: string[];
  faqs: CityFaq[];
  localLenders: LocalLender[];
}

interface CityOverride {
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  heroTagline?: string;
  intro: string;
  lttHeadline?: string;
  lttBody?: string;
  firstTimeIntro?: string;
  firstTimePoints?: BuyerPoint[];
  renewalIntro?: string;
  renewalPoints?: BuyerPoint[];
  marketNotes?: string[];
  faqs?: CityFaq[];
  extraLinks?: CityLink[];
  localLenders?: LocalLender[];
}

const SITE = "https://latestmortgagerates.ca";
const LTT_HREF = "/tools/land-transfer-tax-calculator/";
const CLOSING_HREF = "/tools/closing-costs-calculator/";

const FEDERAL_FTB: BuyerPoint[] = [
  {
    heading: "FHSA",
    body: "The First Home Savings Account lets eligible first-time buyers contribute up to $8,000 a year (lifetime $40,000). Contributions are tax-deductible and qualifying withdrawals for a first home are tax-free.",
  },
  {
    heading: "Home Buyers’ Plan",
    body: "The RRSP Home Buyers’ Plan lets eligible first-time buyers withdraw up to $60,000 per person (couples can combine) to buy or build a home, then repay it over 15 years.",
  },
  {
    heading: "Stress test",
    body: "Federally regulated lenders must qualify you at the greater of your contract rate plus 2% or the Bank of Canada’s qualifying rate. Run the numbers before you shop listings.",
  },
];

const RENEWAL_DEFAULT: BuyerPoint[] = [
  {
    heading: "Shop before the lender’s offer",
    body: "Your current lender’s renewal letter is a starting point, not a ceiling. Compare it with today’s posted 5-year fixed and variable rates on this site, then ask them to match.",
  },
  {
    heading: "Know the break cost",
    body: "If you refinance or switch before maturity, the penalty can wipe out the rate savings. Estimate it with the penalty calculator before you sign a new term.",
  },
];

function fill(template: string, city: CityRecord): string {
  return template
    .replaceAll("{city}", city.name)
    .replaceAll("{province}", PROVINCE_NAMES[city.province])
    .replaceAll("{region}", city.region || city.name);
}

const ONTARIO_LENDERS: LocalLender[] = [
  { href: "/lenders/meridian/", label: "Meridian Credit Union", note: "Ontario credit union with a large mortgage book." },
  { href: "/lenders/alterna/", label: "Alterna", note: "Ontario-focused alternative and credit-union lending." },
];

const BC_LENDERS: LocalLender[] = [
  { href: "/lenders/vancity/", label: "Vancity", note: "Metro Vancouver credit union; compare Mixer and other products on the Vancity page." },
  { href: "/lenders/coastcapital/", label: "Coast Capital", note: "B.C. credit union often shopped alongside the big banks." },
];

const AB_LENDERS: LocalLender[] = [
  { href: "/lenders/atb/", label: "ATB Financial", note: "Alberta-only Crown corporation; compare live ATB rates with national monolines." },
];

const QC_LENDERS: LocalLender[] = [
  { href: "/lenders/desjardins/", label: "Desjardins", note: "Quebec’s largest credit-union movement; closings typically run through a notary." },
  { href: "/lenders/nationalbank/", label: "National Bank", note: "Montreal-based bank with a strong Quebec footprint." },
  { href: "/lenders/laurentian/", label: "Laurentian Bank", note: "Quebec-based bank often compared with National Bank and Desjardins." },
];

const PROVINCES: Record<ProvinceId, ProvinceLayer> = {
  ON: {
    seoTitleSuffix: "Ontario LTT & Closing Costs",
    heroTagline: "National mortgage rates plus Ontario land transfer tax notes for {city}.",
    lttHeadline: "Ontario land transfer tax",
    lttBody:
      "{city} buyers pay Ontario land transfer tax on the purchase price. Brackets (from Ontario’s Ministry of Finance) are 0.5% on the first $55,000, 1% on $55,000–$250,000, 1.5% on $250,000–$400,000, 2% on $400,000–$2 million, and 2.5% above $2 million. Eligible first-time buyers can receive a provincial refund of up to $4,000 (enough to offset tax on about the first $368,000 of value). Toronto is the main Ontario city that also charges a municipal land transfer tax; {city} does not add that extra city tax unless you are buying inside Toronto’s boundaries. Confirm figures with your lawyer and our land transfer tax calculator.",
    lttHasProvincialTax: true,
    lttToolHref: LTT_HREF,
    lttToolLabel: "Ontario land transfer tax calculator",
    firstTimeIntro:
      "First-time buyers in {city} can stack federal programs (FHSA, Home Buyers’ Plan) with Ontario’s land transfer tax refund. Outside Toronto there is no municipal LTT, so cash-to-close is usually lower than a comparable Toronto purchase.",
    firstTimePoints: [
      {
        heading: "Ontario LTT refund",
        body: "Eligible first-time purchasers can refund up to $4,000 of provincial land transfer tax. Your lawyer usually claims it at registration; otherwise you have 18 months to apply to the Ministry of Finance.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "Renewals in {city} follow the same national rate sheet as the rest of Canada. The local issue is often a larger remaining balance if you bought in the GTA or another high-price Ontario market—small rate gaps move the payment more.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "Lenders do not publish a separate {city} mortgage rate. Compare the live national table on this page, then model Ontario land transfer tax and legal fees on top.",
      "Ontario’s Non-Resident Speculation Tax can apply to foreign entities buying in specified regions, including much of the Greater Golden Horseshoe. Residents shopping in {city} should still confirm with their lawyer if a co-buyer is a non-resident.",
    ],
    faqs: [
      {
        question: "Are mortgage rates different in {city} than in the rest of Canada?",
        answer:
          "Posted rates are national. Lenders price the borrower, the property, and the product (insured vs uninsured, term, fixed vs variable)—not the city name. What changes in {city} is closing costs, land transfer tax, and how large a mortgage you need for a typical home.",
      },
      {
        question: "Do I pay land transfer tax when I buy in {city}?",
        answer:
          "Yes. Ontario charges provincial land transfer tax on almost every freehold and condo purchase. First-time buyers may get up to $4,000 back. Only the City of Toronto adds a separate municipal land transfer tax on top.",
      },
      {
        question: "Can I use the FHSA and Home Buyers’ Plan in {city}?",
        answer:
          "Yes. Both are federal programs. They apply in {city} the same way as elsewhere in Canada, subject to CRA eligibility (first-time buyer tests, occupancy, repayment rules).",
      },
      {
        question: "What extra cash should I budget besides the down payment?",
        answer:
          "Plan for Ontario land transfer tax, legal fees and disbursements, title insurance, a home inspection, and moving costs. Use the closing-costs calculator with Ontario selected; it will not include Toronto’s municipal tax unless you are actually buying in Toronto.",
      },
    ],
    localLenders: ONTARIO_LENDERS,
  },
  BC: {
    seoTitleSuffix: "BC Property Transfer Tax",
    heroTagline: "National mortgage rates and B.C. property transfer tax notes for {city}.",
    lttHeadline: "B.C. property transfer tax (PTT)",
    lttBody:
      "{city} purchases are registered in B.C., which charges property transfer tax rather than calling it land transfer tax. Standard PTT is 1% on the first $200,000 of fair market value, 2% on $200,000–$2 million, 3% on $2–$3 million, and 5% above $3 million (Province of British Columbia). Eligible first-time buyers can exempt PTT on the first $500,000 of value; since 1 April 2024 the province also ties eligibility to a higher fair-market-value ceiling (full program up to $835,000, partial to $860,000). Additional 20% PTT can apply to foreign entities in specified areas. Confirm current rules on gov.bc.ca and treat our calculator as a planning estimate.",
    lttHasProvincialTax: true,
    lttToolHref: LTT_HREF,
    lttToolLabel: "B.C. property transfer tax calculator",
    firstTimeIntro:
      "First-time buyers in {city} should check whether the home’s fair market value still qualifies for B.C.’s first-time PTT exemption. Many Metro Vancouver purchases sit above the ceiling, so the exemption may be partial or zero even if you have never owned before.",
    firstTimePoints: [
      {
        heading: "B.C. first-time PTT program",
        body: "If you qualify, PTT is exempt on the first $500,000 of value. You generally must be a Canadian citizen or permanent resident, meet B.C. residency or tax-filing tests, occupy the home, and not have owned a principal residence before. Thresholds changed on 1 April 2024—verify on the provincial site before you firm up.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "B.C. renewals use the same national rates as other provinces. Credit unions such as Vancity and Coast Capital are often part of a {city} shopping list alongside banks and monolines.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "B.C.’s Speculation and Vacancy Tax applies in specified urban areas (including Metro Vancouver and Greater Victoria). It is separate from PTT and from municipal empty-homes taxes.",
      "Foreign-buyer additional PTT (commonly 20%) applies in designated regions. It is not a resident first-time-buyer issue, but co-ownership structures should be reviewed with a notary.",
    ],
    faqs: [
      {
        question: "Are {city} mortgage rates higher because homes are expensive?",
        answer:
          "The contract rate is still a national product rate. Higher prices in {city} mean a larger principal, so the same rate difference changes the payment more. Shop the live table on this page; do not assume a “Vancouver rate” or “{city} rate” exists.",
      },
      {
        question: "What transfer tax do I pay in {city}?",
        answer:
          "B.C. property transfer tax on fair market value, plus legal/notary fees. First-time buyers may get a full or partial exemption depending on price and eligibility. Additional PTT can apply to foreign entities in specified areas.",
      },
      {
        question: "Do B.C. credit unions beat the banks in {city}?",
        answer:
          "Sometimes, sometimes not. Compare live Vancity and Coast Capital rates with the Big 6 and monolines on the same day. Membership rules apply for credit unions.",
      },
      {
        question: "Is there a first-time land transfer rebate in {city}?",
        answer:
          "B.C. uses a property transfer tax exemption, not Ontario’s dollar rebate. It is valuable when the home is within the provincial fair-market-value limits and you meet residency tests.",
      },
    ],
    localLenders: BC_LENDERS,
  },
  AB: {
    seoTitleSuffix: "No Land Transfer Tax",
    heroTagline: "National mortgage rates and Alberta’s no-LTT closing-cost profile for {city}.",
    lttHeadline: "No provincial land transfer tax",
    lttBody:
      "Alberta does not charge a provincial land transfer tax. {city} buyers still pay land-titles registration fees, legal fees, and the usual inspection and moving costs. That is why cash-to-close is often lower than an equivalent purchase in Ontario or B.C. Use the closing-costs calculator with Alberta selected for a fee-side estimate—not a fake “average {city} price.”",
    lttHasProvincialTax: false,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "Alberta closing costs calculator",
    firstTimeIntro:
      "First-time buyers in {city} do not get an LTT rebate because there is no LTT to rebate. The practical advantage is keeping more cash for the down payment, FHSA, or closing legal fees.",
    firstTimePoints: [
      {
        heading: "Budget land-titles fees, not LTT",
        body: "Registration with the Alberta Land Titles Office is a fee, not a percentage tax like Ontario or B.C. Ask your lawyer for the current tariff on your purchase and mortgage registration.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "Alberta renewals compete on the same national rate sheet. ATB Financial is Alberta-only and worth comparing with banks and monolines when you live in {city}.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "No provincial sales tax and no land transfer tax are the usual “Alberta advantage” on a purchase. Property tax and condo fees are local and separate.",
      "Energy-sector income can be variable. Lenders still apply the federal stress test to guaranteed income, not to a hoped-for bonus.",
    ],
    faqs: [
      {
        question: "Is there land transfer tax in {city}?",
        answer:
          "No provincial land transfer tax in Alberta. You still pay land-titles registration and legal fees. That is the main closing-cost difference versus Ontario or B.C.",
      },
      {
        question: "Are {city} mortgage rates lower than Toronto or Vancouver?",
        answer:
          "The posted rate is usually the same product rate nationwide. Lower typical purchase prices in many Alberta cities can mean a smaller mortgage and an easier stress test, not a special {city} discount.",
      },
      {
        question: "Should I compare ATB with the big banks?",
        answer:
          "Yes if you bank or live in Alberta. ATB is not a national Big 6 bank; check the live ATB lender page against RBC, TD, monolines, and brokers.",
      },
    ],
    localLenders: AB_LENDERS,
  },
  QC: {
    seoTitleSuffix: "Welcome Tax & Notaries",
    heroTagline: "National mortgage rates, Quebec welcome tax, and notary closings for {city}.",
    lttHeadline: "Quebec welcome tax (droits de mutation)",
    lttBody:
      "Quebec municipalities charge transfer duties—often called the welcome tax or taxe de bienvenue—when title changes hands. Base brackets are set in provincial law (roughly 0.5%, 1%, then 1.5% as value rises; thresholds are indexed). Montreal adds extra rates on higher-value homes. There is no Ontario-style first-time LTT refund. Closings run through a notary (notaire), who also registers the hypothec. Use the land transfer tax calculator as a starting point, then confirm the municipal rate with your notary.",
    lttHasProvincialTax: true,
    lttToolHref: LTT_HREF,
    lttToolLabel: "Quebec transfer duty calculator",
    firstTimeIntro:
      "Quebec first-time buyers in {city} still use the federal FHSA and Home Buyers’ Plan. Transfer duties are municipal and generally not rebated the way Ontario LTT is. Budget the welcome tax in cash on closing.",
    firstTimePoints: [
      {
        heading: "Notary, not lawyer",
        body: "A Quebec notary handles the deed, hypothec, and most of the cash-to-close statement. Factor notary fees into closing costs along with transfer duties.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "Renewing in {city} still means comparing national posted rates. Desjardins, National Bank, and Laurentian often sit beside the Big 5 on a Quebec shopping list.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "French-language documents and notary practice are normal in {city}. Some national monolines still lend in Quebec; confirm the lender’s Quebec process before you waive conditions.",
      "Quebec’s lease and condo (copropriété) rules differ from Ontario. Lenders care about the property type and your income documentation, not the city slogan.",
    ],
    faqs: [
      {
        question: "What is the welcome tax in {city}?",
        answer:
          "Municipal transfer duties on the purchase. They are the Quebec counterpart to land transfer tax. Montreal uses extra high-value brackets; other municipalities generally follow the provincial formula. Ask your notary for the exact amount on your offer.",
      },
      {
        question: "Do I need a notary to get a mortgage in {city}?",
        answer:
          "Yes for a typical Quebec purchase. The notary registers the hypothec and disburses funds. That is different from most other provinces, where a real-estate lawyer often handles closing.",
      },
      {
        question: "Are mortgage rates different in Quebec?",
        answer:
          "Product rates are still national. A few lenders are Quebec-heavy (Desjardins, National Bank, Laurentian). Compare them on this site’s live tables rather than assuming a “Quebec rate.”",
      },
    ],
    localLenders: QC_LENDERS,
  },
  MB: {
    seoTitleSuffix: "Manitoba Land Transfer Tax",
    heroTagline: "National mortgage rates and Manitoba land transfer tax notes for {city}.",
    lttHeadline: "Manitoba land transfer tax",
    lttBody:
      "Manitoba charges a provincial land transfer tax on the value of the land and buildings. The first $30,000 is generally exempt, then rates step up (0.5%, 1%, 1.5%, 2% on higher slices—see Manitoba Finance). There is no Ontario-style first-time LTT refund. {city} buyers should run the closing-costs calculator with Manitoba selected and confirm the tariff with their lawyer.",
    lttHasProvincialTax: true,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "Manitoba closing costs calculator",
    firstTimeIntro:
      "First-time buyers in {city} rely on federal FHSA and HBP programs. Manitoba land transfer tax is still due; plan it as cash-to-close rather than expecting a rebate.",
    firstTimePoints: FEDERAL_FTB,
    renewalIntro: "Shop {city} renewals against the same national 5-year fixed and variable hubs as the rest of Canada.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "Manitoba land transfer tax is provincial. Property tax is municipal and billed after you own the home.",
    ],
    faqs: [
      {
        question: "Does {city} have land transfer tax?",
        answer:
          "Manitoba charges provincial land transfer tax. It is not optional at the city level. There is typically no first-time-buyer LTT refund like Ontario’s.",
      },
      {
        question: "Are mortgage rates special in {city}?",
        answer:
          "No city-specific rate card. Compare live national rates, then add Manitoba tax and legal fees to your cash-to-close.",
      },
    ],
    localLenders: [],
  },
  SK: {
    seoTitleSuffix: "No Land Transfer Tax",
    heroTagline: "National mortgage rates and Saskatchewan’s no-LTT closing profile for {city}.",
    lttHeadline: "No provincial land transfer tax",
    lttBody:
      "Saskatchewan does not charge a provincial land transfer tax. {city} buyers still pay Information Services Corporation (land titles) fees and legal fees. Use the closing-costs calculator with Saskatchewan selected for a fee-side estimate.",
    lttHasProvincialTax: false,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "Saskatchewan closing costs calculator",
    firstTimeIntro:
      "No LTT rebate is needed in {city} because there is no LTT. Federal FHSA and HBP still apply if you qualify.",
    firstTimePoints: FEDERAL_FTB,
    renewalIntro: "Renewal shopping in {city} is a national rate comparison, same as Saskatoon, Regina, or anywhere else in Canada.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "Title registration fees replace the big transfer-tax line you would see in Ontario or B.C. Ask the lawyer for the current ISC tariff.",
    ],
    faqs: [
      {
        question: "Is there land transfer tax in {city}?",
        answer:
          "No provincial land transfer tax in Saskatchewan. Budget land-titles (ISC) fees and legal costs instead.",
      },
      {
        question: "Do lenders offer different rates in Saskatchewan?",
        answer:
          "Not as a provincial discount. Compare the live table on this page. Qualification still uses the federal stress test for regulated lenders.",
      },
    ],
    localLenders: [],
  },
  NS: {
    seoTitleSuffix: "Deed Transfer Tax",
    heroTagline: "National mortgage rates and Nova Scotia municipal deed transfer tax for {city}.",
    lttHeadline: "Municipal deed transfer tax",
    lttBody:
      "Nova Scotia does not levy a single provincial land transfer tax. Municipalities charge a deed transfer tax (DTT) as a percentage of the sale price. Rates are set locally and published by Service Nova Scotia (many municipalities, including Halifax Regional Municipality and Cape Breton Regional Municipality, use 1.5%). There is no Ontario-style first-time LTT refund. Confirm the current municipal rate before you firm up an offer.",
    lttHasProvincialTax: true,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "Nova Scotia closing costs calculator",
    firstTimeIntro:
      "First-time buyers in {city} should budget the full municipal deed transfer tax in cash. Federal FHSA and HBP still help the down payment.",
    firstTimePoints: FEDERAL_FTB,
    renewalIntro: "Atlantic renewals still clear on national posted rates. Compare 5-year fixed and variable hubs, then talk to your current lender.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "Deed transfer tax is municipal. Moving from Halifax to another Nova Scotia municipality can change the percentage. Check the Service Nova Scotia rate list.",
    ],
    faqs: [
      {
        question: "What transfer tax do I pay in {city}?",
        answer:
          "A municipal deed transfer tax collected at land registration, not a provincial LTT. The percentage depends on the municipality. Service Nova Scotia publishes the rate list.",
      },
      {
        question: "Is there a first-time buyer deed-transfer rebate in Nova Scotia?",
        answer:
          "There is no widely used provincial first-time DTT rebate comparable to Ontario’s $4,000 LTT refund. Budget the full municipal percentage unless your lawyer confirms a specific exemption.",
      },
    ],
    localLenders: [],
  },
  NB: {
    seoTitleSuffix: "Real Property Transfer Tax",
    heroTagline: "National mortgage rates and New Brunswick transfer tax notes for {city}.",
    lttHeadline: "New Brunswick real property transfer tax",
    lttBody:
      "New Brunswick charges a real property transfer tax of 1% of the greater of the purchase price and the assessed value (Service New Brunswick). {city} buyers should treat that 1% as a core closing cost alongside legal fees. There is no Ontario-style first-time LTT refund.",
    lttHasProvincialTax: true,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "New Brunswick closing costs calculator",
    firstTimeIntro:
      "Budget New Brunswick’s 1% transfer tax in cash when you buy in {city}. Use FHSA and HBP for the down payment if you qualify.",
    firstTimePoints: FEDERAL_FTB,
    renewalIntro: "Compare {city} renewal offers with national 5-year fixed and variable rates. Penalties still matter if you break early.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "The 1% tax uses the greater of sale price and assessed value—an assessed value above the contract price can increase the tax.",
    ],
    faqs: [
      {
        question: "How much land transfer tax is there in {city}?",
        answer:
          "New Brunswick’s real property transfer tax is 1% of the greater of purchase price and assessed value. Confirm the assessed value on the property before you finalize cash-to-close.",
      },
      {
        question: "Do first-time buyers get a transfer-tax rebate in New Brunswick?",
        answer:
          "There is no Ontario-style first-time LTT refund. Federal FHSA and Home Buyers’ Plan still apply if you are eligible.",
      },
    ],
    localLenders: [],
  },
  NL: {
    seoTitleSuffix: "Registration Fees",
    heroTagline: "National mortgage rates and Newfoundland and Labrador closing-cost notes for {city}.",
    lttHeadline: "Registration fees, not a large LTT",
    lttBody:
      "Newfoundland and Labrador does not charge an Ontario-style percentage land transfer tax. {city} buyers still pay registration and legal fees. Treat the closing-costs calculator as a fee estimate and confirm disbursements with your lawyer.",
    lttHasProvincialTax: false,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "Newfoundland and Labrador closing costs calculator",
    firstTimeIntro:
      "Without a large transfer tax, {city} first-time buyers can put more cash toward the down payment and federal FHSA/HBP programs.",
    firstTimePoints: FEDERAL_FTB,
    renewalIntro: "Shop the national rate table when your {city} mortgage comes due. Island location does not create a separate rate card.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "Ask your lawyer for the current registration tariff. Do not confuse that fee with land transfer tax in other provinces.",
    ],
    faqs: [
      {
        question: "Is there land transfer tax in {city}?",
        answer:
          "There is no large provincial percentage LTT like Ontario or B.C. You still pay legal and registration costs on closing.",
      },
      {
        question: "Are mortgage rates higher in Newfoundland and Labrador?",
        answer:
          "Lenders post national product rates. Compare this page’s live table. Qualification uses the same stress-test rules at federally regulated lenders.",
      },
    ],
    localLenders: [],
  },
  PE: {
    seoTitleSuffix: "P.E.I. Land Transfer Tax",
    heroTagline: "National mortgage rates and Prince Edward Island transfer-tax notes for {city}.",
    lttHeadline: "P.E.I. land transfer tax",
    lttBody:
      "Prince Edward Island charges provincial land transfer tax (commonly 1% above a small exempt slice). Eligible first-time buyers may be exempt on homes at or below $200,000 under the program modelled on our closing-costs calculator—confirm current eligibility with your lawyer. {city} purchases still need legal fees and the usual closing extras.",
    lttHasProvincialTax: true,
    lttToolHref: CLOSING_HREF,
    lttToolLabel: "P.E.I. closing costs calculator",
    firstTimeIntro:
      "If the {city} purchase is within P.E.I.’s first-time exemption threshold, transfer tax can drop to zero. Above that, budget the provincial tax plus federal FHSA/HBP for the down payment.",
    firstTimePoints: [
      {
        heading: "P.E.I. first-time exemption",
        body: "The province has offered a first-time exemption on lower-priced eligible homes (our calculator models a full exemption at or below $200,000). Rules and thresholds change—verify before you waive conditions.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro: "P.E.I. renewals still clear on national posted rates. Compare 5-year fixed and variable hubs before you accept a lender letter.",
    renewalPoints: RENEWAL_DEFAULT,
    marketNotes: [
      "Non-resident buyers can face extra provincial restrictions and taxes on P.E.I. Resident first-time buyers should still have a lawyer confirm the file.",
    ],
    faqs: [
      {
        question: "Does {city} have land transfer tax?",
        answer:
          "P.E.I. charges provincial land transfer tax. Some first-time buyers on lower-priced eligible homes may be exempt. Confirm with your lawyer; do not skip the line in your cash-to-close.",
      },
      {
        question: "Are mortgage rates different on P.E.I.?",
        answer:
          "No island-specific rate card. Use the live national comparison on this page.",
      },
    ],
    localLenders: [],
  },
};

const FEATURED: Record<string, CityOverride> = {
  toronto: {
    seoTitle: "Toronto Mortgage Rates | Double Land Transfer Tax",
    seoDescription:
      "Compare live Canadian mortgage rates for Toronto buyers. City of Toronto charges municipal land transfer tax on top of Ontario LTT. First-time rebates, GTA links, and closing-cost tools.",
    h1: "Mortgage Rates in Toronto",
    heroTagline: "Live national rates, plus Toronto’s double land transfer tax and GTA first-time / renewal notes.",
    intro:
      "Toronto is Canada’s largest housing market and the only major city that layers a municipal land transfer tax on top of Ontario’s provincial tax. Lenders still post national mortgage rates—what is local is cash-to-close, condo vs freehold lending, and how much payment a given rate produces on a large principal.",
    lttHeadline: "Ontario LTT plus Toronto municipal LTT",
    lttBody:
      "A purchase inside the City of Toronto pays Ontario land transfer tax and the City’s municipal land transfer tax (MLTT). Eligible first-time buyers can claim a provincial refund of up to $4,000 and a City of Toronto MLTT rebate of up to $4,475 (up to $8,475 combined). Your lawyer typically claims both at registration; you otherwise have 18 months to apply. Toronto also adopted a municipal non-resident speculation tax (10% as of 1 January 2025) on certain foreign purchases—separate from LTT. Mississauga, Brampton, Vaughan, and other GTA municipalities do not charge Toronto’s MLTT. Use the land transfer tax calculator with the Toronto option enabled.",
    firstTimeIntro:
      "Toronto first-time buyers often still owe net transfer tax after rebates because typical purchase prices sit well above the $368,000 provincial full-offset level. Stack FHSA, HBP, and both rebates, and compare nearby GTA cities that do not charge MLTT.",
    firstTimePoints: [
      {
        heading: "Two rebates, two statutes",
        body: "Ontario’s refund (max $4,000) and Toronto’s MLTT rebate (max $4,475) have similar first-time tests (age, occupancy within nine months, no prior home worldwide, spouse rules, citizenship/PR). Toronto allows a post-closing PR/citizenship path within 18 months for the municipal rebate—confirm with the City and your lawyer.",
      },
      {
        heading: "GTA vs City of Toronto",
        body: "Buying in Mississauga, Brampton, or Vaughan avoids Toronto MLTT but you still pay Ontario LTT. That single municipal line is the usual closing-cost gap, not a different mortgage rate.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "Toronto renewals are a national rate shop on a often-large remaining balance. A quarter-point on a bigger principal is real money—compare the live 5-year fixed and variable hubs before you sign the renewal letter.",
    marketNotes: [
      "Condo status certificates, parking/locker exclusive-use, and special assessments matter to underwriters in Toronto more often than in smaller markets. They do not change the posted rate; they can change approval.",
      "The federal prohibition on non-resident purchases of residential property (where it applies) is separate from LTT and from Toronto’s municipal NRST. Residents should still flag any non-resident co-buyer to their lawyer.",
      "We do not quote a Toronto benchmark listing figure here. Use a local realtor CMA and then stress-test the mortgage on this site.",
    ],
    faqs: [
      {
        question: "What are current mortgage rates in Toronto?",
        answer:
          "Use the live rate snapshot on this page. Those figures come from the same national lender feed as the homepage—not a Toronto-only sheet. There is no official “average Toronto mortgage rate.”",
      },
      {
        question: "Why is Toronto land transfer tax so high?",
        answer:
          "You pay Ontario’s provincial tax and Toronto’s municipal tax on the same purchase. First-time rebates cap at $4,000 provincial and $4,475 municipal. Neighbouring GTA cities do not add MLTT.",
      },
      {
        question: "Do I pay Toronto MLTT if I buy in Mississauga or Markham?",
        answer:
          "No. MLTT applies to conveyances in the City of Toronto. Other Ontario municipalities charge Ontario LTT only (plus local property tax after you own the home).",
      },
      {
        question: "Which lenders should Toronto buyers compare?",
        answer:
          "Big 6 banks, monolines (First National, CMLS, Equitable, and others we track), Ontario credit unions such as Meridian, and digital lenders. Rank them by today’s posted rate on this site, then confirm hold periods and prepayment rules.",
      },
      {
        question: "Does a Toronto condo get a different rate than a house?",
        answer:
          "Product rates are the same. Some lenders cap condo size, storey, or rental-use. That is an eligibility issue, not a published city rate.",
      },
      {
        question: "How do I estimate Toronto closing costs?",
        answer:
          "Run the land transfer tax calculator with Toronto selected, then add legal fees, title insurance, and inspection on the closing-costs tool. Rebates apply only if you meet first-time tests.",
      },
    ],
    extraLinks: [
      { href: "/blog/first-time-buyer-guide-2026/", label: "First-time buyer guide" },
      { href: "/lenders/meridian/", label: "Meridian Credit Union rates" },
    ],
  },
  vancouver: {
    seoTitle: "Vancouver Mortgage Rates | BC Property Transfer Tax",
    seoDescription:
      "Compare live mortgage rates for Vancouver and Metro Vancouver. B.C. property transfer tax, first-time PTT exemption, Vancity, and closing-cost tools—no invented city average prices.",
    h1: "Mortgage Rates in Vancouver",
    heroTagline: "Live national rates with Metro Vancouver PTT, credit-union, and first-time exemption notes.",
    intro:
      "Vancouver shoppers use the same national mortgage rate sheet as the rest of Canada. The local stack is B.C. property transfer tax, possible additional foreign-buyer PTT, the speculation and vacancy tax in specified areas, and credit unions such as Vancity that many buyers compare with the Big 6.",
    lttHeadline: "B.C. PTT in Metro Vancouver",
    lttBody:
      "Metro Vancouver purchases pay B.C. property transfer tax on fair market value (1% / 2% / 3% / 5% brackets published by the province). Eligible first-time buyers can exempt PTT on the first $500,000; since 1 April 2024 the qualifying-home ceiling is $835,000 for the full program and under $860,000 for a partial phase-out. Many Vancouver proper purchases sit above those ceilings, so first-time status may not erase PTT. Specified areas also levy additional PTT on foreign entities (commonly 20%) and the provincial Speculation and Vacancy Tax. Confirm with your notary.",
    firstTimeIntro:
      "Treat the B.C. first-time PTT program as price-sensitive. If the Vancouver home’s fair market value is above the provincial ceiling, you may pay full PTT even as a first-time buyer. FHSA and HBP still help the down payment.",
    firstTimePoints: [
      {
        heading: "Check FMV against the PTT program",
        body: "The exemption wipes PTT on the first $500,000 of value only if the home qualifies. Above $860,000 (current provincial phase-out end) there is generally no first-time PTT relief.",
      },
      {
        heading: "Credit unions",
        body: "Vancity and Coast Capital are part of a normal Metro Vancouver shopping list. Compare Mixer and other Vancity products on our Vancity lender page against monolines the same day.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "Vancouver renewals often involve large remaining balances. Compare live 5-year fixed and variable hubs, and include B.C. credit unions—not only the bank that holds the current mortgage.",
    marketNotes: [
      "City of Vancouver empty homes tax is municipal and separate from provincial PTT and SVT. Owner-occupiers are not the target; investors and vacant properties need local advice.",
      "We do not quote a Vancouver benchmark price on this page. Pull a CMA, then stress-test the payment and cash-to-close.",
    ],
    faqs: [
      {
        question: "What are current mortgage rates in Vancouver?",
        answer:
          "See the live snapshot on this page. They are national lender postings, not a City of Vancouver rate. Credit unions may differ on the same day—open the Vancity and Coast Capital pages.",
      },
      {
        question: "Does Vancouver have land transfer tax?",
        answer:
          "B.C. charges property transfer tax province-wide. Vancouver does not add a Toronto-style municipal LTT, but PTT plus possible additional foreign PTT and vacancy-related taxes can still dominate closing costs.",
      },
      {
        question: "Will I get the first-time PTT exemption in Vancouver?",
        answer:
          "Only if you meet personal tests and the home’s fair market value is within the provincial program limits. Many Vancouver purchases are not. Ask your notary to model PTT before you remove subjects.",
      },
      {
        question: "Are Vancity rates only for Vancouver?",
        answer:
          "Vancity is a Metro Vancouver credit union with membership rules. Its posted rates still compete with national lenders. Compare them in the live tables rather than assuming a local exclusive.",
      },
      {
        question: "How do Surrey or Burnaby closing costs compare?",
        answer:
          "They pay the same B.C. PTT brackets. Differences are price, not a different tax statute. Additional foreign PTT and SVT still depend on designated-area rules.",
      },
    ],
    extraLinks: [
      { href: "/lenders/vancity/", label: "Vancity mortgage rates" },
      { href: "/lenders/coastcapital/", label: "Coast Capital rates" },
    ],
    localLenders: BC_LENDERS,
  },
  calgary: {
    seoTitle: "Calgary Mortgage Rates | No Alberta Land Transfer Tax",
    seoDescription:
      "Compare live mortgage rates for Calgary. Alberta has no land transfer tax—budget land-titles fees instead. ATB, stress test, and closing-cost tools for Alberta buyers.",
    h1: "Mortgage Rates in Calgary",
    heroTagline: "Live national rates with Alberta’s no-LTT closing-cost profile for Calgary.",
    intro:
      "Calgary buyers shop the same national mortgage rates as the rest of Canada. The local advantage is structural: Alberta has no provincial land transfer tax, so more of your cash can go to down payment and legal fees instead of a percentage tax.",
    firstTimeIntro:
      "Calgary first-time buyers do not file an LTT rebate because there is nothing to rebate. Use FHSA and HBP, then keep a buffer for land-titles registration and lawyer disbursements.",
    renewalIntro:
      "Calgary renewals should include ATB Financial alongside the Big 6 and monolines. Energy-sector income still has to document for the stress test.",
    marketNotes: [
      "No provincial sales tax and no LTT are not the same as “cheap housing.” We do not show a Calgary average price here—use a local CMA.",
      "Servus and other Alberta credit unions may appear in broker shops even when we do not list every credit union on this site. Still start with the live table.",
    ],
    faqs: [
      {
        question: "Does Calgary have land transfer tax?",
        answer:
          "No. Alberta does not charge provincial land transfer tax. You still pay land-titles fees and legal costs.",
      },
      {
        question: "Are Calgary mortgage rates lower than Toronto?",
        answer:
          "The posted rate for the same product is usually the same. A smaller typical mortgage can make qualification easier. That is not a Calgary rate discount.",
      },
      {
        question: "Should I get a quote from ATB in Calgary?",
        answer:
          "If you live in Alberta, yes—compare ATB’s live page with banks and monolines the same day.",
      },
      {
        question: "What closing costs should Calgary buyers expect?",
        answer:
          "Legal fees, land-titles registration, inspection, and moving. Skip the Ontario/B.C. transfer-tax line. The closing-costs calculator with Alberta selected is the right tool.",
      },
    ],
  },
  edmonton: {
    seoTitle: "Edmonton Mortgage Rates | No Alberta Land Transfer Tax",
    seoDescription:
      "Compare live mortgage rates for Edmonton. No provincial land transfer tax in Alberta. ATB, stress-test, and closing-cost calculators for capital-region buyers.",
    h1: "Mortgage Rates in Edmonton",
    heroTagline: "Live national rates and Alberta’s no-LTT closing profile for Edmonton.",
    intro:
      "Edmonton is Alberta’s capital and, like Calgary, has no provincial land transfer tax. Mortgage rates are national; the local file is land-titles fees, provincial employment, and ATB alongside the banks.",
    firstTimeIntro:
      "Edmonton first-time buyers should still stress-test income (including any variable overtime) and budget legal fees. There is no LTT rebate paperwork.",
    renewalIntro:
      "Compare your Edmonton lender’s renewal letter with ATB and the national 5-year hubs. Public-sector and energy incomes still need the same documentation.",
    marketNotes: [
      "Capital-region commuting (Sherwood Park, St. Albert, and similar) does not change the rate card. It can change property tax and condo vs freehold mix.",
    ],
    faqs: [
      {
        question: "Is there land transfer tax in Edmonton?",
        answer: "No provincial LTT in Alberta. Budget land-titles and legal fees.",
      },
      {
        question: "Do Edmonton and Calgary have different mortgage rates?",
        answer:
          "Not as official city rates. Shop the same live table. Qualification depends on your income, down payment, and the property—not which Alberta city is on the MLS listing.",
      },
      {
        question: "Which lenders are worth comparing in Edmonton?",
        answer:
          "ATB, the Big 6, monolines, and any credit union your broker can access. Start with this page’s live snapshot.",
      },
    ],
  },
  ottawa: {
    seoTitle: "Ottawa Mortgage Rates | Ontario LTT Guide",
    seoDescription:
      "Compare live mortgage rates for Ottawa. Ontario land transfer tax applies; there is no Toronto municipal LTT. Federal-employment, bilingual, and closing-cost notes.",
    h1: "Mortgage Rates in Ottawa",
    heroTagline: "Live national rates with Ontario LTT notes for Ottawa—no Toronto municipal tax.",
    intro:
      "Ottawa buyers pay Ontario land transfer tax but not Toronto’s municipal LTT. The National Capital Region includes federal employment and, across the river, Gatineau (Quebec welcome tax and notaries)—a different closing regime if you actually buy in Quebec.",
    lttHeadline: "Ontario LTT only (no Toronto MLTT)",
    lttBody:
      "A home in the City of Ottawa is an Ontario purchase: provincial land transfer tax and the up-to-$4,000 first-time refund if you qualify. There is no municipal land transfer tax like Toronto’s. If you buy in Gatineau, Quebec transfer duties and a notary apply instead—do not use Ottawa LTT math on a Quebec offer.",
    firstTimeIntro:
      "Ottawa first-time buyers can claim the Ontario LTT refund (max $4,000) plus FHSA and HBP. That is the same provincial stack as London or Hamilton, not Toronto’s dual rebate.",
    marketNotes: [
      "Bilingual workplaces do not create a special mortgage rate. Some lenders are more comfortable with federal pay stubs and Phoenix-related documentation—ask early.",
      "If a spouse or co-buyer lives or buys in Quebec, you may be mixing two legal systems. Get a lawyer/notary on the correct side of the river.",
    ],
    faqs: [
      {
        question: "Does Ottawa have municipal land transfer tax?",
        answer:
          "No. Only the City of Toronto adds municipal LTT in Ontario. Ottawa buyers pay provincial LTT.",
      },
      {
        question: "Are Ottawa mortgage rates different because of the federal government?",
        answer:
          "Posted rates are national. Stable federal income can help qualification; it does not unlock a private Ottawa rate sheet.",
      },
      {
        question: "What if I buy in Gatineau instead of Ottawa?",
        answer:
          "That is a Quebec purchase: welcome tax, notary, and possibly different lenders. Use the Montreal or Quebec City notes as a starting point and hire a Quebec notary.",
      },
    ],
    extraLinks: [{ href: "/cities/montreal/", label: "Montreal mortgage rates (Quebec closings)" }],
  },
  montreal: {
    seoTitle: "Montreal Mortgage Rates | Welcome Tax & Notaries",
    seoDescription:
      "Compare live mortgage rates for Montreal. Quebec welcome tax, extra Montreal brackets on higher-value homes, notary closings, and Desjardins vs Big 6.",
    h1: "Mortgage Rates in Montreal",
    heroTagline: "Live national rates with Montreal welcome-tax and notary closing notes.",
    intro:
      "Montreal mortgages are still priced on national product rates. What is local is the municipal welcome tax (with extra Montreal brackets on higher-value properties), notary-led closings, and Quebec-centred lenders such as Desjardins and National Bank.",
    lttHeadline: "Montreal transfer duties (welcome tax)",
    lttBody:
      "Montreal charges droits de mutation on the purchase. The city uses the provincial bracket structure and adds higher rates on upper value slices (indexed each year—ask your notary for the current schedule). There is no Ontario-style first-time LTT refund. A notary registers the hypothec. Our land transfer tax calculator is a planning estimate for Quebec; Montreal’s extra brackets mean a notary quote is the source of truth.",
    firstTimeIntro:
      "Montreal first-time buyers should budget the full welcome tax in cash unless a specific municipal program applies to that property. FHSA and HBP remain the main federal boosts.",
    firstTimePoints: [
      {
        heading: "Notary closing",
        body: "Build notary fees and transfer duties into cash-to-close before you go firm. Do not assume an Ontario lawyer’s LTT worksheet.",
      },
      ...FEDERAL_FTB,
    ],
    renewalIntro:
      "Include Desjardins, National Bank, and Laurentian when you renew in Montreal, then compare with the Big 6 live tables on this site.",
    marketNotes: [
      "Copropriété (condo) documents and French contracts are normal. Lenders still want the same income and down-payment proofs.",
      "We do not quote a Montreal average price. Model payments from your offer, not from a blog round number.",
    ],
    faqs: [
      {
        question: "What is Montreal’s welcome tax?",
        answer:
          "Municipal transfer duties on the purchase price, with extra city rates on higher-value homes. Your notary calculates the exact amount. It is not Toronto MLTT and not B.C. PTT.",
      },
      {
        question: "Do I need a notary for a Montreal mortgage?",
        answer:
          "Yes for a standard purchase. The notary handles the deed and hypothec. Budget their fee separately from transfer duties.",
      },
      {
        question: "Are Desjardins rates only for Quebec?",
        answer:
          "Desjardins is Quebec-centred. Compare live Desjardins rates with National Bank, Laurentian, and the Big 6 on this site.",
      },
      {
        question: "Is there a first-time welcome-tax rebate in Montreal?",
        answer:
          "Do not assume an Ontario-style $4,000 refund. Ask the notary whether any borough or provincial measure applies to your file; budget the tax unless they confirm otherwise.",
      },
    ],
    extraLinks: [
      { href: "/lenders/desjardins/", label: "Desjardins mortgage rates" },
      { href: "/lenders/nationalbank/", label: "National Bank rates" },
    ],
    localLenders: QC_LENDERS,
  },
  mississauga: {
    seoTitle: "Mississauga Mortgage Rates | GTA Without Toronto MLTT",
    seoDescription:
      "Compare live mortgage rates for Mississauga. Ontario land transfer tax applies; there is no City of Toronto municipal LTT. Peel Region closing-cost notes and GTA links.",
    h1: "Mortgage Rates in Mississauga",
    heroTagline: "Live national rates for Mississauga—Ontario LTT, no Toronto municipal tax.",
    intro:
      "Mississauga is in Peel Region, not the City of Toronto. You pay Ontario land transfer tax, not Toronto’s municipal LTT. That is the usual closing-cost difference versus a Toronto purchase; the mortgage rate card is still national.",
    lttHeadline: "Ontario LTT (no Toronto MLTT)",
    lttBody:
      "A Mississauga freehold or condo pays Ontario land transfer tax only. Eligible first-time buyers can refund up to $4,000. Do not enable the Toronto toggle on our land transfer tax calculator for a Mississauga address—that would double-count a tax you do not owe.",
    firstTimeIntro:
      "Mississauga first-time buyers get the provincial LTT refund (if eligible) plus FHSA and HBP. You do not get Toronto’s extra $4,475 municipal rebate because you are not paying MLTT.",
    marketNotes: [
      "Pearson-area employment and GTA commuting do not create a Mississauga mortgage rate. They can affect condo vs detached mix and commute-driven demand.",
      "Compare cash-to-close with Toronto, Brampton, and Oakville on the same price to see the MLTT gap clearly.",
    ],
    faqs: [
      {
        question: "Do Mississauga buyers pay Toronto land transfer tax?",
        answer:
          "No. Toronto MLTT is for conveyances in the City of Toronto. Mississauga is Ontario LTT only.",
      },
      {
        question: "Are Mississauga mortgage rates the same as Toronto?",
        answer:
          "Posted product rates are the same national feed. The payment still depends on your price and term, not the municipal boundary.",
      },
      {
        question: "Which GTA cities should I compare?",
        answer:
          "Toronto (double LTT), Brampton, Oakville, and Burlington. Use the nearby links on this page.",
      },
    ],
  },
  brampton: {
    seoTitle: "Brampton Mortgage Rates | Ontario LTT in Peel",
    seoDescription:
      "Compare live mortgage rates for Brampton. Ontario land transfer tax, no Toronto municipal LTT. First-time refund, GTA links, and closing-cost calculators.",
    h1: "Mortgage Rates in Brampton",
    heroTagline: "Live national rates for Brampton with Ontario LTT—not Toronto’s municipal tax.",
    intro:
      "Brampton is a Peel Region city. Buyers pay Ontario land transfer tax and can claim the provincial first-time refund if eligible. They do not pay Toronto municipal LTT. Mortgage rates remain national.",
    lttHeadline: "Ontario LTT only",
    lttBody:
      "Use the land transfer tax calculator without the Toronto option. Brampton closings are provincial LTT plus legal fees. First-time refund up to $4,000 if you meet Ontario’s tests.",
    firstTimeIntro:
      "Brampton first-time buyers should model Ontario LTT net of the $4,000 cap, then FHSA/HBP. Skipping Toronto MLTT is the structural saving versus a Toronto purchase at the same price.",
    faqs: [
      {
        question: "Is Brampton subject to Toronto MLTT?",
        answer: "No. Brampton is outside the City of Toronto.",
      },
      {
        question: "Are Brampton mortgage rates different from Mississauga?",
        answer:
          "Not as city postings. Compare the live table once, then look at each property’s price, condo status, and your down payment.",
      },
    ],
  },
  winnipeg: {
    seoTitle: "Winnipeg Mortgage Rates | Manitoba Land Transfer Tax",
    seoDescription:
      "Compare live mortgage rates for Winnipeg. Manitoba land transfer tax applies (no Ontario-style first-time LTT refund). Closing-cost tools and Prairie context.",
    h1: "Mortgage Rates in Winnipeg",
    heroTagline: "Live national rates with Manitoba land transfer tax notes for Winnipeg.",
    intro:
      "Winnipeg buyers use national mortgage rates and pay Manitoba’s provincial land transfer tax on land and buildings. There is no Toronto-style municipal LTT and typically no first-time LTT refund, so the tax line should be in cash-to-close from day one. Compare Brandon if you want the same statute in a smaller Manitoba city.",
    firstTimeIntro:
      "Winnipeg first-time buyers should cash-flow Manitoba land transfer tax in full, then use FHSA and HBP for the down payment.",
    faqs: [
      {
        question: "Does Winnipeg have land transfer tax?",
        answer:
          "Manitoba charges provincial land transfer tax. Winnipeg does not add a Toronto-style municipal LTT.",
      },
      {
        question: "Is there a first-time LTT rebate in Winnipeg?",
        answer:
          "Not like Ontario’s $4,000 refund. Budget the provincial tax unless your lawyer confirms a specific exemption.",
      },
      {
        question: "Are Winnipeg rates lower than other Prairies cities?",
        answer:
          "Posted rates are national. Compare this page with Calgary or Saskatoon for tax regime differences, not for a secret Winnipeg rate.",
      },
    ],
  },
  halifax: {
    seoTitle: "Halifax Mortgage Rates | HRM Deed Transfer Tax",
    seoDescription:
      "Compare live mortgage rates for Halifax. HRM charges a 1.5% municipal deed transfer tax (By-law D-200). No Ontario-style first-time LTT rebate. Closing-cost tools.",
    h1: "Mortgage Rates in Halifax",
    heroTagline: "Live national rates and Halifax Regional Municipality’s 1.5% deed transfer tax.",
    intro:
      "Halifax (HRM) shoppers see national mortgage rates. The large local closing line is municipal deed transfer tax: HRM By-law D-200 sets the rate at 1.5% of the value transferred. Service Nova Scotia lists the same 1.5% for Halifax Regional Municipality.",
    lttHeadline: "HRM deed transfer tax (1.5%)",
    lttBody:
      "There is no provincial Nova Scotia LTT. Halifax Regional Municipality charges 1.5% deed transfer tax, collected at land registration. Cape Breton Regional Municipality also lists 1.5% on the provincial rate sheet, but always confirm the municipality on title. There is no Ontario-style first-time LTT refund. The 1.5% must usually be paid in cash—lenders do not add DTT to the mortgage.",
    firstTimeIntro:
      "Halifax first-time buyers should treat 1.5% of the purchase price as a cash closing item, then layer FHSA and HBP on the down payment.",
    marketNotes: [
      "HRM includes former Halifax, Dartmouth, Bedford, and many suburban communities. The DTT rate is municipal, so staying inside HRM keeps the 1.5% rule; leaving HRM means checking the new municipality’s rate.",
    ],
    faqs: [
      {
        question: "What is Halifax deed transfer tax?",
        answer:
          "A 1.5% municipal tax on the value transferred in Halifax Regional Municipality (By-law D-200; Service Nova Scotia rate list). It is the Atlantic counterpart to land transfer tax.",
      },
      {
        question: "Do first-time buyers get a Halifax DTT rebate?",
        answer:
          "There is no standard first-time DTT rebate comparable to Ontario’s LTT refund. Budget the full 1.5% unless your lawyer confirms an exemption.",
      },
      {
        question: "Are Halifax mortgage rates different from the rest of Canada?",
        answer:
          "Posted product rates are national. Compare the live snapshot on this page.",
      },
      {
        question: "Is Cape Breton’s tax the same?",
        answer:
          "Cape Breton Regional Municipality is also listed at 1.5% on the provincial DTT sheet, but always verify the municipality that will appear on the deed.",
      },
    ],
  },
  victoria: {
    seoTitle: "Victoria Mortgage Rates | BC PTT & Capital Region",
    seoDescription:
      "Compare live mortgage rates for Victoria. B.C. property transfer tax, first-time PTT program, and Capital Regional District notes—no invented average prices.",
    h1: "Mortgage Rates in Victoria",
    heroTagline: "Live national rates with B.C. PTT notes for Victoria and the Capital Region.",
    intro:
      "Victoria buyers pay B.C. property transfer tax and shop national mortgage rates. The Capital Regional District is a specified area for additional foreign PTT and for B.C.’s Speculation and Vacancy Tax. Credit unions remain part of a normal Island shopping list.",
    firstTimeIntro:
      "Victoria first-time buyers should check fair market value against B.C.’s PTT exemption ceiling. Island prices can still exceed the program even when they sit below typical Metro Vancouver levels.",
    marketNotes: [
      "Ferry logistics do not change the rate. They can affect appraisal timing. Build that into subject dates, not into the rate shop.",
    ],
    faqs: [
      {
        question: "Does Victoria charge municipal land transfer tax?",
        answer:
          "No Toronto-style MLTT. You pay B.C. PTT. Additional foreign PTT and SVT can apply in the Capital Regional District.",
      },
      {
        question: "Are Victoria mortgage rates lower than Vancouver?",
        answer:
          "Not as a published city rate. Compare the same live table. Your payment still follows the purchase price you actually offer.",
      },
    ],
  },
  hamilton: {
    seoTitle: "Hamilton Mortgage Rates | Ontario LTT in the GTHA",
    seoDescription:
      "Compare live mortgage rates for Hamilton. Ontario land transfer tax, no Toronto MLTT. GTHA commuting notes and first-time refund details.",
    h1: "Mortgage Rates in Hamilton",
    heroTagline: "Live national rates for Hamilton with Ontario LTT—not Toronto’s municipal tax.",
    intro:
      "Hamilton is in the Greater Toronto and Hamilton Area but not the City of Toronto. Buyers pay Ontario land transfer tax only. GO Transit commuting does not create a Hamilton mortgage rate.",
    lttHeadline: "Ontario LTT (no Toronto MLTT)",
    lttBody:
      "Hamilton purchases use Ontario’s LTT brackets and the up-to-$4,000 first-time refund. Do not apply Toronto MLTT to a Hamilton address.",
    firstTimeIntro:
      "Hamilton first-time buyers get the provincial refund if eligible, plus FHSA/HBP—the same Ontario stack as London, not Toronto’s dual rebate.",
    faqs: [
      {
        question: "Is Hamilton part of the GTA for land transfer tax?",
        answer:
          "Hamilton is often grouped with the GTHA for commuting, but Toronto MLTT only applies inside Toronto. Hamilton is provincial LTT only.",
      },
      {
        question: "Are Hamilton mortgage rates cheaper than Toronto?",
        answer:
          "Posted rates are national. A different purchase price changes the payment and the stress test, not the rate card.",
      },
    ],
  },
  london: {
    seoTitle: "London Ontario Mortgage Rates | Closing Costs",
    seoDescription:
      "Compare live mortgage rates for London, Ontario. Provincial land transfer tax, first-time refund up to $4,000, and Southwestern Ontario links.",
    h1: "Mortgage Rates in London, Ontario",
    heroTagline: "Live national rates and Ontario LTT notes for London.",
    intro:
      "London, Ontario buyers pay provincial land transfer tax and shop national rates. University and hospital employment do not unlock a private rate sheet; they can make income documentation more seasonal for students and residents.",
    faqs: [
      {
        question: "Is this London, Ontario or London, U.K.?",
        answer:
          "This page is London, Ontario. Ontario LTT and Canadian stress-test rules apply.",
      },
      {
        question: "Does London have municipal land transfer tax?",
        answer: "No. Ontario provincial LTT only.",
      },
    ],
  },
  kitchener: {
    seoTitle: "Kitchener Mortgage Rates | Waterloo Region LTT",
    seoDescription:
      "Compare live mortgage rates for Kitchener. Ontario land transfer tax, no Toronto MLTT. Waterloo Region links to Waterloo, Guelph, and Hamilton.",
    h1: "Mortgage Rates in Kitchener",
    heroTagline: "Live national rates for Kitchener with Ontario LTT notes.",
    intro:
      "Kitchener sits in Waterloo Region’s tech and manufacturing corridor. You pay Ontario land transfer tax, not Toronto MLTT. Compare nearby Waterloo and Guelph for the same tax statute and the same national rates.",
    faqs: [
      {
        question: "Are Kitchener and Waterloo different for land transfer tax?",
        answer:
          "Both are Ontario LTT only. The municipal boundary does not add a Toronto-style tax.",
      },
      {
        question: "Do tech employees get special mortgage rates in Kitchener?",
        answer:
          "No special city rate. Stock and bonus income still has to meet lender documentation rules. Stress-test the base salary you can prove.",
      },
    ],
  },
  "quebec-city": {
    seoTitle: "Quebec City Mortgage Rates | Welcome Tax",
    seoDescription:
      "Compare live mortgage rates for Quebec City. Municipal welcome tax, notary closings, and Desjardins / National Bank comparisons—no invented average prices.",
    h1: "Mortgage Rates in Quebec City",
    heroTagline: "Live national rates with Capitale-Nationale welcome-tax and notary notes.",
    intro:
      "Quebec City purchases close with a notary and municipal transfer duties. Mortgage rates are national. The capital’s public-sector employment can help qualification; it does not create a provincial rate discount.",
    lttHeadline: "Quebec City transfer duties",
    lttBody:
      "Quebec City uses municipal droits de mutation under provincial bracket rules. Extra Montreal-style high-value city rates do not automatically apply here—your notary will use the Quebec City schedule. There is no Ontario-style first-time LTT refund.",
    faqs: [
      {
        question: "Is Quebec City’s welcome tax the same as Montreal’s?",
        answer:
          "Both are municipal transfer duties, but Montreal adds extra high-value brackets. Ask a Quebec City notary for the local calculation; do not reuse a Montreal worksheet.",
      },
      {
        question: "Do I need a notary in Quebec City?",
        answer: "Yes for a typical hypothec and title transfer.",
      },
    ],
  },
};

const OTHER_INTROS: Record<string, string> = {
  vaughan:
    "Vaughan is in York Region. Buyers pay Ontario land transfer tax, not Toronto municipal LTT, even though the city borders Toronto. Mortgage rates are national.",
  markham:
    "Markham is a York Region GTA city. Ontario LTT applies; Toronto MLTT does not. Shop the same live rate table as Toronto, then model provincial tax only.",
  oakville:
    "Oakville (Halton) buyers pay Ontario land transfer tax without Toronto’s municipal layer. Commuter demand does not change the posted rate card.",
  burlington:
    "Burlington sits between Oakville and Hamilton. Closings are Ontario LTT only. Compare nearby Halton and Hamilton pages for the same tax statute.",
  oshawa:
    "Oshawa is in Durham Region. Ontario LTT applies; there is no Toronto MLTT. Auto-sector and GTA-east commuting affect jobs more than the rate sheet.",
  windsor:
    "Windsor, Ontario buyers pay provincial LTT and shop national rates. Cross-border employment can complicate income documentation—flag it to the lender early.",
  "st-catharines":
    "St. Catharines is in Niagara. Ontario LTT only, no Toronto MLTT. Compare Hamilton for a nearby GTHA closing-cost profile.",
  barrie:
    "Barrie buyers pay Ontario land transfer tax and use national mortgage rates. Simcoe County commuting north of the GTA does not create a Barrie rate.",
  guelph:
    "Guelph is an Ontario LTT city next to Waterloo Region. First-time buyers use the provincial refund (if eligible), not a municipal tax rebate.",
  waterloo:
    "Waterloo (the city) shares Ontario LTT rules with Kitchener. Compare both pages; the tax statute is the same and the rate card is national.",
  kingston:
    "Kingston, Ontario buyers pay provincial LTT. Eastern Ontario location does not change posted mortgage rates; it can change how quickly you get an appraisal.",
  sudbury:
    "Greater Sudbury purchases are Ontario LTT files. Northern Ontario distance is an underwriting and appraisal timing issue, not a different rate card.",
  "thunder-bay":
    "Thunder Bay is Ontario LTT territory. Compare Winnipeg if you are weighing Manitoba’s different land transfer tax statute.",
  surrey:
    "Surrey is Metro Vancouver: B.C. property transfer tax, possible additional foreign PTT, and SVT in specified areas. Rates remain national.",
  burnaby:
    "Burnaby sits between Vancouver and the northeast sector. PTT brackets are provincial. No Toronto-style municipal LTT.",
  richmond:
    "Richmond, B.C. (not Ontario’s Richmond Hill) uses B.C. PTT. Confirm you are modelling the B.C. statute, not Ontario LTT.",
  coquitlam:
    "Coquitlam is Metro Vancouver PTT territory. First-time exemption still depends on fair market value and B.C. residency tests.",
  kelowna:
    "Kelowna is in the Okanagan. B.C. PTT applies; specified-area vacancy and foreign-buyer rules can also apply. Check with a local notary.",
  abbotsford:
    "Abbotsford is Fraser Valley: same B.C. PTT brackets as Vancouver, different typical prices. The first-time PTT ceiling may be more relevant here than in Vancouver proper.",
  nanaimo:
    "Nanaimo (Vancouver Island) uses B.C. PTT. Compare Victoria for Capital Region extra foreign-PTT/SVT context.",
  kamloops:
    "Kamloops is Interior B.C. Property transfer tax still applies. Confirm whether additional foreign PTT or SVT designated-area rules reach the property.",
  "red-deer":
    "Red Deer sits between Calgary and Edmonton. Alberta has no LTT; land-titles fees and legal costs dominate closing.",
  lethbridge:
    "Lethbridge is southern Alberta: no provincial land transfer tax. Compare Calgary for the same tax regime.",
  "medicine-hat":
    "Medicine Hat is a smaller southeastern Alberta city. Like the rest of the province, there is no land transfer tax—cash-to-close is mostly legal and land-titles fees.",
  "grande-prairie":
    "Grande Prairie is northwestern Alberta. No LTT. Resource-sector income still has to document for the federal stress test.",
  brandon:
    "Brandon uses Manitoba’s provincial land transfer tax, same statute as Winnipeg. There is typically no first-time LTT refund.",
  saskatoon:
    "Saskatoon buyers do not pay provincial land transfer tax. ISC registration fees and legal costs replace that line.",
  regina:
    "Regina is Saskatchewan’s capital and has no provincial LTT. Compare Saskatoon for the same tax regime and the same national rates.",
  "prince-albert":
    "Prince Albert follows Saskatchewan’s no-LTT model. Budget land-titles fees, not a percentage transfer tax.",
  "cape-breton":
    "Cape Breton Regional Municipality is listed at 1.5% municipal deed transfer tax on the Service Nova Scotia rate sheet—confirm the municipality on title. Mortgage rates are national.",
  moncton:
    "Moncton purchases pay New Brunswick’s 1% real property transfer tax on the greater of price and assessed value.",
  "saint-john":
    "Saint John, New Brunswick uses the same 1% provincial transfer tax as Moncton and Fredericton. Rates are national.",
  fredericton:
    "Fredericton is New Brunswick’s capital. Budget the 1% real property transfer tax plus legal fees.",
  "st-johns":
    "St. John's, Newfoundland and Labrador, does not charge a large percentage LTT. Registration and legal fees still apply. Mortgage rates are national; the local difference is the fee-only closing stack.",
  charlottetown:
    "Charlottetown buyers pay P.E.I. land transfer tax, with a possible first-time exemption on lower-priced eligible homes. Confirm thresholds with your lawyer.",
};

function defaultIntro(city: CityRecord): string {
  return OTHER_INTROS[city.slug] || `${city.name} is in ${PROVINCE_NAMES[city.province]}. Mortgage rates are national; local closing costs follow the ${PROVINCE_NAMES[city.province]} rules on this page.`;
}

function interpolateFaq(faq: CityFaq, city: CityRecord): CityFaq {
  return { question: fill(faq.question, city), answer: fill(faq.answer, city) };
}

function interpolatePoints(points: BuyerPoint[], city: CityRecord): BuyerPoint[] {
  return points.map((p) => ({ heading: fill(p.heading, city), body: fill(p.body, city) }));
}

const PAD_FAQS: CityFaq[] = [
  {
    question: "Where should I compare {city} mortgage rates?",
    answer:
      "Start with the live snapshot on this page, then open the 5-year fixed, variable, insured, and uninsured hubs. Open individual lender pages for the names you are considering. We do not invent a {city}-only average rate.",
  },
  {
    question: "Does the mortgage stress test change in {city}?",
    answer:
      "No. Federally regulated lenders use the same qualifying-rate rules across Canada. Local taxes change cash-to-close, not the stress-test formula. Use the stress-test qualifier with your actual payment estimate.",
  },
];

function uniqueFaqs(preferred: CityFaq[], fallback: CityFaq[], city: CityRecord): CityFaq[] {
  const seen = new Set<string>();
  const out: CityFaq[] = [];
  for (const faq of [...preferred, ...fallback, ...PAD_FAQS].map((f) => interpolateFaq(f, city))) {
    const key = faq.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(faq);
  }
  return out.slice(0, 6);
}

function defaultSeo(city: CityRecord, layer: ProvinceLayer): CitySeo {
  const title = `${city.name} Mortgage Rates | ${layer.seoTitleSuffix}`;
  const description = `Compare live Canadian mortgage rates for ${city.name}, ${PROVINCE_NAMES[city.province]}. ${layer.lttHeadline}. First-time and renewal notes, nearby cities, and closing-cost tools. Updated with the same lender feed as our homepage.`;
  return {
    title: title.length > 65 ? `${city.name} Mortgage Rates | ${PROVINCE_NAMES[city.province]}` : title,
    description: description.slice(0, 170),
    canonical: `${SITE}${cityPath(city.slug)}`,
    keywords: [
      `${city.name} mortgage rates`,
      `${city.name} land transfer tax`,
      `${city.name} closing costs`,
      `${PROVINCE_NAMES[city.province]} mortgage rates`,
      "Canadian mortgage rates",
    ].join(", "),
    h1: `Mortgage Rates in ${city.name}`,
  };
}

function relatedFor(city: CityRecord, layer: ProvinceLayer, extra: CityLink[] = []): CityLink[] {
  const links: CityLink[] = [
    { href: layer.lttToolHref, label: layer.lttToolLabel },
    { href: "/tools/stress-test-qualifier/", label: "Mortgage stress test" },
    { href: "/tools/mortgage-renewal-calculator/", label: "Renewal calculator" },
    { href: "/rates/5-year-fixed/", label: "5-year fixed rates" },
    { href: "/rates/variable/", label: "Variable rates" },
    { href: "/blog/first-time-buyer-guide-2026/", label: "First-time buyer guide" },
    ...extra,
  ];
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}

export function getCityContent(slug: string): ResolvedCityContent {
  const city = requireCity(slug);
  const layer = PROVINCES[city.province];
  const over = FEATURED[slug];
  const seoBase = defaultSeo(city, layer);
  const seo: CitySeo = {
    ...seoBase,
    title: over?.seoTitle || seoBase.title,
    description: over?.seoDescription || seoBase.description,
    h1: over?.h1 || seoBase.h1,
  };

  const nearby = city.nearby
    .map((nearSlug) => {
      try {
        const n = requireCity(nearSlug);
        return { slug: n.slug, name: n.name };
      } catch {
        return null;
      }
    })
    .filter((n): n is { slug: string; name: string } => n !== null);

  return {
    slug: city.slug,
    name: city.name,
    province: city.province,
    provinceName: PROVINCE_NAMES[city.province],
    region: city.region,
    featured: Boolean(city.featured),
    seo,
    heroTagline: fill(over?.heroTagline || layer.heroTagline, city),
    intro: fill(over?.intro || defaultIntro(city), city),
    lttHeadline: fill(over?.lttHeadline || layer.lttHeadline, city),
    lttBody: fill(over?.lttBody || layer.lttBody, city),
    lttHasProvincialTax: layer.lttHasProvincialTax,
    lttToolHref: layer.lttToolHref,
    lttToolLabel: fill(layer.lttToolLabel, city),
    firstTimeBuyer: {
      intro: fill(over?.firstTimeIntro || layer.firstTimeIntro, city),
      points: interpolatePoints(over?.firstTimePoints || layer.firstTimePoints, city),
    },
    renewal: {
      intro: fill(over?.renewalIntro || layer.renewalIntro, city),
      points: interpolatePoints(over?.renewalPoints || layer.renewalPoints, city),
    },
    marketNotes: (over?.marketNotes || layer.marketNotes).map((n) => fill(n, city)),
    faqs: uniqueFaqs(over?.faqs || [], layer.faqs, city),
    relatedLinks: relatedFor(city, layer, over?.extraLinks),
    localLenders: over?.localLenders || layer.localLenders,
    nearby,
  };
}

export function getCitySeo(slug: string): CitySeo {
  return getCityContent(slug).seo;
}

export function allResolvedCityContent(): ResolvedCityContent[] {
  return CITIES.map((c) => getCityContent(c.slug));
}
