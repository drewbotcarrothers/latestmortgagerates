import rawRatesFile from "../../../data/rates.json";
import {
  calculateMonthlyPayment,
  interestPaidOverMonths,
  threeMonthInterestOnBalance,
} from "../../lib/mortgageMath";
import { BOC_POLICY_RATE, PRIME_RATE, PRIME_SPREAD } from "../../lib/primeRate";
import { REPORTED, cad, pct } from "./shared";

/** Evening Eastern on October 23, 2026. These four pages were checked against the sources that day. */
export const GUIDE_REVIEWED_ISO_BATCH4 = "2026-10-23T21:30:00Z";

type RateRow = {
  lender_slug: string;
  lender_name: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type?: string | null;
  posted_rate?: number | null;
  scraped_at?: string;
  raw_data?: { section?: string };
};

const rows = rawRatesFile as RateRow[];

function lowest(
  slug: string,
  termMonths: number,
  rateType: "fixed" | "variable",
  mortgageType: string,
): RateRow | undefined {
  const matches = rows.filter(
    (row) =>
      row.lender_slug === slug &&
      row.term_months === termMonths &&
      row.rate_type === rateType &&
      row.mortgage_type === mortgageType,
  );
  if (matches.length === 0) return undefined;
  return matches.reduce((best, row) => (row.rate < best.rate ? row : best));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

export function points(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return `${rounded.toFixed(2)} points`;
}

interface Pair {
  slug: string;
  name: string;
  mortgageType: string;
  fixed: number;
  variable: number;
  fixedPosted: number | null;
  variablePosted: number | null;
  spread: number;
  scraped: string;
}

const pairKeys = new Set<string>();
for (const row of rows) {
  if (row.term_months !== 60) continue;
  if (row.mortgage_type !== "insured" && row.mortgage_type !== "uninsured") continue;
  pairKeys.add(`${row.lender_slug}|${row.mortgage_type}`);
}

const pairs: Pair[] = [];
for (const key of pairKeys) {
  const [slug, mortgageType] = key.split("|");
  const fixed = lowest(slug, 60, "fixed", mortgageType);
  const variable = lowest(slug, 60, "variable", mortgageType);
  if (!fixed || !variable) continue;
  pairs.push({
    slug,
    name: fixed.lender_name,
    mortgageType,
    fixed: fixed.rate,
    variable: variable.rate,
    fixedPosted: fixed.posted_rate,
    variablePosted: variable.posted_rate,
    spread: Math.round((fixed.rate - variable.rate) * 100) / 100,
    scraped: (fixed.scraped_at ?? variable.scraped_at ?? "").slice(0, 10),
  });
}
pairs.sort((a, b) => a.name.localeCompare(b.name) || a.mortgageType.localeCompare(b.mortgageType));

const narrowestPair = pairs.reduce((best, item) => (item.spread < best.spread ? item : best));
const widestPair = pairs.reduce((best, item) => (item.spread > best.spread ? item : best));

const SHORT_LENDER: Record<string, string> = {
  "Royal Bank of Canada": "RBC",
  "Canadian Imperial Bank of Commerce": "CIBC",
  "Bank of Montreal": "BMO",
  "National Bank of Canada": "National Bank",
  "TD Bank": "TD",
};

if (pairs.length < 8) {
  throw new Error("Rate file is missing 5-year fixed and variable pairs the lock-in guide cites.");
}

const scrapeDates = [...new Set(pairs.map((pair) => pair.scraped).filter(Boolean))];
export const RATE_FILE_AS_OF = scrapeDates[0] ?? "";

function pair(slug: string, mortgageType: string): Pair {
  const found = pairs.find((item) => item.slug === slug && item.mortgageType === mortgageType);
  if (!found) throw new Error(`Missing 5-year pair for ${slug} ${mortgageType}.`);
  return found;
}

const rbcUninsured = pair("rbc", "uninsured");
const rbcInsured = pair("rbc", "insured");
const tdUninsured = pair("td", "uninsured");
const cibcUninsured = pair("cibc", "uninsured");
const uninsuredPairs = pairs.filter((item) => item.mortgageType === "uninsured");
const uninsuredFixedOnly = rows.filter(
  (row) => row.term_months === 60 && row.rate_type === "fixed" && row.mortgage_type === "uninsured",
);
const uninsuredFixedByLender = new Map<string, number>();
for (const row of uninsuredFixedOnly) {
  const current = uninsuredFixedByLender.get(row.lender_slug);
  if (current == null || row.rate < current) uninsuredFixedByLender.set(row.lender_slug, row.rate);
}
const uninsuredFixedRates = [...uninsuredFixedByLender.values()];
const todayUninsuredFixedMedian = median(uninsuredFixedRates);

const rbcThree = lowest("rbc", 36, "fixed", "uninsured");
if (!rbcThree) throw new Error("Rate file is missing RBC's 3-year uninsured fixed special.");

export const SPREAD_TABLE = {
  caption: `Five-year fixed minus five-year variable, from data/rates.json, scraped ${RATE_FILE_AS_OF}. Each cell is the lowest row for that lender and insured status. A negative number means the fixed rate in the file is lower than the variable rate.`,
  headers: ["Lender", "Status", "5-year fixed", "5-year variable", "Fixed minus variable"],
  rows: pairs.map((item) => [
    SHORT_LENDER[item.name] ?? item.name,
    item.mortgageType,
    pct(item.fixed),
    pct(item.variable),
    points(item.spread).replace(" points", ""),
  ]),
};

export const SPREAD = {
  pairCount: pairs.length,
  uninsuredPairCount: uninsuredPairs.length,
  medianUninsuredSpread: median(uninsuredPairs.map((item) => item.spread)),
  minSpread: Math.min(...pairs.map((item) => item.spread)),
  maxSpread: Math.max(...pairs.map((item) => item.spread)),
  rbcUninsured,
  rbcInsured,
  tdUninsured,
  cibcUninsured,
  todayUninsuredFixedMedian,
  todayUninsuredFixedLenders: uninsuredFixedRates.length,
  todayUninsuredFixedMin: Math.min(...uninsuredFixedRates),
  todayUninsuredFixedMax: Math.max(...uninsuredFixedRates),
  rbcThreeFixed: rbcThree.rate,
  rbcThreePosted: rbcThree.posted_rate,
  narrowest: narrowestPair,
  widest: widestPair,
};

const lockBalance = 480_000;
const lockYears = 22;
const lockMonths = 36;

function lockRow(hike: number) {
  const variableRate = Math.round((rbcUninsured.variable + hike) * 100) / 100;
  const payment = calculateMonthlyPayment(lockBalance, variableRate, lockYears);
  const interest = interestPaidOverMonths(lockBalance, variableRate, payment, lockMonths);
  return { hike, variableRate, payment, interest: interest.interest, ending: interest.endingBalance };
}

const lockHikes = [0, 0.25, 0.5, 0.75, 1, 1.25].map(lockRow);
const lockedFivePayment = calculateMonthlyPayment(lockBalance, rbcUninsured.fixed, lockYears);
const lockedFiveInterest = interestPaidOverMonths(lockBalance, rbcUninsured.fixed, lockedFivePayment, lockMonths);
const lockedThreePayment = calculateMonthlyPayment(lockBalance, rbcThree.rate, lockYears);
const lockedThreeInterest = interestPaidOverMonths(lockBalance, rbcThree.rate, lockedThreePayment, lockMonths);
const postedGap = cibcUninsured.fixedPosted == null ? null : cibcUninsured.fixedPosted - cibcUninsured.variable;

export const LOCK = {
  balance: lockBalance,
  years: lockYears,
  months: lockMonths,
  flat: lockHikes[0],
  hikes: lockHikes,
  lockedFivePayment,
  lockedFiveInterest: lockedFiveInterest.interest,
  lockedFiveEnd: lockedFiveInterest.endingBalance,
  lockedThreePayment,
  lockedThreeInterest: lockedThreeInterest.interest,
  breakEvenFive: rbcUninsured.spread,
  breakEvenThree: Math.round((rbcThree.rate - rbcUninsured.variable) * 100) / 100,
  quarterMovesFive: rbcUninsured.spread / 0.25,
  postedGap,
  table: {
    caption: `Payments on ${cad(lockBalance)} with 22 years of amortization left, if RBC's uninsured 5-year variable special moves one point for each point of prime and the discount stays put. The locked column is RBC's uninsured 5-year fixed special, held flat. Interest is 36 months on this site's monthly formula.`,
    headers: ["Prime rises by", "Variable rate", "Monthly payment", "Interest over 36 months", "Versus the locked payment"],
    rows: lockHikes.map((row) => [
      row.hike === 0 ? "No change" : points(row.hike).replace(" points", ""),
      pct(row.variableRate),
      cad(row.payment),
      cad(row.interest),
      row.payment >= lockedFivePayment
        ? `${cad(row.payment - lockedFivePayment)} more`
        : `${cad(lockedFivePayment - row.payment)} less`,
    ]),
  },
};

/**
 * Bank of Canada figures checked against Valet on October 23, 2026.
 * Posted: V80691335, conventional 5-year, most typical of the six major banks.
 * Charged: funds advanced, volume-weighted, chartered banks. V122667786 uninsured
 * fixed 5 years and over; V122667780 insured; V122667782 uninsured variable;
 * V122667776 insured variable. Prime: V80691311. Target: V39079.
 */
export const HIST_2022 = {
  postedJan: 4.79,
  postedApr20: 4.99,
  postedMay25: 5.39,
  postedJun15: 5.64,
  postedJun22: 6.04,
  postedJul27: 6.14,
  postedOct19: 6.49,
  postedDec: 6.49,
  primeJan: 2.45,
  primeDec: 6.45,
  targetJan: 0.25,
  targetDec: 4.25,
  uninsuredFixed: { jan: 2.61, jun: 3.7, dec: 5.22 },
  insuredFixed: { jan: 2.52, jun: 3.56, dec: 5.06 },
  uninsuredVariable: { jan: 1.5, jun: 3.17, dec: 6.14 },
  insuredVariable: { jan: 1.47, jun: 3.1, dec: 6.03 },
};

const waveYears = 20;
const waveBalances = [350_000, 500_000, 700_000];
const waveOrigin = HIST_2022.uninsuredFixed.jan;

function waveCell(balance: number, rate: number) {
  return calculateMonthlyPayment(balance, rate, waveYears);
}

export const WAVE_PAYMENTS = {
  years: waveYears,
  origin: waveOrigin,
  today: todayUninsuredFixedMedian,
  table: {
    caption: `Monthly payment with 20 years of amortization left. The 2.61% column is the January 2022 volume-weighted average rate on uninsured fixed mortgages of five years and over that chartered banks advanced. The comparison column is the median of the lowest uninsured 5-year fixed rate at each lender in data/rates.json on ${RATE_FILE_AS_OF}. The balance is the balance at renewal.`,
    headers: ["Balance at renewal", `Payment at ${pct(waveOrigin)}`, `Payment at ${pct(todayUninsuredFixedMedian)}`, "Difference a month", "Difference over 5 years"],
    rows: waveBalances.map((balance) => {
      const oldPayment = waveCell(balance, waveOrigin);
      const newPayment = waveCell(balance, todayUninsuredFixedMedian);
      const gap = newPayment - oldPayment;
      return [cad(balance), cad(oldPayment), cad(newPayment), cad(gap), cad(gap * 60)];
    }),
  },
};

const sampleBalance = 500_000;
const originRates = [
  { label: "January 2022", rate: HIST_2022.uninsuredFixed.jan },
  { label: "June 2022", rate: HIST_2022.uninsuredFixed.jun },
  { label: "December 2022", rate: HIST_2022.uninsuredFixed.dec },
];

export const WAVE_BY_MONTH = {
  balance: sampleBalance,
  table: {
    caption: `Same ${cad(sampleBalance)} balance and 20 years left, at the three months when the Bank published a very different average rate on uninsured fixed funds advanced for terms of five years and over. Today's column is the same median from the rate file.`,
    headers: ["Month the average was advanced", "Average rate then", "Payment then", "Payment at today's median", "Change"],
    rows: originRates.map((item) => {
      const oldPayment = waveCell(sampleBalance, item.rate);
      const newPayment = waveCell(sampleBalance, todayUninsuredFixedMedian);
      const gap = newPayment - oldPayment;
      const change = gap >= 0 ? `${cad(gap)} higher` : `${cad(oldPayment - newPayment)} lower`;
      return [item.label, pct(item.rate), cad(oldPayment), cad(newPayment), change];
    }),
  },
};

const triggerBalance = 500_000;
const triggerYears = 25;
const triggerContract = HIST_2022.uninsuredVariable.jan;
const triggerPayment = calculateMonthlyPayment(triggerBalance, triggerContract, triggerYears);
const triggerRate = (triggerPayment * 12 / triggerBalance) * 100;
const laterRate = HIST_2022.uninsuredVariable.dec;
const laterMonthlyInterest = triggerBalance * (laterRate / 100) / 12;

export const TRIGGER = {
  balance: triggerBalance,
  years: triggerYears,
  contract: triggerContract,
  payment: triggerPayment,
  triggerRate,
  laterRate,
  laterMonthlyInterest,
  shortfall: laterMonthlyInterest - triggerPayment,
};

const portOldBalance = 420_000;
const portOldRate = HIST_2022.uninsuredFixed.jan;
const portIncrease = 160_000;
const portNewRate = rbcThree.rate;
const portTotal = portOldBalance + portIncrease;
const portBlendRaw = (portOldBalance * portOldRate + portIncrease * portNewRate) / portTotal;
const portBlend = Math.round(portBlendRaw * 100) / 100;
const portYears = 20;
const portOldPayment = calculateMonthlyPayment(portOldBalance, portOldRate, portYears);
const portBlendPayment = calculateMonthlyPayment(portTotal, portBlend, portYears);
const portBreakRate = rbcUninsured.fixed;
const portBreakPayment = calculateMonthlyPayment(portTotal, portBreakRate, portYears);
const portPenalty = threeMonthInterestOnBalance(portOldBalance, portOldRate);
const portFiveYearRate = rbcUninsured.fixed;

const cmhcIncrease = 100_000;
const cmhcTotal = 550_000;
const cmhcIncreaseRate = 6.3;
const cmhcTotalRate = 4;
const cmhcOnIncrease = cmhcIncrease * (cmhcIncreaseRate / 100);
const cmhcOnTotal = cmhcTotal * (cmhcTotalRate / 100);
const cmhcPremium = Math.min(cmhcOnIncrease, cmhcOnTotal);
const cmhcNewLoanPremium = cmhcIncrease * (cmhcTotalRate / 100);
const cmhcBlendSurcharge = cmhcIncrease * 0.006;

export const PORT = {
  oldBalance: portOldBalance,
  oldRate: portOldRate,
  increase: portIncrease,
  newRate: portNewRate,
  total: portTotal,
  blendRaw: portBlendRaw,
  blend: portBlend,
  years: portYears,
  monthsLeft: 24,
  oldPayment: portOldPayment,
  blendPayment: portBlendPayment,
  breakRate: portBreakRate,
  breakPayment: portBreakPayment,
  fiveYearRate: portFiveYearRate,
  penalty: portPenalty,
  extraVsOldPiece: portBlendPayment - portOldPayment,
  saveVsBreak: portBreakPayment - portBlendPayment,
  termSaveVsBreak: (portBreakPayment - portBlendPayment) * 24 - portPenalty,
  cmhcIncrease,
  cmhcTotal,
  cmhcIncreaseRate,
  cmhcTotalRate,
  cmhcOnIncrease,
  cmhcOnTotal,
  cmhcPremium,
  cmhcNewLoanPremium,
  cmhcExtraVsNew: cmhcOnIncrease - cmhcNewLoanPremium,
  cmhcBlendSurcharge,
  table: {
    caption: `Dollar-weighted blend on a labelled file: ${cad(portOldBalance)} kept at ${pct(portOldRate)}, which is the January 2022 uninsured five-year-and-over average, and ${cad(portIncrease)} of new money at ${pct(portNewRate)}, RBC's 3-year uninsured fixed special in the rate file. Amortization in every payment row is 20 years. The lender's own blend can differ.`,
    headers: ["Choice", "Balance", "Rate", "Monthly payment"],
    rows: [
      ["Keep only the old piece", cad(portOldBalance), pct(portOldRate), cad(portOldPayment)],
      ["Port and increase, dollar-weighted", cad(portTotal), pct(portBlend), cad(portBlendPayment)],
      ["Break and borrow the whole amount", cad(portTotal), pct(portBreakRate), cad(portBreakPayment)],
    ],
  },
};

const helocValue = 900_000;
const helocMortgage = 500_000;
const helocSixtyFive = helocValue * 0.65;
const helocEighty = helocValue * 0.8;
const helocRoom = helocSixtyFive - helocMortgage;
const helocAmortizingSlice = helocEighty - helocSixtyFive;
const helocMargin = 1;
const helocRate = PRIME_RATE + helocMargin;
const helocDraw = helocRoom;
const helocInterestOnly = helocDraw * (helocRate / 100) / 12;
const helocQualifying = Math.max(helocRate + 2, 5.25);
const helocAmortizingPayment = calculateMonthlyPayment(helocDraw, helocRate, 25);
const helocQualifyingPayment = calculateMonthlyPayment(helocDraw, helocQualifying, 25);

export const HELOC = {
  value: helocValue,
  mortgage: helocMortgage,
  sixtyFive: helocSixtyFive,
  eighty: helocEighty,
  room: helocRoom,
  amortizingSlice: helocAmortizingSlice,
  combinedRoom: helocEighty - helocMortgage,
  margin: helocMargin,
  rate: helocRate,
  prime: PRIME_RATE,
  policy: BOC_POLICY_RATE,
  spread: PRIME_SPREAD,
  draw: helocDraw,
  interestOnly: helocInterestOnly,
  qualifying: helocQualifying,
  amortizingPayment: helocAmortizingPayment,
  qualifyingPayment: helocQualifyingPayment,
  quarter: helocDraw * 0.0025 / 12,
  table: {
    caption: `Limits on a house valued at ${cad(helocValue)} with ${cad(helocMortgage)} still on the mortgage. The 65% and 80% figures are shares of that value. The interest-only line uses prime plus 1.00 point, which is National Bank's posted All-In-One margin, on the revolving room only.`,
    headers: ["Slice", "Amount", "What it can do"],
    rows: [
      ["65% of value", cad(helocSixtyFive), "Ceiling on the revolving piece"],
      ["Mortgage still owing", cad(helocMortgage), "Already secured, and it uses up part of the 65%"],
      ["Revolving room", cad(helocRoom), "What a new HELOC can still revolve, if the lender agrees"],
      ["80% of value", cad(helocEighty), "Ceiling on the mortgage and the line together"],
      ["Slice between 65% and 80%", cad(helocAmortizingSlice), "Must amortize, and principal paid there is not readvanced"],
    ],
  },
};

export { REPORTED, cad, pct };
