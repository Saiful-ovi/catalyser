'use client';

import { useState } from 'react';
import CatalyserForm from './CatalyserForm';
import CatalyserGrid from './CatalyserGrid';
import { Database, PlusCircle } from 'lucide-react';

export default function CatalysersManager({ initialData, settings }) {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' by default

  return (
    <div className="space-y-6">
      {/* Sleek Segmented Control Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setActiveTab('existing')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-300 ${
              activeTab === 'existing'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Existing Catalysers</span>
          </button>
          
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-300 ${
              activeTab === 'add'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Catalyser</span>
          </button>
        </div>
      </div>

      {/* Conditional Content Rendering with smooth animation wrapper */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === 'existing' ? (
          <CatalyserGrid initialData={initialData} settings={settings} />
        ) : (
          <div className="glass-panel p-6 border-blue-500/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <span>Add New Catalyser</span>
            </h2>
            <CatalyserForm onSuccess={() => setActiveTab('existing')} />
          </div>
        )}
      </div>
    </div>
  );
}
