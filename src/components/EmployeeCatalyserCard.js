'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Check, Maximize2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function EmployeeCatalyserCard({ cat, onOpenModal, showPhotos = true }) {
  const [quantity, setQuantity] = useState(1);
  const { cart, addToCart } = useCart();

  const isInCart = cart.some(item => item.id === cat.id);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    addToCart(cat, quantity);
  };

  return (
    <div className={`glass-panel overflow-hidden flex transition-all hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-2xl hover:-translate-y-1 group ${showPhotos ? 'flex-col' : 'flex-row items-center p-4 sm:p-6 gap-6'}`}>
      {showPhotos && (
        <div 
          className="h-40 sm:h-48 w-full bg-slate-800 relative overflow-hidden cursor-pointer"
          onClick={() => onOpenModal(cat)}
        >
          {cat.images && cat.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={cat.images[0]} 
              alt={cat.modelNumber} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500 font-medium">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      )}
      
      <div className={`flex-1 flex flex-col ${showPhotos ? 'p-4 sm:p-6' : 'p-0'}`}>
        <div className="flex justify-between items-start mb-1">
          <div className="text-sm font-medium text-blue-400 uppercase tracking-wider">{cat.brandName}</div>
          {isInCart && (
            <span className="bg-emerald-500/10 text-emerald-400 p-1 rounded-md">
              <Check className="w-4 h-4" />
            </span>
          )}
        </div>
        <h3 className={`${showPhotos ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-black text-white mb-2 tracking-tight`}>{cat.modelNumber}</h3>
        
        <div className={`mt-auto pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${showPhotos ? '' : 'sm:border-t-0 sm:pt-0'}`}>
          <div className="flex items-center justify-between sm:justify-start gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Final Price</span>
              <span className={`${showPhotos ? 'text-xl' : 'text-2xl'} font-black text-emerald-400`}>
                {cat.finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-[10px] text-slate-500 ml-1 font-bold uppercase">AED</span>
              </span>
            </div>
            
            {/* Quantity Selector */}
            {!isInCart && (
              <div className="flex flex-col items-end sm:items-start">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Amount</span>
                <div className="flex items-center bg-slate-900/80 border border-slate-700/50 rounded-full p-1 shadow-inner">
                  <button 
                    onClick={handleDecrement}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-white text-sm">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className={`${showPhotos ? 'w-full' : 'w-full sm:w-auto'}`}>
            <button 
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`w-full py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-black transition-all ${
                isInCart 
                  ? 'bg-slate-800 text-slate-500 cursor-default opacity-50' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>In Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {quantity > 1 ? `${quantity} Units` : 'to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
