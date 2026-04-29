'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateMarketRates } from '@/actions/data';
import { useToast } from '@/context/ToastContext';

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
    <form action={formAction} className="glass-panel p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Live Market Rates (USD/oz)</h2>
        <button 
          type="submit" 
          disabled={isPending} 
          className="btn-primary py-2 px-4 text-sm"
        >
          {isPending ? 'Updating...' : 'Update Instantly'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2 font-medium">Platinum (Pt) USD</label>
          <input 
            name="ptUsd" 
            type="number" 
            step="0.01" 
            key={`pt-${initialRates.pt}`}
            defaultValue={initialRates.pt} 
            className="glass-input text-lg font-bold border-blue-500/30" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2 font-medium">Palladium (Pd) USD</label>
          <input 
            name="pdUsd" 
            type="number" 
            step="0.01" 
            key={`pd-${initialRates.pd}`}
            defaultValue={initialRates.pd} 
            className="glass-input text-lg font-bold border-blue-500/30" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2 font-medium">Rhodium (Rh) USD</label>
          <input 
            name="rhUsd" 
            type="number" 
            step="0.01" 
            key={`rh-${initialRates.rh}`}
            defaultValue={initialRates.rh} 
            className="glass-input text-lg font-bold border-blue-500/30" 
            required 
          />
        </div>
      </div>
    </form>
  );
}
