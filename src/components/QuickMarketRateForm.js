'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateMarketRates } from '@/actions/data';
import { useToast } from '@/context/ToastContext';
import { Activity, Zap, RefreshCw } from 'lucide-react';

export default function QuickMarketRateForm({ initialRates }) {
  const [state, formAction, isPending] = useActionState(updateMarketRatesClient, null);
  const toast = useToast();

  // We wrap the server action to handle the FormData mapping on the client side
  async function updateMarketRatesClient(prevState, formData) {
    const rates = {
      pt: parseFloat(formData.get('ptUsd')),
      pd: parseFloat(formData.get('pdUsd')),
      rh: parseFloat(formData.get('rhUsd')),
    };
    const res = await updateMarketRates(rates);
    if (res?.success) {
      toast.success('Market rates updated instantly!');
    }
    return res;
  }

  return (
    <form action={formAction} className="glass-panel p-6 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-blue-500/10"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Live Market Rates (USD/oz)
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Real-time metal values</p>
        </div>
        
        {/* Desktop Button */}
        <div className="hidden sm:block">
          <button 
            type="submit" 
            disabled={isPending} 
            className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 group/btn shadow-blue-500/10"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 group-hover/btn:fill-current transition-all" />
                Update Instantly
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group/input">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider group-focus-within/input:text-blue-400 transition-colors">
            Platinum (Pt) USD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-blue-400/50 font-bold text-sm">Pt</span>
            </div>
            <input 
              name="ptUsd" 
              type="number" 
              step="0.01" 
              key={`pt-${initialRates.pt}`}
              defaultValue={initialRates.pt} 
              className="glass-input-icon text-lg font-bold border-slate-700/50 hover:border-blue-500/30 focus:border-blue-500 transition-all shadow-inner" 
              required 
            />
          </div>
        </div>
        
        <div className="relative group/input">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider group-focus-within/input:text-indigo-400 transition-colors">
            Palladium (Pd) USD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-indigo-400/50 font-bold text-sm">Pd</span>
            </div>
            <input 
              name="pdUsd" 
              type="number" 
              step="0.01" 
              key={`pd-${initialRates.pd}`}
              defaultValue={initialRates.pd} 
              className="glass-input-icon text-lg font-bold border-slate-700/50 hover:border-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner" 
              required 
            />
          </div>
        </div>
        
        <div className="relative group/input">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider group-focus-within/input:text-purple-400 transition-colors">
            Rhodium (Rh) USD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-purple-400/50 font-bold text-sm">Rh</span>
            </div>
            <input 
              name="rhUsd" 
              type="number" 
              step="0.01" 
              key={`rh-${initialRates.rh}`}
              defaultValue={initialRates.rh} 
              className="glass-input-icon text-lg font-bold border-slate-700/50 hover:border-purple-500/30 focus:border-purple-500 transition-all shadow-inner" 
              required 
            />
          </div>
        </div>
      </div>

      {/* Mobile Button */}
      <div className="mt-8 sm:hidden">
        <button 
          type="submit" 
          disabled={isPending} 
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group/btn shadow-blue-500/20"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Updating Market...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 group-hover/btn:fill-current transition-all" />
              Update Instantly
            </>
          )}
        </button>
      </div>
    </form>
  );
}
