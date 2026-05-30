'use client';

import { useState } from 'react';
import { addCatalyser } from '@/actions/data';
import { useToast } from '@/context/ToastContext';
import { uploadImage } from '@/lib/upload';
import { UploadCloud, FileText, Scale, Droplets, Coins, Hash, Tag, Flame, Plus } from 'lucide-react';

export default function CatalyserForm({ onSuccess }) {
  const [isPending, setIsPending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const toast = useToast();

  const handleFileChange = (e) => {
    setSelectedFilesCount(e.target.files.length);
  };

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
        setSelectedFilesCount(0);
        if (onSuccess) onSuccess();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Number */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2 font-semibold">
            <Hash className="w-4 h-4 text-blue-400" />
            <span>Model Number</span>
          </label>
          <input 
            name="modelNumber" 
            type="text" 
            placeholder="e.g. 4GR-20W"
            className="glass-input focus:ring-blue-500/10 focus:border-blue-500/70" 
            required 
          />
        </div>

        {/* Brand Name */}
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2 font-semibold">
            <Tag className="w-4 h-4 text-blue-400" />
            <span>Brand Name</span>
          </label>
          <input 
            name="brandName" 
            type="text" 
            placeholder="e.g. Toyota"
            className="glass-input focus:ring-blue-500/10 focus:border-blue-500/70" 
            required 
          />
        </div>

        {/* Custom Upload Images Zone */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2 font-semibold">
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Upload Images</span>
          </label>
          <div className="relative border border-dashed border-slate-700/80 hover:border-blue-500/50 bg-slate-950/20 rounded-2xl p-6 transition-all duration-300 group flex flex-col items-center justify-center text-center cursor-pointer">
            <input 
              name="images" 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300 mb-2" />
            <p className="text-sm font-bold text-white mb-1">
              {selectedFilesCount > 0 ? `${selectedFilesCount} image file(s) chosen` : "Click to select catalyser images"}
            </p>
            <p className="text-xs text-slate-500">Multiple selection supported • JPEG, PNG, WEBP</p>
          </div>
          {uploadStatus && <p className="text-xs text-blue-400 mt-2.5 animate-pulse font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            {uploadStatus}
          </p>}
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2 font-semibold">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Short Description</span>
          </label>
          <textarea 
            name="description" 
            rows="2.5" 
            className="glass-input resize-none focus:ring-blue-500/10 focus:border-blue-500/70" 
            placeholder="Brief description details about this catalytic converter model..." 
          />
        </div>

        {/* Physical Specs Cards */}
        <div className="md:col-span-2 bg-slate-950/20 p-5 rounded-2xl border border-slate-800/60 space-y-4 shadow-inner">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Physical Specifications</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2 font-medium">
                Weight (KG)
              </label>
              <div className="relative">
                <input 
                  name="weightKg" 
                  type="number" 
                  step="0.001" 
                  placeholder="0.000"
                  className="glass-input pr-12 focus:ring-emerald-500/10 focus:border-emerald-500/70" 
                  required 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600">KG</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2 font-medium">
                Moisture (%)
              </label>
              <div className="relative">
                <input 
                  name="moisturePercent" 
                  type="number" 
                  step="0.01" 
                  max="100" 
                  min="0" 
                  placeholder="0.00"
                  className="glass-input pr-12 focus:ring-emerald-500/10 focus:border-emerald-500/70" 
                  required 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Precious Metal PPM Values */}
        <div className="md:col-span-2 bg-slate-950/20 p-5 rounded-2xl border border-slate-800/60 space-y-4 shadow-inner">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Precious Metal PPM Values</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Platinum */}
            <div className="p-4 bg-gradient-to-b from-amber-500/[0.03] to-transparent rounded-xl border border-amber-500/10 focus-within:border-amber-500/50 transition-all duration-300">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-400/80 mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Platinum (Pt)</span>
              </label>
              <div className="relative">
                <input 
                  name="ptPpm" 
                  type="number" 
                  step="0.1" 
                  placeholder="0"
                  className="glass-input pr-12 border-amber-500/20 focus:ring-amber-500/10 focus:border-amber-500/70 text-amber-100 font-mono font-bold" 
                  required 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-amber-400/50">PPM</span>
              </div>
            </div>

            {/* Palladium */}
            <div className="p-4 bg-gradient-to-b from-sky-500/[0.03] to-transparent rounded-xl border border-sky-500/10 focus-within:border-sky-500/50 transition-all duration-300">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-sky-400/80 mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Palladium (Pd)</span>
              </label>
              <div className="relative">
                <input 
                  name="pdPpm" 
                  type="number" 
                  step="0.1" 
                  placeholder="0"
                  className="glass-input pr-12 border-sky-500/20 focus:ring-sky-500/10 focus:border-sky-500/70 text-sky-100 font-mono font-bold" 
                  required 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-sky-400/50">PPM</span>
              </div>
            </div>

            {/* Rhodium */}
            <div className="p-4 bg-gradient-to-b from-rose-500/[0.03] to-transparent rounded-xl border border-rose-500/10 focus-within:border-rose-500/50 transition-all duration-300">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-rose-400/80 mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Rhodium (Rh)</span>
              </label>
              <div className="relative">
                <input 
                  name="rhPpm" 
                  type="number" 
                  step="0.1" 
                  placeholder="0"
                  className="glass-input pr-12 border-rose-500/20 focus:ring-rose-500/10 focus:border-rose-500/70 text-rose-100 font-mono font-bold" 
                  required 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-rose-400/50">PPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isPending} className="btn-primary flex items-center gap-2 font-bold px-8 shadow-xl">
          <Plus className="w-4 h-4" />
          <span>{isPending ? (uploadStatus || 'Adding...') : 'Add Catalyser'}</span>
        </button>
      </div>
    </form>
  );
}

