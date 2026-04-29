'use client';

import { useState } from 'react';
import { addCatalyser } from '@/actions/data';
import { useToast } from '@/context/ToastContext';
import { uploadImage } from '@/lib/upload';

export default function CatalyserForm() {
  const [isPending, setIsPending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
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
        setUploadStatus(`Uploading ${imageFiles.length} images...`);
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (file.size > 0) {
            setUploadStatus(`Uploading image ${i + 1}/${imageFiles.length}...`);
            const url = await uploadImage(file);
            imageUrls.push(url);
          }
        }
      }

      setUploadStatus('Saving catalyser data...');
      
      const data = {
        modelNumber: formData.get('modelNumber'),
        brandName: formData.get('brandName'),
        description: formData.get('description'),
        weightKg: formData.get('weightKg'),
        moisturePercent: formData.get('moisturePercent'),
        ptPpm: formData.get('ptPpm'),
        pdPpm: formData.get('pdPpm'),
        rhPpm: formData.get('rhPpm'),
        images: imageUrls
      };

      const res = await addCatalyser(data);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Catalyser added successfully!');
        e.target.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add catalyser. Image might be too large or connection failed.');
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
          <input name="modelNumber" type="text" className="glass-input" required />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Brand Name</label>
          <input name="brandName" type="text" className="glass-input" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-2">Upload Images (Multiple Allowed)</label>
          <input name="images" type="file" multiple accept="image/*" className="glass-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
          {uploadStatus && <p className="text-xs text-blue-400 mt-2 animate-pulse">{uploadStatus}</p>}
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
          {isPending ? (uploadStatus || 'Adding...') : 'Add Catalyser'}
        </button>
      </div>
    </form>
  );
}
