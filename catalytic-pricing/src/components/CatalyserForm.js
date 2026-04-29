'use client';

import { useTransition } from 'react';
import { addCatalyser } from '@/actions/data';
import { useToast } from '@/context/ToastContext';

export default function CatalyserForm() {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  async function action(formData) {
    startTransition(async () => {
      await addCatalyser(formData);
      toast.success('Catalyser added successfully!');
      document.getElementById('catForm').reset();
    });
  }

  return (
    <form id="catForm" action={action} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Model Number</label>
          <input name="modelNumber" type="text" className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Brand Name</label>
          <input name="brandName" type="text" className="glass-input" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-2">Upload Images (Multiple Allowed)</label>
          <input name="images" type="file" multiple accept="image/*" className="glass-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-2">Short Description</label>
          <textarea name="description" rows="2" className="glass-input resize-none" placeholder="Brief description of the catalyser..." />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Weight (KG)</label>
          <input name="weightKg" type="number" step="0.001" className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Moisture (%)</label>
          <input name="moisturePercent" type="number" step="0.01" max="100" min="0" className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Platinum (Pt) PPM</label>
          <input name="ptPpm" type="number" step="0.1" className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Palladium (Pd) PPM</label>
          <input name="pdPpm" type="number" step="0.1" className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Rhodium (Rh) PPM</label>
          <input name="rhPpm" type="number" step="0.1" className="glass-input" required />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Adding...' : 'Add Catalyser'}
        </button>
      </div>
    </form>
  );
}
