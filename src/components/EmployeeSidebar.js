'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, LogOut, Calculator, Diamond, ShoppingCart, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth';
import { useCart } from '@/context/CartContext';

export default function EmployeeSidebar({ hasCalculatorAccess = false }) {
  const { totalItemsCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/employee', label: 'Search', icon: Search },
    hasCalculatorAccess && { href: '/employee/calculator', label: 'Calculator', icon: Calculator },
    { href: '/employee/cart', label: 'Cart', icon: ShoppingCart, showBadge: true },
  ].filter(Boolean);

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
            CatMiner Portal
          </span>
        </div>
        <Link href="/employee/cart" className="relative p-2 bg-slate-800/90 border border-slate-700/50 rounded-xl text-white transition-all active:scale-95">
          <ShoppingCart className="w-5 h-5" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
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
              CatMiner Portal
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
          {navItems.map((item) => {
            const isActive = item.href === '/employee' 
              ? pathname === '/employee' 
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border-l-4 border-blue-500 font-semibold pl-3'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.showBadge && totalItemsCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            );
          })}
          
          <form action={logout} className="mt-2 border-t border-slate-800/50 pt-2">
            <button type="submit" className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 z-[60] px-2 py-2 pb-safe flex justify-around items-center shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const isActive = item.href === '/employee' 
            ? pathname === '/employee' 
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-6 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-blue-400 scale-105 font-medium' 
                  : 'text-slate-400 active:scale-95'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-blue-500/10 rounded-xl filter blur-[4px] -z-10 animate-pulse" />
              )}
              
              {isActive && (
                <span className="absolute -top-2.5 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                {item.showBadge && totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-slate-900 animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
