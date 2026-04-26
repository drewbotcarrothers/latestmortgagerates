"use client";

import { useState, useMemo } from "react";

interface ClosingCostsParams {
  homePrice: number;
  province: string;
  isToronto: boolean;
  isFirstTimeBuyer: boolean;
  downPayment: number;
  legalFees: number;
  homeInspection: number;
  appraisalFee: number;
  titleInsurance: number;
  movingCosts: number;
  otherCosts: number;
}

interface ClosingCostsResult {
  downPaymentAmount: number;
  landTransferTax: number;
  rebate: number;
  legalFees: number;
  otherCosts: number;
  totalClosingCosts: number;
  totalCashNeeded: number;
  percentageOfPrice: number;
}

const PROVINCES: Record<string, { name: string; hasLtt: boolean }> = {
  ontario: { name: "Ontario", hasLtt: true },
  british_columbia: { name: "British Columbia", hasLtt: true },
  alberta: { name: "Alberta", hasLtt: false },
  quebec: { name: "Quebec", hasLtt: true },
  manitoba: { name: "Manitoba", hasLtt: true },
  saskatchewan: { name: "Saskatchewan", hasLtt: false },
  nova_scotia: { name: "Nova Scotia", hasLtt: true },
  new_brunswick: { name: "New Brunswick", hasLtt: true },
  newfoundland: { name: "Newfoundland & Labrador", hasLtt: true },
  pei: { name: "Prince Edward Island", hasLtt: true },
};

