'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Database, Users, LayoutDashboard, LogOut, Calculator, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl text-white shadow-lg"
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
          <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/catalysers" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <Database className="w-5 h-5" />
            <span>Catalysers</span>
          </Link>
          <Link href="/admin/employees" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <Users className="w-5 h-5" />
            <span>Employees</span>
          </Link>
          <Link href="/admin/calculator" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
            <Calculator className="w-5 h-5" />
            <span>Refining Calculator</span>
          </Link>
          <Link href="/admin/settings" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white border-t border-slate-800/50 mt-2">
            <Settings className="w-5 h-5" />
            <span>Settings & Rates</span>
          </Link>
          <form action={logout} className="mt-2 border-t border-slate-800/50 pt-2">
            <button type="submit" className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </nav>
      </aside>
    </>
  );
}
