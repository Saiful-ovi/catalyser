'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Database, Users, LayoutDashboard, LogOut, Calculator, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/catalysers', label: 'Catalysers', icon: Database },
    { href: '/admin/calculator', label: 'Calculator', icon: Calculator },
    { href: '/admin/employees', label: 'Employees', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl text-white shadow-lg animate-fade-in"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

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
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Catalytic Admin
          </h2>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border-l-4 border-blue-500 font-semibold pl-3'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
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
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
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

              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              <span className="text-[10px] mt-1 tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
