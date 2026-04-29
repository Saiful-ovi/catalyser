'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Calculator, X, ChevronDown, Info } from 'lucide-react';

export default function RefiningCalculator({ initialRates }) {
  // Market Prices
  const [rates, setRates] = useState({
    pt: initialRates?.metals?.pt?.usdPerOunce || 1500,
    pd: initialRates?.metals?.pd?.usdPerOunce || 1500,
    rh: initialRates?.metals?.rh?.usdPerOunce || 1500,
  });

  // Inputs
  const [weight, setWeight] = useState(1.73);
  const [moisture, setMoisture] = useState(3);
  const [ppms, setPpms] = useState({ pt: 1950, pd: 770, rh: 476 });

  // Settings Tabs
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' or 'custom'

  // Calculator Settings (Customizable)
  const [settings, setSettings] = useState({
    lotCharge: 9.18, // Matches Ecotrade's fixed cost component
    shippingFees: 0,
    treatmentCharge: 9.18, // per kg monolith
    returnRates: { pt: 97, pd: 97, rh: 90 },
    minDeductions: { pt: 0, pd: 0, rh: 0 }, // g/t - Set to 0 to match Ecotrade Standard
    refiningCharges: { pt: 0, pd: 0, rh: 0 }, // per kg metal - Set to 0 to match Ecotrade Standard
    usdToAed: 3.6725,
  });

  // Results
  const [results, setResults] = useState({
    materialValue: 0,
    materialValuePerKilo: 0,
    totalCosts: 0,
    totalCostPerKilo: 0,
    returnPerKilo: 0,
    totalReturn: 0,
  });

  const calculate = () => {
    const dryWeight = weight * (1 - moisture / 100);
    const ozToG = 31.1035;
    const ptGramsNoDed = dryWeight * (ppms.pt / 1000);
    const pdGramsNoDed = dryWeight * (ppms.pd / 1000);
    const rhGramsNoDed = dryWeight * (ppms.rh / 1000);

    // 1. Gross Metal Values (100% Recovery, No Deductions)
    const ptGrossValueUsd = ptGramsNoDed * (rates.pt / ozToG);
    const pdGrossValueUsd = pdGramsNoDed * (rates.pd / ozToG);
    const rhGrossValueUsd = rhGramsNoDed * (rates.rh / ozToG);
    
    const totalMaterialValueAed = (ptGrossValueUsd + pdGrossValueUsd + rhGrossValueUsd) * settings.usdToAed;

    // 2. Costs & Deductions
    // Return Rate Losses
    const ptReturnLossAed = ptGrossValueUsd * (1 - settings.returnRates.pt / 100) * settings.usdToAed;
    const pdReturnLossAed = pdGrossValueUsd * (1 - settings.returnRates.pd / 100) * settings.usdToAed;
    const rhReturnLossAed = rhGrossValueUsd * (1 - settings.returnRates.rh / 100) * settings.usdToAed;

    // Minimum Deduction Losses
    const ptMinDedLossAed = (dryWeight * (Math.min(ppms.pt, settings.minDeductions.pt) / 1000)) * (rates.pt / ozToG) * settings.usdToAed;
    const pdMinDedLossAed = (dryWeight * (Math.min(ppms.pd, settings.minDeductions.pd) / 1000)) * (rates.pd / ozToG) * settings.usdToAed;
    const rhMinDedLossAed = (dryWeight * (Math.min(ppms.rh, settings.minDeductions.rh) / 1000)) * (rates.rh / ozToG) * settings.usdToAed;

    // Refining Costs (assuming input is already in AED per kg of metal)
    const ptRefiningCost = (ptGramsNoDed / 1000) * settings.refiningCharges.pt;
    const pdRefiningCost = (pdGramsNoDed / 1000) * settings.refiningCharges.pd;
    const rhRefiningCost = (rhGramsNoDed / 1000) * settings.refiningCharges.rh;

    const treatmentCost = weight * settings.treatmentCharge;
    
    const totalCosts = settings.lotCharge + settings.shippingFees + treatmentCost + 
                       ptReturnLossAed + pdReturnLossAed + rhReturnLossAed +
                       ptMinDedLossAed + pdMinDedLossAed + rhMinDedLossAed +
                       ptRefiningCost + pdRefiningCost + rhRefiningCost;

    const totalReturnAed = totalMaterialValueAed - totalCosts;

    setResults({
      materialValue: totalMaterialValueAed,
      materialValuePerKilo: totalMaterialValueAed / weight,
      totalCosts: totalCosts,
      totalCostPerKilo: totalCosts / weight,
      returnPerKilo: totalReturnAed / weight,
      totalReturn: totalReturnAed,
    });
  };

  useEffect(() => {
    calculate();
  }, [weight, moisture, ppms, rates, settings]);

  const reset = () => {
    setWeight(0);
    setMoisture(0);
    setPpms({ pt: 0, pd: 0, rh: 0 });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto">
      {/* Market Prices Header */}
      <div className="glass-panel p-4 sm:p-6 border-green-500/20">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 text-green-400">
            <Calculator className="w-5 h-5" />
            <h2 className="text-base sm:text-xl font-bold uppercase tracking-wider">Refining Calculator</h2>
          </div>
          <button onClick={() => setRates({ pt: 1500, pd: 1500, rh: 1500 })} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <input
              type="number"
              value={rates.pt}
              onChange={(e) => setRates({ ...rates, pt: parseFloat(e.target.value) || 0 })}
              className="bg-transparent text-lg sm:text-2xl font-bold text-white w-full text-center focus:outline-none border-b border-slate-700 focus:border-green-500"
            />
            <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">Platinum (Pt)</p>
          </div>
          <div>
            <input
              type="number"
              value={rates.pd}
              onChange={(e) => setRates({ ...rates, pd: parseFloat(e.target.value) || 0 })}
              className="bg-transparent text-lg sm:text-2xl font-bold text-white w-full text-center focus:outline-none border-b border-slate-700 focus:border-green-500"
            />
            <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">Palladium (Pd)</p>
          </div>
          <div>
            <input
              type="number"
              value={rates.rh}
              onChange={(e) => setRates({ ...rates, rh: parseFloat(e.target.value) || 0 })}
              className="bg-transparent text-lg sm:text-2xl font-bold text-white w-full text-center focus:outline-none border-b border-slate-700 focus:border-green-500"
            />
            <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">Rhodium (Rh)</p>
          </div>
        </div>
      </div>

      {/* Main UI Area */}
      <div className="glass-panel p-0 overflow-hidden border-slate-800">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'standard' ? 'text-white bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Ecotrade Standard
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'custom' ? 'text-white bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Customized Settings
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'standard' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-sm">Material value</span>
                <span className="font-mono text-lg">{results.materialValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500">AED</span></span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">Material value / kilo</span>
                <span className="font-mono">{results.materialValuePerKilo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500">AED</span></span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800/50">
                <span className="text-sm">Total costs</span>
                <span className="font-mono text-lg text-red-400">{results.totalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500">AED</span></span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">Total cost / kilo</span>
                <span className="font-mono">{results.totalCostPerKilo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500">AED</span></span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800/50">
                <span className="text-sm">Return / kilo</span>
                <span className="font-mono text-lg text-green-400">{results.returnPerKilo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500">AED</span></span>
              </div>
              <div className="flex justify-between items-center text-white font-bold pt-4 border-t border-slate-700">
                <span className="text-base">Total return</span>
                <span className="text-xl sm:text-2xl font-mono text-green-500">{results.totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400">AED</span></span>
              </div>
              <div className="flex justify-center pt-2">
                <ChevronDown className="w-5 h-5 text-slate-600 animate-bounce" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Lot charge (AED)</label>
                  <input type="number" value={settings.lotCharge} onChange={(e) => setSettings({...settings, lotCharge: parseFloat(e.target.value) || 0})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Shipping Fees (AED)</label>
                  <input type="number" value={settings.shippingFees} onChange={(e) => setSettings({...settings, shippingFees: parseFloat(e.target.value) || 0})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Treatment charge / monolith kg</label>
                  <input type="number" value={settings.treatmentCharge} onChange={(e) => setSettings({...settings, treatmentCharge: parseFloat(e.target.value) || 0})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">USD to AED Exchange Rate</label>
                  <input type="number" step="0.0001" value={settings.usdToAed} onChange={(e) => setSettings({...settings, usdToAed: parseFloat(e.target.value) || 0})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="border-t border-slate-800 pt-2 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Return rate (PT) %</label>
                  <input type="number" value={settings.returnRates.pt} onChange={(e) => setSettings({...settings, returnRates: {...settings.returnRates, pt: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Min Deduction (PT) g/t</label>
                  <input type="number" value={settings.minDeductions.pt} onChange={(e) => setSettings({...settings, minDeductions: {...settings.minDeductions, pt: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Return rate (PD) %</label>
                  <input type="number" value={settings.returnRates.pd} onChange={(e) => setSettings({...settings, returnRates: {...settings.returnRates, pd: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Min Deduction (PD) g/t</label>
                  <input type="number" value={settings.minDeductions.pd} onChange={(e) => setSettings({...settings, minDeductions: {...settings.minDeductions, pd: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Return rate (RH) %</label>
                  <input type="number" value={settings.returnRates.rh} onChange={(e) => setSettings({...settings, returnRates: {...settings.returnRates, rh: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Min Deduction (RH) g/t</label>
                  <input type="number" value={settings.minDeductions.rh} onChange={(e) => setSettings({...settings, minDeductions: {...settings.minDeductions, rh: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Refining charge / PT kg</label>
                  <input type="number" value={settings.refiningCharges.pt} onChange={(e) => setSettings({...settings, refiningCharges: {...settings.refiningCharges, pt: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Refining charge / PD kg</label>
                  <input type="number" value={settings.refiningCharges.pd} onChange={(e) => setSettings({...settings, refiningCharges: {...settings.refiningCharges, pd: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Refining charge / RH kg</label>
                  <input type="number" value={settings.refiningCharges.rh} onChange={(e) => setSettings({...settings, refiningCharges: {...settings.refiningCharges, rh: parseFloat(e.target.value) || 0}})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Fields */}
      <div className="glass-panel p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-4 sm:gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              Weight <span>Kg</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent border-b border-slate-700 text-xl sm:text-2xl font-mono text-white focus:border-green-500 focus:outline-none py-1"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              Moisture <span>%</span>
            </label>
            <input
              type="number"
              value={moisture}
              onChange={(e) => setMoisture(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent border-b border-slate-700 text-xl sm:text-2xl font-mono text-white focus:border-green-500 focus:outline-none py-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase text-center block">PT</label>
            <input
              type="number"
              value={ppms.pt}
              onChange={(e) => setPpms({ ...ppms, pt: parseFloat(e.target.value) || 0 })}
              className="w-full bg-transparent border-b border-slate-700 text-lg sm:text-xl font-mono text-white text-center focus:border-green-500 focus:outline-none py-1"
            />
            <p className="text-[10px] text-slate-600 font-bold text-center">PPM</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase text-center block">PD</label>
            <input
              type="number"
              value={ppms.pd}
              onChange={(e) => setPpms({ ...ppms, pd: parseFloat(e.target.value) || 0 })}
              className="w-full bg-transparent border-b border-slate-700 text-lg sm:text-xl font-mono text-white text-center focus:border-green-500 focus:outline-none py-1"
            />
            <p className="text-[10px] text-slate-600 font-bold text-center">PPM</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase text-center block">RH</label>
            <input
              type="number"
              value={ppms.rh}
              onChange={(e) => setPpms({ ...ppms, rh: parseFloat(e.target.value) || 0 })}
              className="w-full bg-transparent border-b border-slate-700 text-lg sm:text-xl font-mono text-white text-center focus:border-green-500 focus:outline-none py-1"
            />
            <p className="text-[10px] text-slate-600 font-bold text-center">PPM</p>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={calculate}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]"
        >
          Calculate
        </button>
        <button
          onClick={reset}
          className="px-6 sm:px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 sm:py-4 rounded-xl transition-all active:scale-[0.98]"
        >
          Clear
        </button>
      </div>

      <div className="text-[10px] text-slate-500 flex items-center justify-center space-x-1 opacity-50">
        <Info className="w-3 h-3" />
        <span>Calculation logic follows Ecotrade standards. No data is stored.</span>
      </div>
    </div>
  );
}
