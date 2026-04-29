'use client';

import { useState } from 'react';
import { updateCatalyser } from '@/actions/data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { uploadImage } from '@/lib/upload';

export default function EditCatalyserForm({ catalyser }) {
  const [isPending, setIsPending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);
    setUploadStatus('Preparing...');

    const formData = new FormData(e.currentTarget);
    const imageFiles = formData.getAll('images');
    const imageUrls = [];

    try {
      if (imageFiles.length > 0 && imageFiles[0].size > 0) {
        setUploadStatus(`Uploading ${imageFiles.length} new images...`);
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (file.size > 0) {
            setUploadStatus(`Uploading image ${i + 1}/${imageFiles.length}...`);
            const url = await uploadImage(file);
            imageUrls.push(url);
          }
        }
      }

      setUploadStatus('Saving changes...');
      
      const data = {
        modelNumber: formData.get('modelNumber'),
        brandName: formData.get('brandName'),
        description: formData.get('description'),
        weightKg: formData.get('weightKg'),
        moisturePercent: formData.get('moisturePercent'),
        ptPpm: formData.get('ptPpm'),
        pdPpm: formData.get('pdPpm'),
        rhPpm: formData.get('rhPpm'),
        images: imageUrls.length > 0 ? imageUrls : null // Pass null or empty to keep existing in server
      };

      const res = await updateCatalyser(catalyser.id, data);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Catalyser updated successfully!');
        router.push('/admin/catalysers');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update catalyser. Image might be too large or connection failed.');
    } finally {
      setIsPending(false);
      setUploadStatus('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          {uploadStatus && <p className="text-xs text-blue-400 mt-2 animate-pulse">{uploadStatus}</p>}
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
          {isPending ? (uploadStatus || 'Updating...') : 'Update Catalyser'}
        </button>
      </div>
    </form>
  );
}
