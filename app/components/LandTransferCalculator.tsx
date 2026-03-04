"use client";

import { useState, useMemo } from "react";

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
      let provincial = 0;
      // Ontario LTT rates
      if (price <= 55000) {
        provincial = price * 0.005;
      } else if (price <= 250000) {
        provincial = 55000 * 0.005 + (price - 55000) * 0.01;
      } else if (price <= 400000) {
        provincial = 55000 * 0.005 + 195000 * 0.01 + (price - 250000) * 0.015;
      } else if (price <= 2000000) {
        provincial = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + (price - 400000) * 0.02;
      } else {
        provincial = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + 1600000 * 0.02 + (price - 2000000) * 0.025;
      }

      // Toronto Municipal LTT (same rates)
      let municipal = provincial; // Toronto rates mirror provincial exactly

      const explanation = `Ontario: 0.5% on first $55K, 1% on $55K-$250K, 1.5% on $250K-$400K, 2% on $400K-$2M, 2.5% above $2M`;
      
      return { provincial, municipal, explanation };
    },
    firstTimeRebate: (price) => {
      // Ontario max rebate $4,000
      // Toronto max rebate $4,475 (provincial + municipal)
      // For simplicity, we'll calculate Ontario provincial rebate
      const provincialTax = provinces.ontario.calculate(price).provincial;
      return Math.min(4000, provincialTax);
    },
  },
  british_columbia: {
    name: "British Columbia",
    calculate: (price) => {
      let tax = 0;
      if (price <= 200000) {
        tax = price * 0.01;
      } else if (price <= 2000000) {
        tax = 200000 * 0.01 + (price - 200000) * 0.02;
      } else if (price <= 3000000) {
        tax = 200000 * 0.01 + 1800000 * 0.02 + (price - 2000000) * 0.03;
      } else {
        tax = 200000 * 0.01 + 1800000 * 0.02 + 1000000 * 0.03 + (price - 3000000) * 0.05;
      }
      return { provincial: tax, municipal: 0, explanation: "BC: 1% on first $200K, 2% on $200K-$2M, 3% on $2M-$3M, 5% above $3M" };
    },
    firstTimeRebate: (price) => {
      // BC first-time buyer exemption up to $500K, partial to $525K
      if (price <= 500000) {
        return provinces.british_columbia.calculate(price).provincial;
      } else if (price <= 525000) {
        const fullAmount = provinces.british_columbia.calculate(price).provincial;
        // Linear reduction from $500K to $525K
        return fullAmount * ((525000 - price) / 25000);
      }
      return 0;
    },
  },
  alberta: {
    name: "Alberta",
    calculate: (price) => {
      // Alberta has land transfer registration fees only, not a true LTT
      const registrationFee = Math.min(price * 0.002, 500) + 50; // Base + additional
      const mortgageFee = 50; // Simplified
      return { 
        provincial: registrationFee + mortgageFee, 
        municipal: 0, 
        explanation: "Alberta: Registration fees only (~$100-$600 total)" 
      };
    },
    firstTimeRebate: () => 0, // No FTHB rebate
  },
  quebec: {
    name: "Quebec (Without Montreal)",
    calculate: (price) => {
      let tax = 0;
      if (price <= 55500) {
        tax = price * 0.005;
      } else if (price <= 255000) {
        tax = 55500 * 0.005 + (price - 55500) * 0.01;
      } else {
        tax = 55500 * 0.005 + 199500 * 0.01 + (price - 255000) * 0.015;
      }
      return { 
        provincial: tax, 
        municipal: 0, 
        explanation: "Quebec: 0.5% on first $55.5K, 1% on $55.5K-$255K, 1.5% above $255K" 
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
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);

  const results = useMemo(() => {
    const provData = provinces[province];
    const { provincial, municipal: baseMunicipal, explanation } = provData.calculate(homePrice);
    
    // For Ontario, Toronto has additional municipal tax
    let totalMunicipal = baseMunicipal;
    if (province === "ontario" && isToronto) {
      totalMunicipal = provincial; // Toronto LTT equals provincial
    }

    const total = provincial + totalMunicipal;
    const rebate = isFirstTimeBuyer ? provData.firstTimeRebate(homePrice) : 0;
    
    // Toronto adds municipal rebate
    const torontoMunicipalRebate = (province === "ontario" && isToronto && isFirstTimeBuyer) 
      ? Math.min(4475 - 4000, totalMunicipal) 
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
  }, [homePrice, province, isToronto, isFirstTimeBuyer]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Land Transfer Tax Calculator</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              if (e.target.value !== "ontario") setIsToronto(false);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(provinces).map(([key, prov]) => (
              <option key={key} value={key}>{prov.name}</option>
            ))}
          </select>
        </div>

        {province === "ontario" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="toronto"
              checked={isToronto}
              onChange={(e) => setIsToronto(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="toronto" className="text-sm text-gray-700">
              Purchasing in Toronto (includes Municipal LTT)
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Home Purchase Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="firsttime"
            checked={isFirstTimeBuyer}
            onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="firsttime" className="text-sm text-gray-700">
            First-Time Home Buyer (eligible for rebate)
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Provincial Tax</p>
            <p className="font-semibold text-gray-900">${results.provincial.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
          {results.municipal > 0 && (
            <div>
              <p className="text-xs text-gray-600">Municipal Tax</p>
              <p className="font-semibold text-gray-900">${results.municipal.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-600">Total Tax Before Rebate</p>
            <p className="font-semibold text-gray-900">${results.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Rebate</p>
            <p className="font-semibold text-green-700">-${results.rebate.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200 text-center">
          <p className="text-sm text-gray-600">Total Land Transfer Tax Due</p>
          <p className="text-3xl font-bold text-blue-700">
            ${results.finalAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}
          </p>
        </div>      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Rate Structure:</strong> {results.explanation}</p>
        
        {province === "ontario" && isToronto && (
          <p className="mt-2">
            <strong>Toronto Municipal Rebate:</strong> First-time buyers can receive up to $4,475 total rebate 
            ($4,000 provincial + up to $4,475 municipal).
          </p>
        )}

        {province === "ontario" && !isToronto && (
          <p className="mt-2">
            <strong>Ontario Rebate:</strong> First-time buyers receive up to $4,000 rebate on provincial tax.
          </p>
        )}

        {province === "british_columbia" && (
          <p className="mt-2">
            <strong>BC Exemption:</strong> Properties under $500K fully exempt. Partial exemption to $525K.
          </p>
        )}

        <p className="mt-2 italic">
          Disclaimer: This calculator provides estimates. Consult a lawyer or notary for exact amounts.
        </p>
      </div>
    </div>
  );
}
