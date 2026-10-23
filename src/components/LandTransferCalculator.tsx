"use client";

import { useState, useMemo } from "react";
import {
  albertaLandTitlesFee,
  calculateBcFthbExemption,
  calculateBcPropertyTransferTax,
  ontarioFirstTimeRebates,
  ontarioProvincialLandTransferTax,
  montrealWelcomeTax,
  quebecWelcomeTaxOutsideMontreal,
} from "@/lib/mortgageMath";

interface LandTransferTax {
  province: string;
  municipal: string;
  total: number;
  firstTimeRebate: number;
  finalAmount: number;
  rateExplanation: string;
}

interface ProvinceRates {
  name: string;
  calculate: (price: number) => { provincial: number; municipal: number; explanation: string };
  firstTimeRebate: (price: number) => number;
}

const provinces: Record<string, ProvinceRates> = {
  ontario: {
    name: "Ontario",
    calculate: (price) => {
      const provincial = ontarioProvincialLandTransferTax(price);
      const explanation = `Ontario: 0.5% on first $55K, 1% on $55K-$250K, 1.5% on $250K-$400K, 2% on $400K-$2M, 2.5% above $2M`;
      return { provincial, municipal: 0, explanation };
    },
    firstTimeRebate: (price) => {
      return ontarioFirstTimeRebates(ontarioProvincialLandTransferTax(price), 0).provincial;
    },
  },
  british_columbia: {
    name: "British Columbia",
    calculate: (price) => {
      const tax = calculateBcPropertyTransferTax(price);
      return { provincial: tax, municipal: 0, explanation: "BC: 1% on first $200K, 2% on $200K-$2M, 3% on $2M-$3M, 5% above $3M" };
    },
    firstTimeRebate: (price) => {
      // Registrations on or after 1 April 2024: $8,000 cap through $835K, phase-out under $860K.
      return calculateBcFthbExemption(price);
    },
  },
  alberta: {
    name: "Alberta",
    calculate: (price) => {
      const registrationFee = albertaLandTitlesFee(price);
      return {
        provincial: registrationFee,
        municipal: 0,
        explanation: "Alberta has no land transfer tax. This is the Land Titles fee on the transfer for submissions on or after 1 October 2026: $50 plus $5 per $5,000 or part. A mortgage registration is a separate instrument.",
      };
    },
    firstTimeRebate: () => 0, // No FTHB rebate
  },
  quebec: {
    name: "Quebec (Without Montreal)",
    calculate: (price) => {
      return {
        provincial: quebecWelcomeTaxOutsideMontreal(price),
        municipal: 0,
        explanation: "Quebec 2026 baseline, indexed 2.3438%: 0.5% to $62,900, 1% to $315,000, 1.5% above. Check Montreal for the higher brackets. Not the Revenu Québec credit.",
      };
    },
    firstTimeRebate: (price) => {
      // Quebec has different FTHB rules by municipality
      // Simplified: up to $5,000 rebate outside Montreal
      const tax = provinces.quebec.calculate(price).provincial;
      return Math.min(5000, tax);
    },
  },
};

