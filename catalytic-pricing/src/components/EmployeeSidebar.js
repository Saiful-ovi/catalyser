'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, LogOut, Calculator, Diamond, ShoppingCart, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth';
import { useCart } from '@/context/CartContext';

export default function EmployeeSidebar() {
  const { totalItemsCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-slate-800/90 border border-slate-700/50 rounded-xl text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <Diamond className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Catalytic Portal
          </span>
        </div>
        <Link href="/employee/cart" className="relative p-2 bg-slate-800/90 border border-slate-700/50 rounded-xl text-white">
          <ShoppingCart className="w-5 h-5" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItemsCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[70]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 glass-panel border-y-0 border-l-0 rounded-none h-screen fixed left-0 top-0 flex flex-col z-[80]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Diamond className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Catalytic Portal
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/employee" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <Link href="/employee/calculator" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <Calculator className="w-5 h-5" />
            <span>Calculator</span>
          </Link>
          <Link href="/employee/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </div>
            {totalItemsCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalItemsCount}
              </span>
            )}
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <form action={logout}>
            <button type="submit" className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
