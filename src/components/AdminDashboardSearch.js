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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search by Model or Brand..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
        />
      </div>

      {query && (
        <div className="glass-panel p-0 overflow-hidden border-blue-500/20">
          <div className="bg-blue-500/5 px-6 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-400">Search Results</span>
            <span className="text-xs text-slate-500">{filtered.length} found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Model / Brand</th>
                  <th className="px-6 py-4 font-bold">Weight (g)</th>
                  <th className="px-6 py-4 font-bold">Pt / Pd / Rh Value</th>
                  <th className="px-6 py-4 font-bold text-right">Final Price (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map(cat => (
                  <tr key={cat.id} className="text-slate-300 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{cat.modelNumber}</div>
                      <div className="text-xs text-slate-500">{cat.brandName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {cat.weightGram}g
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono text-slate-400">
                        {cat.pricing.pt_value.toFixed(2)} / {cat.pricing.pd_value.toFixed(2)} / {cat.pricing.rh_value.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white text-lg">
                      {cat.pricing.final_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">
                      No results found for "{query}"
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