export default function LandTransferTaxCalculator() {
  const [homePrice, setHomePrice] = useState(600000);
  const [province, setProvince] = useState("ontario");
  const [isToronto, setIsToronto] = useState(false);
  const [isMontreal, setIsMontreal] = useState(false);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);

  const results = useMemo(() => {
    const provData = provinces[province];
    const calculated = provData.calculate(homePrice);
    const provincial =
      province === "quebec" && isMontreal ? montrealWelcomeTax(homePrice) : calculated.provincial;
    const baseMunicipal = calculated.municipal;
    const explanation =
      province === "quebec" && isMontreal
        ? "Montreal 2026 duties: baseline until $552,300, then 2% to $1,104,700, 2.5% to $2,136,500, 3.5% to $3,113,000, and 4% above. The city's $700,000 example is $9,349."
        : calculated.explanation;
    
    // For Ontario, Toronto has additional municipal tax
    let totalMunicipal = baseMunicipal;
    if (province === "ontario" && isToronto) {
      totalMunicipal = provincial; // Toronto LTT equals provincial
    }

    const total = provincial + totalMunicipal;
    const rebate = isFirstTimeBuyer ? provData.firstTimeRebate(homePrice) : 0;
    
    // Toronto adds municipal rebate
    const torontoMunicipalRebate = (province === "ontario" && isToronto && isFirstTimeBuyer)
      ? ontarioFirstTimeRebates(0, totalMunicipal).municipal
      : 0;
    
    const totalRebate = rebate + torontoMunicipalRebate;

    return {
      provincial,
      municipal: totalMunicipal,
      total,
      rebate: totalRebate,
      finalAmount: Math.max(0, total - totalRebate),
      explanation,
    };
  }, [homePrice, province, isToronto, isMontreal, isFirstTimeBuyer]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Land Transfer Tax Calculator</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Province
          </label>
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              if (e.target.value !== "ontario") setIsToronto(false);
              if (e.target.value !== "quebec") setIsMontreal(false);
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {Object.entries(provinces).map(([key, prov]) => (
              <option key={key} value={key}>{prov.name}</option>
            ))}
          </select>
        </div>

        {province === "quebec" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="montreal"
              checked={isMontreal}
              onChange={(e) => setIsMontreal(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300"
            />
            <label htmlFor="montreal" className="text-sm text-slate-700">
              Purchasing in Montreal (higher welcome-tax brackets)
            </label>
          </div>
        )}

        {province === "ontario" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="toronto"
              checked={isToronto}
              onChange={(e) => setIsToronto(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300"
            />
            <label htmlFor="toronto" className="text-sm text-slate-700">
              Purchasing in Toronto (includes Municipal LTT)
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Home Purchase Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="firsttime"
            checked={isFirstTimeBuyer}
            onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded border-slate-300"
          />
          <label htmlFor="firsttime" className="text-sm text-slate-700">
            First-Time Home Buyer (eligible for rebate)
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-teal-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600">Provincial Tax</p>
            <p className="font-semibold text-slate-900">${results.provincial.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
          {results.municipal > 0 && (
            <div>
              <p className="text-xs text-slate-600">Municipal Tax</p>
              <p className="font-semibold text-slate-900">${results.municipal.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-600">Total Tax Before Rebate</p>
            <p className="font-semibold text-slate-900">${results.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Rebate</p>
            <p className="font-semibold text-green-700">-${results.rebate.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-teal-200 text-center">
          <p className="text-sm text-slate-600">Total Land Transfer Tax Due</p>
          <p className="text-3xl font-bold text-blue-700">
            ${results.finalAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </p>
        </div>      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p><strong>Rate Structure:</strong> {results.explanation}</p>
        
        {province === "ontario" && isToronto && (
          <p className="mt-2">
            <strong>Toronto rebates:</strong> A qualifying first-time buyer can receive up to $4,000 of the provincial tax and up to $4,475 of the municipal tax, $8,475 combined. The municipal rebate does not replace the provincial one.
          </p>
        )}

        {province === "ontario" && !isToronto && (
          <p className="mt-2">
            <strong>Ontario Rebate:</strong> First-time buyers receive up to $4,000 rebate on provincial tax.
          </p>
        )}

        {province === "british_columbia" && (
          <p className="mt-2">
            <strong>BC Exemption (on or after 1 April 2024):</strong> Full exemption on the first
            $500,000 of fair market value (max $8,000). Homes at or below $835,000 still get that
            $8,000 cap; the exemption phases out between $835,000 and $860,000.
          </p>
        )}

        <p className="mt-2 italic">
          Disclaimer: This calculator provides estimates. Consult a lawyer or notary for exact amounts.
        </p>
      </div>
    </div>
  );
}