export default function ClosingCostsCalculator() {
  const [params, setParams] = useState<ClosingCostsParams>({
    homePrice: 800000,
    province: "ontario",
    isToronto: false,
    isFirstTimeBuyer: false,
    downPayment: 20,
    legalFees: 1500,
    homeInspection: 500,
    appraisalFee: 300,
    titleInsurance: 250,
    movingCosts: 1500,
    otherCosts: 500,
  });

  const results = useMemo((): ClosingCostsResult => {
    // Calculate down payment
    const downPaymentAmount = params.homePrice * (params.downPayment / 100);
    
    // Calculate land transfer tax
    let landTransferTax = 0;
    const price = params.homePrice;
    
    if (params.province === "ontario") {
      // Ontario LTT
      if (price <= 55000) {
        landTransferTax = price * 0.005;
      } else if (price <= 250000) {
        landTransferTax = 55000 * 0.005 + (price - 55000) * 0.01;
      } else if (price <= 400000) {
        landTransferTax = 55000 * 0.005 + 195000 * 0.01 + (price - 250000) * 0.015;
      } else if (price <= 2000000) {
        landTransferTax = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + (price - 400000) * 0.02;
      } else {
        landTransferTax = 55000 * 0.005 + 195000 * 0.01 + 150000 * 0.015 + 1600000 * 0.02 + (price - 2000000) * 0.025;
      }
      
      // Toronto municipal tax
      if (params.isToronto) {
        landTransferTax *= 2; // Municipal + Provincial
      }
    } else if (params.province === "british_columbia") {
      // BC Property Transfer Tax
      if (price <= 200000) {
        landTransferTax = price * 0.01;
      } else if (price <= 2000000) {
        landTransferTax = 200000 * 0.01 + (price - 200000) * 0.02;
      } else if (price <= 3000000) {
        landTransferTax = 200000 * 0.01 + 1800000 * 0.02 + (price - 2000000) * 0.03;
      } else {
        landTransferTax = 200000 * 0.01 + 1800000 * 0.02 + 1000000 * 0.03 + (price - 3000000) * 0.05;
      }
    } else if (params.province === "quebec") {
      // Quebec (outside Montreal)
      if (price <= 55500) {
        landTransferTax = price * 0.005;
      } else if (price <= 255000) {
        landTransferTax = 55500 * 0.005 + (price - 55500) * 0.01;
      } else {
        landTransferTax = 55500 * 0.005 + 199500 * 0.01 + (price - 255000) * 0.015;
      }
    } else if (params.province === "manitoba") {
      // Manitoba
      if (price <= 30000) {
        landTransferTax = 0;
      } else if (price <= 90000) {
        landTransferTax = (price - 30000) * 0.005;
      } else if (price <= 150000) {
        landTransferTax = 300 + (price - 90000) * 0.01;
      } else if (price <= 200000) {
        landTransferTax = 900 + (price - 150000) * 0.015;
      } else {
        landTransferTax = 1650 + (price - 200000) * 0.02;
      }
    } else if (params.province === "nova_scotia") {
      // Nova Scotia - varies by municipality, using average
      landTransferTax = price * 0.015; // Approximate
    } else if (params.province === "new_brunswick") {
      // New Brunswick
      landTransferTax = price * 0.01; // 1% of assessed value
    } else if (params.province === "newfoundland") {
      // Newfoundland
      landTransferTax = 100 + (price > 500 ? (price - 500) * 0.004 : 0);
    } else if (params.province === "pei") {
      // PEI
      if (price <= 30000) {
        landTransferTax = 0;
      } else {
        landTransferTax = price * 0.01;
      }
    }
    // Alberta and Saskatchewan have only registration fees (minimal)
    
    // Calculate rebate
    let rebate = 0;
    if (params.isFirstTimeBuyer) {
      if (params.province === "ontario") {
        rebate = Math.min(4000, landTransferTax / (params.isToronto ? 2 : 1));
        if (params.isToronto) {
          rebate = Math.min(4475, landTransferTax); // Toronto has additional municipal rebate
        }
      } else if (params.province === "british_columbia") {
        // Full exemption up to $500k, partial to $525k
        if (price <= 500000) {
          rebate = landTransferTax;
        } else if (price <= 525000) {
          rebate = landTransferTax * ((525000 - price) / 25000);
        }
      } else if (params.province === "pei") {
        // Full exemption
        if (price <= 200000) {
          rebate = landTransferTax;
        }
      }
    }
    
    const otherCosts = params.legalFees + params.homeInspection + params.appraisalFee + 
      params.titleInsurance + params.movingCosts + params.otherCosts;
    
    const totalClosingCosts = landTransferTax - rebate + otherCosts;
    const totalCashNeeded = downPaymentAmount + totalClosingCosts;
    const percentageOfPrice = (totalCashNeeded / params.homePrice) * 100;
    
    return {
      downPaymentAmount: Math.round(downPaymentAmount),
      landTransferTax: Math.round(landTransferTax),
      rebate: Math.round(rebate),
      legalFees: params.legalFees,
      otherCosts,
      totalClosingCosts: Math.round(totalClosingCosts),
      totalCashNeeded: Math.round(totalCashNeeded),
      percentageOfPrice: Math.round(percentageOfPrice * 100) / 100,
    };
  }, [params]);

  const formatCurrency = (value: number) => 
    `$${value.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Home Details */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-sm">🏠</span>
              Home Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={params.homePrice}
                    onChange={(e) => setParams({ ...params, homePrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    step="10000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                <select
                  value={params.province}
                  onChange={(e) => {
                    const newProvince = e.target.value;
                    setParams({ 
                      ...params, 
                      province: newProvince,
                      isToronto: newProvince !== 'ontario' ? false : params.isToronto
                    });
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  {Object.entries(PROVINCES).map(([key, prov]) => (
                    <option key={key} value={key}>{prov.name}</option>
                  ))}
                </select>
              </div>
              
              {params.province === "ontario" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="toronto"
                    checked={params.isToronto}
                    onChange={(e) => setParams({ ...params, isToronto: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300"
                  />
                  <label htmlFor="toronto" className="text-sm text-slate-700">
                    Purchasing in Toronto (municipal LTT applies)
                  </label>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="firstTime"
                  checked={params.isFirstTimeBuyer}
                  onChange={(e) => setParams({ ...params, isFirstTimeBuyer: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300"
                />
                <label htmlFor="firstTime" className="text-sm text-slate-700">
                  First-Time Home Buyer (eligible for rebates)
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment %</label>
                <div className="relative">
                  <input
                    type="number"
                    value={params.downPayment}
                    onChange={(e) => setParams({ ...params, downPayment: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    min="5"
                    max="100"
                    step="5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum: {params.homePrice > 500000 ? '10%' : '5%'} for homes over $500K
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Closing Costs */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm">📋</span>
              Closing Costs
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Legal Fees</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.legalFees}
                      onChange={(e) => setParams({ ...params, legalFees: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Home Inspection</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.homeInspection}
                      onChange={(e) => setParams({ ...params, homeInspection: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Appraisal Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.appraisalFee}
                      onChange={(e) => setParams({ ...params, appraisalFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title Insurance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.titleInsurance}
                      onChange={(e) => setParams({ ...params, titleInsurance: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Moving Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.movingCosts}
                      onChange={(e) => setParams({ ...params, movingCosts: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Other Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={params.otherCosts}
                      onChange={(e) => setParams({ ...params, otherCosts: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="mt-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Total Cash Needed</h3>
            <p className="text-4xl font-bold text-emerald-400">{formatCurrency(results.totalCashNeeded)}</p>
            <p className="text-slate-400 mt-2">{results.percentageOfPrice}% of purchase price</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-1">Down Payment</p>
              <p className="text-xl font-bold">{formatCurrency(results.downPaymentAmount)}</p>
              <p className="text-xs text-slate-400">{params.downPayment}% of price</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-1">Land Transfer Tax</p>
              <p className="text-xl font-bold">{formatCurrency(results.landTransferTax)}</p>
              {results.rebate > 0 && (
                <p className="text-xs text-emerald-400">
                  -{formatCurrency(results.rebate)} rebate
                </p>
              )}
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-1">Other Closing Costs</p>
              <p className="text-xl font-bold">{formatCurrency(results.totalClosingCosts - results.landTransferTax + results.rebate)}</p>
              <p className="text-xs text-slate-400">Legal, inspection, etc.</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total Closing Costs (excluding down payment)</span>
              <span className="text-xl font-bold text-amber-400">{formatCurrency(results.totalClosingCosts)}</span>
            </div>
          </div>
        </div>
        
        {/* Tips */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-900 mb-2">💡 Budgeting Tips</h4>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>• Budget 1.5-4% of purchase price for closing costs</li>
            <li>• First-time buyers may qualify for land transfer tax rebates</li>
            <li>• Some lenders offer cashback to help with closing costs</li>
            <li>• Get multiple quotes for legal fees (can vary by $500+)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
