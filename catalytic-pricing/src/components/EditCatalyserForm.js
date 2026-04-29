'use client';

import { useTransition } from 'react';
import { updateCatalyser } from '@/actions/data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function EditCatalyserForm({ catalyser }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  async function action(formData) {
    startTransition(() => {
      updateCatalyser(catalyser.id, formData).then((res) => {
        if (res.success) {
          toast.success('Catalyser updated successfully!');
          router.push('/admin/catalysers');
        }
      });
    });
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Model Number</label>
          <input name="modelNumber" type="text" defaultValue={catalyser.modelNumber} className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Brand Name</label>
          <input name="brandName" type="text" defaultValue={catalyser.brandName} className="glass-input" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-2">Upload Images (Leaves existing if blank)</label>
          <input name="images" type="file" multiple accept="image/*" className="glass-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-2">Short Description</label>
          <textarea name="description" rows="2" defaultValue={catalyser.description || ''} className="glass-input resize-none" placeholder="Brief description of the catalyser..." />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Weight (KG)</label>
          <input name="weightKg" type="number" step="0.001" defaultValue={catalyser.weightGram / 1000} className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Moisture (%)</label>
          <input name="moisturePercent" type="number" step="0.01" max="100" min="0" defaultValue={catalyser.moisture * 100} className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Platinum (Pt) PPM</label>
          <input name="ptPpm" type="number" step="0.1" defaultValue={catalyser.ptPpm} className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Palladium (Pd) PPM</label>
          <input name="pdPpm" type="number" step="0.1" defaultValue={catalyser.pdPpm} className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Rhodium (Rh) PPM</label>
          <input name="rhPpm" type="number" step="0.1" defaultValue={catalyser.rhPpm} className="glass-input" required />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Updating...' : 'Update Catalyser'}
        </button>
      </div>
    </form>
  );
}
