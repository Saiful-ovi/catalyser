'use client';

import { useTransition } from 'react';
import { updateSettings } from '@/actions/data';
import { useToast } from '@/context/ToastContext';

export default function SettingsForm({ initialSettings }) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  async function action(formData) {
    const newSettings = {
      usdToAed: parseFloat(formData.get('usdToAed')),
      ounceToGram: parseFloat(formData.get('ounceToGram')),
      treatmentCharge: parseFloat(formData.get('treatmentCharge')),
      serviceMargin: parseFloat(formData.get('serviceMargin')),
      metals: {
        pt: {
          usdPerOunce: parseFloat(formData.get('ptUsd')),
          returnRate: parseFloat(formData.get('ptReturn')),
          refiningCharge: parseFloat(formData.get('ptRefining')),
        },
        pd: {
          usdPerOunce: parseFloat(formData.get('pdUsd')),
          returnRate: parseFloat(formData.get('pdReturn')),
          refiningCharge: parseFloat(formData.get('pdRefining')),
        },
        rh: {
          usdPerOunce: parseFloat(formData.get('rhUsd')),
          returnRate: parseFloat(formData.get('rhReturn')),
          refiningCharge: parseFloat(formData.get('rhRefining')),
        }
      }
    };
    
    startTransition(async () => {
      await updateSettings(newSettings);
      toast.success('Settings updated successfully!');
    });
  }

  return (
    <form action={action} className="space-y-8">
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-white mb-6">General Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">USD to AED Rate</label>
            <input name="usdToAed" type="number" step="0.0001" defaultValue={initialSettings.usdToAed} className="glass-input" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Ounce to Gram Rate</label>
            <input name="ounceToGram" type="number" step="0.0000001" defaultValue={initialSettings.ounceToGram} className="glass-input" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Treatment Charge (AED per KG)</label>
            <input name="treatmentCharge" type="number" step="0.01" defaultValue={initialSettings.treatmentCharge} className="glass-input" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Service Margin (%)</label>
            <input name="serviceMargin" type="number" step="0.01" defaultValue={initialSettings.serviceMargin} className="glass-input" required />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-white mb-6">Market Rates & Metal Settings</h2>
        
        <div className="space-y-8">
          {['pt', 'pd', 'rh'].map((metal) => (
            <div key={metal} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white uppercase mb-4">{metal === 'pt' ? 'Platinum (Pt)' : metal === 'pd' ? 'Palladium (Pd)' : 'Rhodium (Rh)'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Market Price (USD/oz)</label>
                  <input name={`${metal}Usd`} type="number" step="0.01" defaultValue={initialSettings.metals[metal].usdPerOunce} className="glass-input border-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Return Rate</label>
                  <input name={`${metal}Return`} type="number" step="0.01" defaultValue={initialSettings.metals[metal].returnRate} className="glass-input" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Refining Charge</label>
                  <input name={`${metal}Refining`} type="number" step="0.01" defaultValue={initialSettings.metals[metal].refiningCharge} className="glass-input" required />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary px-8">
          {isPending ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </form>
  );
}
