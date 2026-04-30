'use client';

import { useState } from 'react';
import { Search, Info, Package, Zap } from 'lucide-react';

export default function AdminDashboardSearch({ data }) {
  const [query, setQuery] = useState('');

  const filtered = data.filter(cat => 
    cat.modelNumber.toLowerCase().includes(query.toLowerCase()) ||
    cat.brandName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by Model or Brand..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-600 shadow-2xl backdrop-blur-sm text-lg"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {query && (
        <div className="glass-panel overflow-hidden border-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/5 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Search Results</span>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">{filtered.length} found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/30 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-4">Model / Brand</th>
                  <th className="px-6 py-4 text-center">Weight (g)</th>
                  <th className="px-6 py-4 text-center">Pt / Pd / Rh Value</th>
                  <th className="px-6 py-4 text-right">Final Price (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(cat => (
                  <tr key={cat.id} className="text-slate-300 hover:bg-blue-500/[0.03] transition-colors group cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="font-black text-white group-hover:text-blue-400 transition-colors text-base">{cat.modelNumber}</div>
                      <div className="text-xs text-slate-500 font-medium">{cat.brandName}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                        {cat.weightGram}g
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-[10px] font-black text-slate-500 space-x-1">
                        <span className="text-blue-400/70">{cat.pricing.pt_value.toFixed(2)}</span>
                        <span>/</span>
                        <span className="text-indigo-400/70">{cat.pricing.pd_value.toFixed(2)}</span>
                        <span>/</span>
                        <span className="text-purple-400/70">{cat.pricing.rh_value.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="font-black text-white text-xl tracking-tight group-hover:scale-105 transition-transform origin-right">
                        {cat.pricing.final_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] text-slate-500 ml-1 font-bold">AED</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                          <Info className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-medium italic">No matches found for "{query}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
