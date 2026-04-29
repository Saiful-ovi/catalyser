'use client';

import { useState } from 'react';
import { Search, Pencil, Database, Scale, Droplets, X, ChevronLeft, ChevronRight, Maximize2, Tag } from 'lucide-react';
import Link from 'next/link';
import DeleteAction from './DeleteAction';
import { calculatePrice } from '@/lib/calculator';

export default function CatalyserGrid({ initialData, settings }) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const filtered = initialData.filter(cat => 
    cat.modelNumber.toLowerCase().includes(query.toLowerCase()) ||
    cat.brandName.toLowerCase().includes(query.toLowerCase())
  ).reverse();

  const openModal = (cat) => {
    setSelectedCat(cat);
    setActiveImgIdx(0);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          Existing Catalysers ({filtered.length})
        </h2>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search database..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(cat => {
          const pricing = settings ? calculatePrice(cat, settings) : null;
          return (
            <div key={cat.id} className="glass-panel group overflow-hidden flex flex-col border-slate-800 hover:border-blue-500/30 transition-all duration-300">
              {/* Image Section */}
              <div 
                className="h-40 w-full bg-slate-800/50 relative overflow-hidden border-b border-slate-800 cursor-pointer"
                onClick={() => openModal(cat)}
              >
                {cat.images && cat.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={cat.images[0]} 
                    alt={cat.modelNumber} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Database className="w-8 h-8 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-full">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Link 
                    href={`/admin/catalysers/${cat.id}`}
                    className="p-2 bg-slate-900/80 hover:bg-blue-600 text-white rounded-lg backdrop-blur-sm transition-all"
                    onClick={e => e.stopPropagation()}
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <div className="p-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-all cursor-pointer" onClick={e => e.stopPropagation()}>
                    <DeleteAction id={cat.id} isIconButton />
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-5 flex-1 flex flex-col cursor-pointer" onClick={() => openModal(cat)}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white leading-tight">{cat.modelNumber}</h3>
                    <p className="text-sm text-blue-400 font-medium">{cat.brandName}</p>
                  </div>
                  {pricing && (
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Price (AED)</p>
                      <p className="text-lg font-black text-indigo-400">
                        {pricing.final_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{cat.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/30">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold mb-1">
                      <Scale className="w-3 h-3" />
                      Weight
                    </div>
                    <div className="text-white text-sm font-mono">{(cat.weightGram / 1000).toFixed(3)} kg</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/30">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold mb-1">
                      <Droplets className="w-3 h-3" />
                      Moisture
                    </div>
                    <div className="text-white text-sm font-mono">{(cat.moisture * 100).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-800 pt-4 flex justify-between text-center">
                  <div className="flex-1 border-r border-slate-800 last:border-0 px-2">
                    <p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Pt</p>
                    <p className="text-xs font-mono text-slate-300">{cat.ptPpm}</p>
                  </div>
                  <div className="flex-1 border-r border-slate-800 last:border-0 px-2">
                    <p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Pd</p>
                    <p className="text-xs font-mono text-slate-300">{cat.pdPpm}</p>
                  </div>
                  <div className="flex-1 border-r border-slate-800 last:border-0 px-2">
                    <p className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Rh</p>
                    <p className="text-xs font-mono text-slate-300">{cat.rhPpm}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center glass-panel">
          <Database className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-20" />
          <p className="text-slate-500 italic">No catalysers found matching your search.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" 
            onClick={() => setSelectedCat(null)}
          />
          
          <div className="relative glass-panel border-white/10 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCat.modelNumber}</h2>
                <p className="text-sm text-blue-400">{selectedCat.brandName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/admin/catalysers/${selectedCat.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center space-x-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button 
                  onClick={() => setSelectedCat(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Viewer */}
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-black rounded-2xl overflow-hidden relative group">
                  {selectedCat.images && selectedCat.images.length > 0 ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={selectedCat.images[activeImgIdx]} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                      
                      {selectedCat.images.length > 1 && (
                        <>
                          <button 
                            onClick={() => setActiveImgIdx(prev => prev === 0 ? selectedCat.images.length - 1 : prev - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => setActiveImgIdx(prev => prev === selectedCat.images.length - 1 ? 0 : prev + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-medium">No images available</div>
                  )}
                </div>
                
                {/* Thumbnails */}
                {selectedCat.images && selectedCat.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedCat.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                          activeImgIdx === idx ? 'border-blue-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-5">
                {/* Description */}
                {selectedCat.description && (
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-xs uppercase font-bold block mb-2">Description</span>
                    <p className="text-white text-sm">{selectedCat.description}</p>
                  </div>
                )}

                {/* Price Display in Modal */}
                {settings && (
                  <div className="p-5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-xl">
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-300 text-[10px] uppercase font-bold">Current Value</p>
                        <p className="text-white text-xs opacity-70">Based on live market rates</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">
                        {calculatePrice(selectedCat, settings).final_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="ml-2 text-sm font-bold text-blue-400">AED</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Weight & Moisture */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                      <Scale className="w-3.5 h-3.5" />
                      Weight
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">{(selectedCat.weightGram / 1000).toFixed(3)} <span className="text-sm text-slate-500">kg</span></div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                      <Droplets className="w-3.5 h-3.5" />
                      Moisture
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">{(selectedCat.moisture * 100).toFixed(1)}<span className="text-sm text-slate-500">%</span></div>
                  </div>
                </div>

                {/* PPM Values */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-gradient-to-b from-amber-500/5 to-transparent rounded-xl border border-amber-500/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-amber-400/80 mb-1">Platinum (Pt)</p>
                    <p className="text-xl font-bold font-mono text-white">{selectedCat.ptPpm}</p>
                    <p className="text-[10px] text-slate-500">PPM</p>
                  </div>
                  <div className="p-4 bg-gradient-to-b from-sky-500/5 to-transparent rounded-xl border border-sky-500/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-sky-400/80 mb-1">Palladium (Pd)</p>
                    <p className="text-xl font-bold font-mono text-white">{selectedCat.pdPpm}</p>
                    <p className="text-[10px] text-slate-500">PPM</p>
                  </div>
                  <div className="p-4 bg-gradient-to-b from-rose-500/5 to-transparent rounded-xl border border-rose-500/10 text-center">
                    <p className="text-[10px] uppercase font-bold text-rose-400/80 mb-1">Rhodium (Rh)</p>
                    <p className="text-xl font-bold font-mono text-white">{selectedCat.rhPpm}</p>
                    <p className="text-[10px] text-slate-500">PPM</p>
                  </div>
                </div>

                {/* Images Count */}
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
                  <p className="text-sm text-blue-400">
                    {selectedCat.images && selectedCat.images.length > 0 
                      ? `${selectedCat.images.length} image${selectedCat.images.length > 1 ? 's' : ''} uploaded`
                      : 'No images uploaded'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
