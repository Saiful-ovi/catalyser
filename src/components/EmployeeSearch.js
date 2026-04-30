'use client';

import { useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Maximize2, ShoppingCart, Check, Minus, Plus, Eye, EyeOff } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import EmployeeCatalyserCard from './EmployeeCatalyserCard';

export default function EmployeeSearch({ data }) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [showPhotos, setShowPhotos] = useState(true);
  const { cart, addToCart } = useCart();

  const filtered = data.filter(cat => 
    cat.modelNumber.toLowerCase().includes(query.toLowerCase()) ||
    cat.brandName.toLowerCase().includes(query.toLowerCase())
  );

  const isInCart = (id) => cart.some(item => item.id === id);

  const openModal = (cat) => {
    setSelectedCat(cat);
    setActiveImgIdx(0);
    setModalQuantity(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Find Catalyst
          </h2>
          <button 
            onClick={() => setShowPhotos(!showPhotos)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              showPhotos 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showPhotos ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Photos</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl w-full mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Model or Brand..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="glass-input-icon py-3 sm:py-4 text-base sm:text-lg"
          />
        </div>
      </div>

      {/* Grid View */}
      <div className={`grid gap-4 sm:gap-6 ${showPhotos ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filtered.length > 0 ? (
          filtered.map(cat => (
            <EmployeeCatalyserCard 
              key={cat.id} 
              cat={cat} 
              onOpenModal={openModal} 
              showPhotos={showPhotos}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-700/50">
            No results found for &quot;{query}&quot;
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {selectedCat && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" 
            onClick={() => setSelectedCat(null)}
          />
          
          <div className="relative glass-panel border-white/10 w-full sm:max-w-5xl max-h-[90vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-t-2xl sm:rounded-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedCat.modelNumber}</h2>
                <p className="text-sm text-blue-400">{selectedCat.brandName}</p>
              </div>
              <button 
                onClick={() => setSelectedCat(null)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors ml-2 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Image Viewer */}
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-black rounded-xl sm:rounded-2xl overflow-hidden relative group">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImgIdx(prev => prev === 0 ? selectedCat.images.length - 1 : prev - 1);
                            }}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImgIdx(prev => prev === selectedCat.images.length - 1 ? 0 : prev + 1);
                            }}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                    {selectedCat.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
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
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-sm block mb-1">Live Calculated Price</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                    {selectedCat.finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-lg sm:text-xl font-normal text-slate-500 ml-2">AED</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Model Number</span>
                    <span className="text-white font-bold text-sm sm:text-base">{selectedCat.modelNumber}</span>
                  </div>
                  <div className="p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Manufacturer</span>
                    <span className="text-white font-bold text-sm sm:text-base">{selectedCat.brandName}</span>
                  </div>
                </div>

                {selectedCat.description && (
                  <div className="p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-sm block mb-2">Description</span>
                    <p className="text-white text-sm">{selectedCat.description}</p>
                  </div>
                )}

                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Select Amount</span>
                    <p className="text-white text-xs font-medium">How many units?</p>
                  </div>
                  <div className="flex items-center bg-slate-800 rounded-full p-1 border border-white/10 shadow-inner">
                    <button 
                      onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                      disabled={isInCart(selectedCat.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-30"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-10 text-center font-black text-white text-lg">{modalQuantity}</span>
                    <button 
                      onClick={() => setModalQuantity(prev => prev + 1)}
                      disabled={isInCart(selectedCat.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(selectedCat, modalQuantity)}
                  disabled={isInCart(selectedCat.id)}
                  className={`w-full py-4 rounded-xl flex items-center justify-center space-x-3 text-lg font-black transition-all ${
                    isInCart(selectedCat.id) 
                      ? 'bg-slate-800 text-slate-500 cursor-default opacity-50' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
                  }`}
                >
                  {isInCart(selectedCat.id) ? (
                    <>
                      <Check className="w-6 h-6" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      <span>Add {modalQuantity > 1 ? `${modalQuantity} Units` : 'to Cart'}</span>
                    </>
                  )}
                </button>

                <div className="p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
                  <p className="text-sm text-blue-400 italic">Prices are updated instantly based on current market rates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

