export type CompareKind = "product" | "lender";

/** Minimal rate shape for FAQ copy. Avoids importing compare helpers (circular). */
export interface FaqRatePick {
  rate: number;
  lender_name: string;
}

export interface FaqLenderRates {
  fixed5Insured: FaqRatePick | null;
  fixed5Uninsured: FaqRatePick | null;
  variable5Insured: FaqRatePick | null;
  variable5Uninsured: FaqRatePick | null;
}

export interface CompareFaqContext {
  bestFixed5Insured: FaqRatePick | null;
  bestFixed5Uninsured: FaqRatePick | null;
  bestVariable5Insured: FaqRatePick | null;
  bestVariable5Uninsured: FaqRatePick | null;
  leftLender: FaqLenderRates | null;
  rightLender: FaqLenderRates | null;
}

export interface CompareFaq {
  question: string;
  answer: string;
}

export interface CompareSide {
  name: string;
  shortName: string;
  lenderSlug?: string;
  href: string;
  summary: string;
  whenToChoose: string[];
  pros: string[];
  cons: string[];
}

export interface CompareFramework {
  heading: string;
  body: string;
}

export interface ComparisonPage {
  slug: string;
  kind: CompareKind;
  h1: string;
  title: string;
  seoDescription: string;
  keywords: string;
  intro: string;
  left: CompareSide;
  right: CompareSide;
  framework: CompareFramework[];
  faqs: (ctx: CompareFaqContext) => CompareFaq[];
}

