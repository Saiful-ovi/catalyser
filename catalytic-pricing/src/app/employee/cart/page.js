'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart, Trash2, ArrowLeft, Package, CreditCard, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalValue, updateQuantity, totalItemsCount } = useCart();

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Selected Catalysers</h1>
          <p className="text-sm sm:text-base text-slate-400">Review your selected items and total valuation.</p>
        </div>
        <Link 
          href="/employee"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Add More</span>
        </Link>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="glass-panel p-3 sm:p-4 flex items-center gap-3 sm:gap-4 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                  {item.images && item.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.modelNumber} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate text-sm sm:text-base">{item.modelNumber}</h3>
                  <p className="text-sm text-blue-400 mb-2">{item.brandName}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-400 font-bold text-sm sm:text-base">
                    {(item.finalPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {item.finalPrice.toFixed(2)} x {item.quantity}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-all mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={clearCart}
              className="text-slate-500 hover:text-white text-sm font-medium flex items-center space-x-2 transition-colors ml-auto pt-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Items</span>
            </button>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <div className="glass-panel p-4 sm:p-6 border-blue-500/20 bg-blue-500/5">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Valuation Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Total Quantity</span>
                  <span className="text-white font-bold">{totalItemsCount}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Unique Models</span>
                  <span className="text-white font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Service Type</span>
                  <span className="text-white font-bold">Catalytic Purchase</span>
                </div>
                <div className="border-t border-slate-700/50 pt-4 flex justify-between items-end">
                  <span className="text-white font-medium">Grand Total</span>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">AED (Estimated)</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-widest">
                Confirm Selection
              </button>
            </div>

            <div className="glass-panel p-4 text-xs text-slate-500 bg-slate-900/50">
              <p>Prices are based on live market rates for Platinum, Palladium, and Rhodium. Values are calculated automatically per kilogram/PPM.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-14 sm:py-20 text-center glass-panel">
          <div className="bg-slate-800/50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6 sm:mb-8 max-w-sm mx-auto px-4">Add some catalysers from the database to see the combined total valuation here.</p>
          <Link 
            href="/employee"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20"
          >
            <span>Browse Catalysers</span>
          </Link>
        </div>
      )}
    </div>
  );
}