export const COMPARISONS: ComparisonPage[] = [
  {
    slug: "fixed-vs-variable",
    kind: "product",
    h1: "Fixed vs Variable Mortgage Rates in Canada",
    title: "Fixed vs Variable Mortgage Canada | Compare",
    seoDescription:
      "Compare Canadian fixed vs variable mortgages: payment certainty, prime-linked risk, and break penalties. Live 5-year rates from 30+ lenders.",
    keywords:
      "fixed vs variable mortgage Canada, fixed or variable mortgage, 5 year fixed vs variable, variable mortgage penalty, Canadian mortgage comparison",
    intro:
      "Choosing between a fixed and a variable mortgage is one of the highest-intent decisions Canadian buyers and renewers make. A fixed rate locks your contract rate for the term so the payment stays the same. A variable rate is priced as a spread to the lender's prime, so the contract rate moves when prime moves. Use the live 5-year rates on this page — pulled from the same feed as our rate hubs — then decide with a framework, not a guess at tomorrow's Bank of Canada meeting.",
    left: {
      name: "5-year fixed",
      shortName: "Fixed",
      href: "/rates/5-year-fixed/",
      summary:
        "The contract rate stays the same for the term. Best when you want a known payment and can live with a higher break penalty.",
      whenToChoose: [
        "Your budget is tight and a payment increase would be a problem",
        "You plan to stay in the home and the mortgage for most of a 5-year term",
        "You prefer certainty over trying to time Bank of Canada cuts",
        "You are comparing a competitive 5-year special against a variable that is only slightly cheaper",
      ],
      pros: [
        "Payment stays the same for the term",
        "Easy to budget and to stress-test household cash flow",
        "Protects you if prime rises during the term",
        "Widely available as insured and uninsured 5-year specials",
      ],
      cons: [
        "You do not benefit if prime falls after you lock in",
        "Breaking early often means an interest-rate differential (IRD) or three-month interest, whichever is greater",
        "Posted 5-year rates at big banks are not the discounted special you should compare",
      ],
    },
    right: {
      name: "5-year variable",
      shortName: "Variable",
      href: "/rates/variable/",
      summary:
        "The rate moves with the lender's prime. Often cheaper to start, with a simpler 3-month-interest penalty if you break.",
      whenToChoose: [
        "You have a cash buffer if the payment or interest portion rises",
        "You may sell, refinance, or switch before the term ends",
        "You want a lower starting rate and can watch Bank of Canada decisions",
        "You are comfortable that qualification still uses the federal stress-test rate, not today's contract rate",
      ],
      pros: [
        "Typically starts below a comparable 5-year fixed on the same insured vs uninsured label",
        "Standard break penalty is usually three months' interest, not IRD",
        "You benefit if prime falls during the term",
        "Some products let you convert to fixed later (confirm with the lender)",
      ],
      cons: [
        "Payments or the interest/principal split can change when prime changes",
        "There is no separate “national variable rate” — each lender's prime and spread differ",
        "A digital brokerage variable is priced off the funding lender's prime, not a house prime",
      ],
    },
    framework: [
      {
        heading: "Match the product, then the rate",
        body: "Compare a 5-year fixed to a 5-year variable on the same insured vs uninsured label. An insured special is not a fair match for an uninsured posted rate. Open the 5-year fixed hub and the variable hub, then come back to this page's live cards.",
      },
      {
        heading: "Price the break, not just the payment",
        body: "If you might move, separate, or refinance, a variable's typical three-month-interest penalty can be cheaper than a fixed IRD. Run the penalty calculator with your remaining term before you pick certainty you cannot afford to unwind.",
      },
      {
        heading: "Qualify at the stress-test rate either way",
        body: "New purchases and refinances are qualified at the greater of contract plus a buffer or the OSFI qualifying rate — not at the teaser contract rate. Use the stress-test qualifier and the affordability calculator with a rate from the live table.",
      },
      {
        heading: "Do not treat posted bank rates as the market",
        body: "Big 5 posted 5-year rates are starting points. Discounted specials, monolines, and brokered digital channels are what belong in a comparison. Shop the same term and prepayment rules.",
      },
    ],
    faqs: (ctx) => [
      {
        question: "What is the current best 5-year fixed mortgage rate in Canada?",
        answer: `In today's feed, the best 5-year fixed uninsured rate is ${rate(ctx.bestFixed5Uninsured)} and the best 5-year fixed insured rate is ${rate(ctx.bestFixed5Insured)}. Those figures update with our scrape — we do not invent a 5-year average in this FAQ. See the full table on the 5-year fixed rates page.`,
      },
      {
        question: "What is the current best 5-year variable mortgage rate in Canada?",
        answer: `In today's feed, the best 5-year variable uninsured rate is ${rate(ctx.bestVariable5Uninsured)} and the best 5-year variable insured rate is ${rate(ctx.bestVariable5Insured)}. Variable rates are spreads to each lender's prime, so match insured vs uninsured before you compare with a fixed special.`,
      },
      {
        question: "Should I choose a fixed or variable mortgage in Canada?",
        answer:
          "Choose fixed if a stable payment matters more than chasing a lower starting rate. Choose variable if you have a buffer for prime moves and may break the mortgage before the term ends. The live spread between 5-year fixed and variable on this page is the starting point, not a forecast of the next Bank of Canada decision.",
      },
      {
        question: "Is a variable mortgage penalty lower than a fixed penalty?",
        answer:
          "Usually yes for a standard closed variable: the penalty is typically three months' interest. Closed fixed mortgages often charge the greater of three months' interest or the interest-rate differential. Confirm the product sheet, then estimate with the mortgage penalty calculator.",
      },
      {
        question: "Does the mortgage stress test apply to both fixed and variable?",
        answer:
          "Yes. For a new purchase or refinance with a federally regulated lender, you qualify at the stress-test rate, not at the contract rate on this page. Use the stress-test qualifier with your income, debts, and a live rate from the table.",
      },
      {
        question: "Can I switch from variable to fixed during the term?",
        answer:
          "Some lenders allow a conversion to a fixed product, often at their current special rather than a past quote. Conversion rules, any fee, and the new term are lender-specific. Ask for the conversion rate in writing before you rely on it as a hedge.",
      },
      {
        question: "How should I compare a Big 5 special with a digital variable?",
        answer:
          "Match term, insured vs uninsured, and prepayment privileges. A Wealthsimple or nesto variable is priced off a funding lender's prime, not a house “Wealthsimple prime.” Compare the live variable hub with the lender pages rather than a bank's posted 5-year rate.",
      },
    ],
  },
  {
    slug: "insured-vs-uninsured",
    kind: "product",
    h1: "Insured vs Uninsured Mortgage Rates in Canada",
    title: "Insured vs Uninsured Mortgage Canada",
    seoDescription:
      "Compare Canadian insured vs uninsured mortgages: down payment, CMHC premiums, and live high-ratio versus conventional 5-year rates.",
    keywords:
      "insured vs uninsured mortgage Canada, high ratio vs conventional, CMHC insured mortgage rates, uninsured mortgage rates, 20 percent down",
    intro:
      "Insured (high-ratio) mortgages are for purchases with less than 20% down, up to the current federal price cap. You pay default insurance (CMHC, Sagen, or Canada Guaranty), and lenders often price those files cheaper because the insurer takes default risk. Uninsured (conventional) mortgages are for 20%+ down, or for purchases that cannot be insured. The premium can outweigh a lower insured rate — run the numbers with live rates, not a remembered spread from last year.",
    left: {
      name: "Insured (high-ratio)",
      shortName: "Insured",
      href: "/rates/insured/",
      summary:
        "Less than 20% down on an eligible owner-occupied purchase. Default insurance is required; the premium is usually added to the loan.",
      whenToChoose: [
        "Your down payment is under 20% and the home is eligible for insurance",
        "You want access to high-ratio specials that are often the lowest 5-year rates on our hubs",
        "You are a first-time buyer who may also qualify for a longer insured amortization under current rules",
        "You would rather add the premium to the mortgage than delay the purchase to save 20%",
      ],
      pros: [
        "Live insured 5-year specials are often below uninsured specials on the same term",
        "Lets you buy with as little as 5% down on the first slice of the price (subject to current rules)",
        "Insurer underwriting is standardized, which is why many lenders compete hard on this label",
      ],
      cons: [
        "You pay an insurance premium (a percentage of the original loan), typically added to the balance",
        "Price cap and property-type rules apply — not every home can be insured",
        "Investment properties and some refinances are uninsured even if your equity looks high",
      ],
    },
    right: {
      name: "Uninsured (conventional)",
      shortName: "Uninsured",
      href: "/rates/uninsured/",
      summary:
        "20% or more down, or a deal that cannot be default-insured. No CMHC-style premium, but the contract rate is often higher.",
      whenToChoose: [
        "You have 20%+ down and want to skip the insurance premium",
        "The purchase price is above the insured cap, or the property type is not insurable",
        "You are refinancing, blending, or buying a rental that must be conventional",
        "You have compared the extra interest on an uninsured rate with the cost of a high-ratio premium",
      ],
      pros: [
        "No default-insurance premium added to the principal",
        "More flexibility on property type, refinances, and some amortizations",
        "You can still shop 5-year fixed and variable uninsured specials across banks and monolines",
      ],
      cons: [
        "Uninsured contract rates are often higher than insured specials for the same term",
        "You still face the federal stress test on a regulated new origination",
        "A higher rate on a larger conventional loan can cost more than a premium on a smaller high-ratio loan — do the math",
      ],
    },
    framework: [
      {
        heading: "Start with down payment and eligibility, not the sticker rate",
        body: "If you put less than 20% down on an eligible owner-occupied home under the current price cap, insured is usually the path. If you cannot insure the deal, uninsured is not a preference — it is the product. Check the insured and uninsured hubs for the label that actually applies.",
      },
      {
        heading: "Price the premium against the rate gap",
        body: "Default insurance is a one-time premium (often 0.6% to 4% of the original loan, depending on down payment). A lower insured rate can still win after you add the premium to the balance. Use the CMHC insurance calculator plus the payment calculator with live rates from this page.",
      },
      {
        heading: "Do not mix labels when you shop lenders",
        body: "Wealthsimple, nesto, and the Big 5 all publish different insured vs uninsured cells. A missing uninsured row means it is not in today's feed — not that the lender never offers conventional mortgages. Open the lender page and match the same label.",
      },
      {
        heading: "Stress-test and affordability still apply",
        body: "Insurance does not replace qualification. Run GDS/TDS with the stress-test qualifier and the affordability calculator. First-time-buyer amortization rules change the payment, not the need to qualify.",
      },
    ],
    faqs: (ctx) => [
      {
        question: "What is the difference between an insured and uninsured mortgage in Canada?",
        answer:
          "Insured (high-ratio) mortgages require default insurance because the down payment is under 20% on an eligible purchase. Uninsured (conventional) mortgages have 20%+ down or cannot be insured. Insured specials often price lower; uninsured files skip the insurance premium.",
      },
      {
        question: "What are today's best insured and uninsured 5-year fixed rates?",
        answer: `In today's feed, the best insured 5-year fixed is ${rate(ctx.bestFixed5Insured)} and the best uninsured 5-year fixed is ${rate(ctx.bestFixed5Uninsured)}. Use those live figures — we do not invent a typical gap in this FAQ. See the insured and uninsured rate hubs for the full tables.`,
      },
      {
        question: "Why are insured mortgage rates often lower?",
        answer:
          "The insurer reimburses the lender if you default, so the lender's credit risk is lower. That is why high-ratio 5-year specials frequently sit below conventional specials. You still pay for that protection through the insurance premium.",
      },
      {
        question: "How much is CMHC (or Sagen / Canada Guaranty) insurance?",
        answer:
          "Premiums are a percentage of the original mortgage and depend on your down-payment band (commonly from under 1% at the high-down end of high-ratio up to 4% at 5% down). The premium is usually added to the loan, not paid in cash at closing. Estimate it with the CMHC insurance calculator.",
      },
      {
        question: "Can I get an insured mortgage on a home over $1 million?",
        answer:
          "Federal rules in force since late 2024 allow default insurance on eligible homes below a $1.5 million cap, with 5% down on the first $500,000 and 10% on the rest. Homes at or above that cap are uninsured and need 20% down. Confirm current CMHC/OSFI limits before you offer.",
      },
      {
        question: "If I have 20% down, should I still buy default insurance?",
        answer:
          "Usually no — conventional uninsured is the standard path at 20%+. Optionally insuring a low-ratio deal is a lender/insurer product, not the default. Compare the live uninsured 5-year rate with any low-ratio insured quote plus premium; many borrowers simply take conventional.",
      },
      {
        question: "Does mortgage default insurance protect me if I miss payments?",
        answer:
          "No. It protects the lender. You still owe the debt, and a claim can follow you. The reason to care about insured vs uninsured as a shopper is the premium cost and the contract rate, not personal default coverage.",
      },
    ],
  },
  {
    slug: "wealthsimple-vs-td",
    kind: "lender",
    h1: "Wealthsimple vs TD Mortgage Rates",
    title: "Wealthsimple vs TD Mortgage Rates Canada",
    seoDescription:
      "Compare Wealthsimple vs TD mortgages in Canada: brokerage vs bank, cash-back vs FlexLine, and live 5-year insured and uninsured rates.",
    keywords:
      "Wealthsimple vs TD mortgage, Wealthsimple mortgage rates vs TD, TD vs Wealthsimple, does Wealthsimple offer mortgages, TD mortgage rates Canada",
    intro:
      "Wealthsimple vs TD is a brokerage-versus-bank decision, not two Schedule I lenders with the same product shelf. Wealthsimple Mortgage Services Inc. is a licensed brokerage: in-house brokers search 25+ partners. TD is a Big 5 bank that originates its own mortgages and Home Equity FlexLine. Compare the same term and insured vs uninsured label using the live cells below — Wealthsimple's public table is often strongest on insured 5-year specials, while TD publishes a full conventional lineup.",
    left: {
      name: "Wealthsimple",
      shortName: "Wealthsimple",
      lenderSlug: "wealthsimple",
      href: "/lenders/wealthsimple/",
      summary:
        "Licensed digital brokerage. Brokers shop partner lenders. Cash-back promos may apply on new mortgages; coverage is not Canada-wide.",
      whenToChoose: [
        "You want a digital application and a broker shopping multiple lenders",
        "You are comparing an insured 5-year special against a bank relationship rate",
        "Cash-back (when offered) matters and you already use or will open Wealthsimple Chequing",
        "Your province is in Wealthsimple's current coverage list and the mortgage meets their minimum size",
      ],
      pros: [
        "Access to 25+ lending partners instead of a single bank's special",
        "Often competitive on insured 5-year fixed and variable in our feed",
        "No in-house “Wealthsimple prime” — the variable is a spread to the funding lender's prime",
        "Optional cash-back on eligible new mortgages (confirm current promo rules)",
      ],
      cons: [
        "Not a bank branch relationship or a TD-style FlexLine",
        "Quebec and the territories are not currently served",
        "Stated minimum mortgage size (commonly $150,000) rules out small balances",
        "Uninsured rows may be blank in our scrape even when partners can do conventional files",
      ],
    },
    right: {
      name: "TD Bank",
      shortName: "TD",
      lenderSlug: "td",
      href: "/lenders/td/",
      summary:
        "Big 5 direct lender with branches, posted and special rates, and the TD Home Equity FlexLine. Convenient if you already bank at TD.",
      whenToChoose: [
        "You want a TD specialist, branch access, or to keep banking and the mortgage together",
        "You need a FlexLine-style mortgage plus HELOC structure",
        "You are a newcomer using TD's documented newcomer programs",
        "You will actually receive a discounted TD special — not the posted 5-year rate on the homepage",
      ],
      pros: [
        "Full conventional and high-ratio product set in most markets",
        "In-person mortgage specialists and a national branch network",
        "Home Equity FlexLine for readvanceable equity access",
        "Clear path to run a TD-style GDS/TDS affordability check",
      ],
      cons: [
        "Blind 5-year specials are often higher than aggressive monolines or brokered insured quotes",
        "Posted rates are not the deal — you must ask for the discounted special in writing",
        "IRD or three-month-interest penalties still apply if you break a closed TD mortgage",
        "Qualification is still the federal stress test, even with an existing TD relationship",
      ],
    },
    framework: [
      {
        heading: "Decide channel first: broker shop vs bank origination",
        body: "If you want one institution to hold the mortgage and your chequing account, TD wins on structure. If you want a broker to shop 25+ partners and you are fine with a partner as lienholder, Wealthsimple is the channel. The live table tells you which 5-year cell is cheaper today; it does not change that structural difference.",
      },
      {
        heading: "Match insured vs uninsured before you declare a winner",
        body: "Wealthsimple's advertised strength is often insured 5-year. TD's uninsured 5-year is the fair conventional comparison. A dash in our feed means we do not have that cell today. Open both lender pages and the insured / uninsured hubs.",
      },
      {
        heading: "Price extras honestly",
        body: "Wealthsimple cash-back is not a rate. TD FlexLine flexibility is not a rate. Convert cash-back to a rate-equivalent only after you know the promo grid, then still run affordability and the stress test on the contract rate.",
      },
      {
        heading: "Confirm coverage and minimum size",
        body: "Wealthsimple's FAQ lists specific provinces and a minimum mortgage amount. TD covers a broader map through branches and digital. Do not start an application in a province Wealthsimple does not serve.",
      },
    ],
    faqs: (ctx) => [
      {
        question: "Does Wealthsimple offer mortgages compared with TD?",
        answer:
          "Yes. Wealthsimple offers mortgages through a licensed brokerage that searches partner lenders. TD originates its own bank mortgages. They are not the same product. Compare live rates on this page, then read the Wealthsimple and TD lender pages.",
      },
      {
        question: "Whose 5-year rate is lower today, Wealthsimple or TD?",
        answer: `In today's feed, Wealthsimple's 5-year fixed insured is ${rate(ctx.leftLender?.fixed5Insured)} and TD's 5-year fixed insured is ${rate(ctx.rightLender?.fixed5Insured)}. For uninsured 5-year fixed, Wealthsimple is ${rate(ctx.leftLender?.fixed5Uninsured)} and TD is ${rate(ctx.rightLender?.fixed5Uninsured)}. Use those live cells — a blank cell is not a made-up rate.`,
      },
      {
        question: "Is Wealthsimple cheaper than TD for a variable mortgage?",
        answer: `Wealthsimple's 5-year variable insured is ${rate(ctx.leftLender?.variable5Insured)} in today's feed; TD's 5-year variable uninsured is ${rate(ctx.rightLender?.variable5Uninsured)}. Those are different insurance labels. Match insured vs uninsured on the variable hub before you pick a channel.`,
      },
      {
        question: "Does Wealthsimple have a prime rate like TD Prime?",
        answer:
          "No. There is no separate Wealthsimple prime. A variable arranged through Wealthsimple is a spread to the funding lender's prime. TD Prime is the bank's own prime. Always compare contract rates in the table, not prime slogans.",
      },
      {
        question: "Can I get a Wealthsimple mortgage if I already bank at TD?",
        answer:
          "Yes, in provinces Wealthsimple serves, if you meet their minimum size and the partner lender's underwriting. You can keep TD chequing and still place the mortgage elsewhere. Switching later may involve a penalty — estimate it with the penalty calculator.",
      },
      {
        question: "Which is better for a HELOC, Wealthsimple or TD?",
        answer:
          "TD's Home Equity FlexLine is a bank readvanceable product. Wealthsimple is a brokerage shopping residential mortgages, not a replacement for a TD FlexLine. If you need a mortgage-plus-HELOC structure, start with TD (or another bank HELOC) and still shop the mortgage rate.",
      },
      {
        question: "How should I qualify the file either way?",
        answer:
          "Use the stress-test qualifier and the TD-style affordability calculator with the contract rate you are actually comparing. Partner lenders and TD both apply federal qualifying-rate rules on new purchases and refinances.",
      },
    ],
  },
  {
    slug: "td-vs-rbc",
    kind: "lender",
    h1: "TD vs RBC Mortgage Rates",
    title: "TD vs RBC Mortgage Rates Canada | Compare",
    seoDescription:
      "Compare TD vs RBC mortgages in Canada: FlexLine vs Homeline, branch banking, and live 5-year fixed and variable rates from both banks.",
    keywords:
      "TD vs RBC mortgage, RBC vs TD mortgage rates, TD mortgage rates vs Royal Bank, Big 5 mortgage comparison Canada",
    intro:
      "TD vs RBC is a Big 5 vs Big 5 comparison: both originate their own mortgages, both have national branches, and both publish posted rates that are not the special you should shop. The useful differences are product packaging (TD Home Equity FlexLine vs RBC Homeline Plan), how sharp today's discounted 5-year is, and whether you already have a relationship that will actually be priced. Live cells below come from our daily feed — we do not invent a “typical TD vs RBC spread.”",
    left: {
      name: "TD Bank",
      shortName: "TD",
      lenderSlug: "td",
      href: "/lenders/td/",
      summary:
        "Big 5 lender with FlexLine, newcomer programs, and a large branch plus digital network. Shop the discounted special, not the posted rate.",
      whenToChoose: [
        "You already bank at TD and a relationship special is on the table in writing",
        "You want a FlexLine (mortgage segment plus revolving HELOC segment)",
        "You need in-person specialists or newcomer documentation TD will actually underwrite",
        "TD's live 5-year cell beats RBC's on the same insured vs uninsured label",
      ],
      pros: [
        "National branch access and mortgage specialists",
        "Home Equity FlexLine for unused equity without a full refinance every time",
        "Broad conventional term sheet in our feed (not only a 5-year poster)",
        "Easy to pair with the on-site affordability calculator using a TD rate",
      ],
      cons: [
        "Posted 5-year is not the contract rate most qualified borrowers pay",
        "May trail monolines and brokered insured specials on a blind rate shop",
        "Breaking a closed fixed TD mortgage can mean an IRD penalty",
      ],
    },
    right: {
      name: "RBC Royal Bank",
      shortName: "RBC",
      lenderSlug: "rbc",
      href: "/lenders/rbc/",
      summary:
        "Canada's largest bank by many measures, with Homeline Plan (HELOC up to a stated equity cap) and long rate-hold windows on pre-approvals.",
      whenToChoose: [
        "You already bank at RBC or want Homeline-style equity access",
        "A longer rate hold on a pre-approval (RBC commonly advertises up to 120 days) matters for your closing",
        "RBC's live 5-year insured or uninsured cell is the lower special today",
        "You want a full-service bank and are not trying to win a monoline bake-off on rate alone",
      ],
      pros: [
        "Homeline Plan combines mortgage and HELOC-style equity access",
        "Pre-approval rate holds are a practical shopping window when used correctly",
        "Deep branch and advisor network coast to coast",
        "Competes on both insured and uninsured 5-year cells in our feed",
      ],
      cons: [
        "Posted rates still need a negotiated special to be comparable",
        "Convenience does not automatically beat a brokered or monoline 5-year",
        "IRD math on a closed fixed can surprise you if you break early",
      ],
    },
    framework: [
      {
        heading: "Demand the special, then compare the same cell",
        body: "Ask each bank for the discounted rate in writing: term, insured vs uninsured, cash-back yes/no, and prepayment rules. Then compare those numbers with the live table here and with the 5-year fixed and variable hubs.",
      },
      {
        heading: "Pick the equity product you will actually use",
        body: "FlexLine vs Homeline is the structural fork. If you will not use a HELOC segment, ignore the brand names and shop the 5-year payment. If you will, read each bank's current combined LTV caps — they are policy, not a promise on this page.",
      },
      {
        heading: "Relationship pricing is real but not automatic",
        body: "A long-standing TD or RBC relationship can improve the special. It does not waive the stress test. Run affordability and the stress-test qualifier with the contract rate, not the posted rate.",
      },
      {
        heading: "Keep a digital or monoline quote as a check",
        body: "Before you accept either bank, look at Wealthsimple vs TD and nesto vs Wealthsimple on the same label. A Big 5 vs Big 5 bake-off can still leave money on the table.",
      },
    ],
    faqs: (ctx) => [
      {
        question: "Is TD or RBC cheaper for a 5-year fixed mortgage today?",
        answer: `In today's feed, TD's 5-year fixed insured is ${rate(ctx.leftLender?.fixed5Insured)} and RBC's is ${rate(ctx.rightLender?.fixed5Insured)}. Uninsured 5-year fixed is ${rate(ctx.leftLender?.fixed5Uninsured)} at TD and ${rate(ctx.rightLender?.fixed5Uninsured)} at RBC. Those are scraped specials, not posted rack rates.`,
      },
      {
        question: "How do TD and RBC variable rates compare?",
        answer: `TD's 5-year variable uninsured is ${rate(ctx.leftLender?.variable5Uninsured)} in today's feed. RBC's 5-year variable insured is ${rate(ctx.rightLender?.variable5Insured)} and uninsured is ${rate(ctx.rightLender?.variable5Uninsured)}. Match the insurance label before you call a winner.`,
      },
      {
        question: "What is the difference between TD FlexLine and RBC Homeline?",
        answer:
          "Both are readvanceable-style packages: a mortgage portion plus a revolving equity line, subject to combined loan-to-value rules. Names, caps, and how principal readvances differ by bank. Confirm the current product sheet. If you only need a closed 5-year, you may not need either structure.",
      },
      {
        question: "Should I stay with my current Big 5 bank at renewal?",
        answer:
          "Only after you price an external switch. Use the renewal calculator and a live 5-year from this table or the rate hubs. Loyalty specials exist; they are not guaranteed to match a monoline or brokered insured quote.",
      },
      {
        question: "Do TD and RBC use the same stress test?",
        answer:
          "Both are federally regulated banks. New purchases and refinances use the OSFI qualifying-rate test. Estimate GDS/TDS with the stress-test qualifier and the affordability calculator using the contract rate you were quoted.",
      },
      {
        question: "Are posted TD and RBC rates the rates I will pay?",
        answer:
          "Usually not. Posted 5-year rates are starting points. The live numbers on this site are the specials we scrape. Always get the discounted contract rate, term, and insured vs uninsured label in writing.",
      },
      {
        question: "Can I use a mortgage broker and still land at TD or RBC?",
        answer:
          "Sometimes, depending on the bank's broker channel and the product. Wealthsimple and other brokerages shop partners that may or may not include a given Big 5 special. If you need FlexLine or Homeline specifically, you may be better originating directly with the bank.",
      },
    ],
  },
  {
    slug: "nesto-vs-wealthsimple",
    kind: "lender",
    h1: "nesto vs Wealthsimple Mortgage Rates",
    title: "nesto vs Wealthsimple Mortgage Rates Canada",
    seoDescription:
      "Compare nesto vs Wealthsimple mortgages: digital lender vs brokerage, rate hold vs cash-back, and live insured and uninsured 5-year rates.",
    keywords:
      "nesto vs Wealthsimple, Wealthsimple vs nesto mortgage, digital mortgage Canada, nesto mortgage rates, Wealthsimple mortgage rates",
    intro:
      "nesto vs Wealthsimple is the digital-channel bake-off: a direct-to-consumer digital lender with a low-rate guarantee and long rate holds, versus a licensed brokerage that shops 25+ partners and may pay cash-back. Neither is a Big 5 branch. Compare live 5-year insured and uninsured cells — nesto often shows both labels in our feed, while Wealthsimple's public scrape is frequently insured-only. A missing cell is a missing scrape, not a fake number.",
    left: {
      name: "nesto",
      shortName: "nesto",
      lenderSlug: "nesto",
      href: "/lenders/nesto/",
      summary:
        "Digital mortgage lender with an advertised low-rate guarantee, 150-day rate holds, and a fully online application backed by licensed experts.",
      whenToChoose: [
        "You want a digital lender quoting an upfront special on both insured and uninsured 5-year",
        "A long rate hold (nesto commonly advertises 150 days) matters for a slow closing",
        "You prefer one digital origination path rather than a brokerage assigning a partner lender",
        "nesto's live cell is the lower rate on the label you actually qualify for",
      ],
      pros: [
        "Often lists both insured and uninsured 5-year fixed and variable in our feed",
        "Low Mortgage Rate Guarantee positioning (confirm current terms with nesto)",
        "Long advertised rate-hold window for purchase timelines",
        "No branch visit required",
      ],
      cons: [
        "Not a bank HELOC/FlexLine product suite",
        "Guarantee and hold rules are marketing terms — get the contract rate in writing",
        "You still qualify through standard underwriting and the stress test",
      ],
    },
    right: {
      name: "Wealthsimple",
      shortName: "Wealthsimple",
      lenderSlug: "wealthsimple",
      href: "/lenders/wealthsimple/",
      summary:
        "Licensed brokerage shopping 25+ partners. Strong public insured 5-year prints; cash-back may apply; provincial coverage limits apply.",
      whenToChoose: [
        "You want a broker to shop multiple lenders, not a single digital lender's sheet",
        "An insured 5-year special plus cash-back (if you qualify) beats nesto's print today",
        "You already live in the Wealthsimple app and Chequing ecosystem",
        "Your province and mortgage size fit Wealthsimple's current rules",
      ],
      pros: [
        "Broker shop across many partners, not one balance sheet",
        "Competitive insured 5-year fixed and variable in many of our scrapes",
        "Cash-back promotions on eligible new mortgages (confirm the grid)",
        "Dedicated broker from quote through closing",
      ],
      cons: [
        "The mortgage is funded by a partner — ask who the lienholder is",
        "Coverage excludes Quebec and the territories today",
        "Minimum mortgage size filters out smaller balances",
        "Uninsured cells are often blank in our public scrape",
      ],
    },
    framework: [
      {
        heading: "Same label, same term, then add perks",
        body: "Compare nesto and Wealthsimple on 5-year fixed insured, then separately on uninsured if both have a number. Convert cash-back to a rough rate-equivalent only after the promo qualifies. Rate-hold length matters if your closing is far out.",
      },
      {
        heading: "Know who holds the mortgage",
        body: "nesto is the digital lender you apply to. Wealthsimple is the broker; a partner funds the loan. That affects porting, renewals, and who you call in five years. It should not be a surprise at solicitor review.",
      },
      {
        heading: "Check the rest of the market anyway",
        body: "A digital vs digital winner can still lose to a Big 5 special or a monoline. Keep the 5-year fixed hub, variable hub, and TD / RBC pages in the tab set.",
      },
      {
        heading: "Underwriting is not “no paperwork”",
        body: "Digital still means income, down payment, property, and stress-test checks. Use the stress-test qualifier and payment calculator with the live contract rate, not the marketing headline.",
      },
    ],
    faqs: (ctx) => [
      {
        question: "Is nesto or Wealthsimple cheaper for a 5-year fixed insured mortgage?",
        answer: `In today's feed, nesto's 5-year fixed insured is ${rate(ctx.leftLender?.fixed5Insured)} and Wealthsimple's is ${rate(ctx.rightLender?.fixed5Insured)}. Uninsured 5-year fixed is ${rate(ctx.leftLender?.fixed5Uninsured)} at nesto and ${rate(ctx.rightLender?.fixed5Uninsured)} at Wealthsimple. Read dashes as “not in today's feed,” not as a guessed rate.`,
      },
      {
        question: "How do nesto and Wealthsimple variable rates compare?",
        answer: `nesto's 5-year variable insured is ${rate(ctx.leftLender?.variable5Insured)} and uninsured is ${rate(ctx.leftLender?.variable5Uninsured)}. Wealthsimple's 5-year variable insured is ${rate(ctx.rightLender?.variable5Insured)}. Variables are spreads to a lender's prime — Wealthsimple does not set its own prime.`,
      },
      {
        question: "Is Wealthsimple a lender like nesto?",
        answer:
          "No. nesto originates as a digital mortgage lender. Wealthsimple Mortgage Services Inc. is a brokerage that searches partner lenders. Both can be fully digital for you as a borrower; the legal lender on title is not the same.",
      },
      {
        question: "Does nesto's rate guarantee beat Wealthsimple cash-back?",
        answer:
          "They are different levers. A guarantee is about matching or beating a qualifying competing quote (read nesto's current rules). Cash-back is a dollar amount on an eligible new mortgage, not a lower contract rate. Price the contract rate first, then the perk.",
      },
      {
        question: "Which is better if I need an uninsured mortgage?",
        answer:
          "Look at today's uninsured cells. nesto often shows conventional 5-year prints in our feed; Wealthsimple's public table may not. That does not mean Wealthsimple partners never do uninsured files — it means you must ask, and you should still check the uninsured hub.",
      },
      {
        question: "Can I use either if I live in Quebec?",
        answer:
          "Wealthsimple's own coverage list excludes Quebec. nesto's availability is a separate question — confirm on their application. Do not assume a national digital brand funds every province.",
      },
      {
        question: "Should I still get a Big 5 quote?",
        answer:
          "Yes if you want a branch HELOC structure or a relationship special. Use this page against TD, RBC, and the national rate hubs. Digital is a channel, not a guarantee you found the market low.",
      },
    ],
  },
  {
    slug: "bmo-vs-cibc",
    kind: "lender",
    h1: "BMO vs CIBC Mortgage Rates",
    title: "BMO vs CIBC Mortgage Rates Canada | Compare",
    seoDescription:
      "Compare BMO vs CIBC mortgages in Canada: Smart Fixed vs Home Power Plan, and live 5-year fixed and variable rates from both banks.",
    keywords:
      "BMO vs CIBC mortgage, CIBC vs BMO mortgage rates, Bank of Montreal vs CIBC, Big 5 mortgage comparison",
    intro:
      "BMO vs CIBC is another Big 5 fork: both will quote posted and special 5-year rates, both offer mortgage-plus-HELOC packages, and neither should be shopped on the homepage posted rate. BMO leans on Smart Fixed and a straightforward HELOC. CIBC leans on the Home Power Plan. Use the live 5-year cells below, then decide whether you need the equity structure at all.",
    left: {
      name: "BMO Bank of Montreal",
      shortName: "BMO",
      lenderSlug: "bmo",
      href: "/lenders/bmo/",
      summary:
        "Big 5 lender with Smart Fixed mortgages, a full HELOC, and online pre-approval. Competitive when the discounted special is in writing.",
      whenToChoose: [
        "You already bank at BMO or want a Smart Fixed with prepayment flexibility you have confirmed",
        "BMO's live 5-year insured or uninsured cell is the lower special today",
        "A standalone HELOC (rather than CIBC's Home Power Plan packaging) fits how you use equity",
        "You want a full-service bank and are not solely optimizing a brokered insured print",
      ],
      pros: [
        "Smart Fixed positioning with advertised prepayment flexibility (confirm the current sheet)",
        "HELOC available as a distinct equity product",
        "Shows multiple terms in our feed, not only a 5-year poster",
        "National specialist and digital pre-approval path",
      ],
      cons: [
        "Posted rates still need a negotiation to be comparable",
        "May trail digital insured specials on a blind 5-year shop",
        "Standard closed-mortgage penalties if you break early",
      ],
    },
    right: {
      name: "CIBC",
      shortName: "CIBC",
      lenderSlug: "cibc",
      href: "/lenders/cibc/",
      summary:
        "Big 5 lender with the Home Power Plan (mortgage plus HELOC), convertible options, and a full term sheet including insured 5-year cells.",
      whenToChoose: [
        "You want Home Power Plan's combined mortgage and HELOC structure",
        "CIBC's live 5-year cell beats BMO on the same insurance label",
        "A convertible or newcomer CIBC product is the reason you are at this bank",
        "You already hold CIBC banking and will receive a real special, not a posted quote",
      ],
      pros: [
        "Home Power Plan packages mortgage + HELOC-style access",
        "Insured and uninsured 5-year cells both appear in our feed",
        "Convertible mortgage options on some products",
        "Advisor channel with no-obligation quotes",
      ],
      cons: [
        "Complexity of a combined plan is wasted if you never draw the HELOC",
        "Posted vs special gap still applies",
        "IRD or three-month-interest penalties on closed products",
      ],
    },
    framework: [
      {
        heading: "If you do not need a HELOC, ignore the plan names",
        body: "Smart Fixed vs Home Power Plan only matters if you will use equity. Otherwise this is a 5-year rate, penalty, and prepayment comparison. Use the live table and the 5-year fixed / variable hubs.",
      },
      {
        heading: "Write down the special, not the brand",
        body: "Get term, insured vs uninsured, cash-back, and prepayment rules from both banks. Then check nesto, Wealthsimple, TD, and RBC so a BMO vs CIBC tie does not hide a cheaper channel.",
      },
      {
        heading: "Qualify the payment you will actually make",
        body: "Run the payment calculator, affordability calculator, and stress-test qualifier on the contract rate. Combined HELOC limits are separate from GDS/TDS on the mortgage segment.",
      },
      {
        heading: "Renewal is a new shop",
        body: "Neither bank is entitled to your renewal. Use the renewal calculator and a fresh 5-year from this page or the rate hubs before you sign a standard increase letter.",
      },
    ],
    faqs: (ctx) => [
      {
        question: "Is BMO or CIBC cheaper for a 5-year fixed mortgage today?",
        answer: `In today's feed, BMO's 5-year fixed insured is ${rate(ctx.leftLender?.fixed5Insured)} and uninsured is ${rate(ctx.leftLender?.fixed5Uninsured)}. CIBC's 5-year fixed insured is ${rate(ctx.rightLender?.fixed5Insured)} and uninsured is ${rate(ctx.rightLender?.fixed5Uninsured)}. Compare the same label only.`,
      },
      {
        question: "How do BMO and CIBC 5-year variable rates compare?",
        answer: `BMO's 5-year variable uninsured is ${rate(ctx.leftLender?.variable5Uninsured)} in today's feed. CIBC's 5-year variable insured is ${rate(ctx.rightLender?.variable5Insured)} and uninsured is ${rate(ctx.rightLender?.variable5Uninsured)}. Variable quotes are spreads to each bank's prime.`,
      },
      {
        question: "What is the difference between BMO Smart Fixed and CIBC Home Power Plan?",
        answer:
          "Smart Fixed is BMO's branded closed fixed product with stated prepayment flexibility. Home Power Plan is CIBC's mortgage-plus-HELOC package. One is a rate product; the other is a structure. Do not compare them as if they were the same 5-year special.",
      },
      {
        question: "Should first-time buyers pick BMO or CIBC?",
        answer:
          "Pick the lower written special on the insurance label you qualify for, then confirm prepayment and penalty language. First-time-buyer programs at either bank do not replace the stress test. Use the affordability calculator and CMHC calculator if you are high-ratio.",
      },
      {
        question: "Can I switch from BMO to CIBC (or the reverse) at renewal?",
        answer:
          "Yes, as a switch or refinance, subject to qualification and any remaining penalty if you are not at term. Run the renewal calculator and compare both live 5-year cells plus a digital quote.",
      },
      {
        question: "Do I need a Big 5 mortgage if nesto or Wealthsimple is cheaper?",
        answer:
          "Only if you value the branch HELOC structure, a specific newcomer program, or a relationship special that actually beats the digital print. Otherwise the cheaper written 5-year on the same label is the rational pick.",
      },
      {
        question: "Are BMO and CIBC insured rates different from their uninsured rates?",
        answer:
          "Yes. Always match insured vs uninsured. Mixing a high-ratio special with a conventional quote is how fake “bank vs bank” gaps show up in blogs. This page's table keeps the labels separate.",
      },
    ],
  },
];

function rate(pick: FaqRatePick | null | undefined): string {
  if (!pick || typeof pick.rate !== "number") return "not currently listed in our daily feed";
  return `${pick.rate.toFixed(2)}% (${pick.lender_name})`;
}
