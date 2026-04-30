import { getCatalysers, getSettings } from '@/actions/data';
import { calculatePrice } from '@/lib/calculator';
import QuickMarketRateForm from '@/components/QuickMarketRateForm';
import AdminDashboardSearch from '@/components/AdminDashboardSearch';
import { Search, ArrowRight, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [catalysers, settings] = await Promise.all([
    getCatalysers(),
    getSettings()
  ]);

  const calcs = catalysers.map(cat => ({
    ...cat,
    pricing: calculatePrice(cat, settings)
  }));

  const totalValue = calcs.reduce((acc, cat) => acc + cat.pricing.final_price, 0);

  const initialRates = {
    pt: settings.metals.pt.usdPerOunce,
    pd: settings.metals.pd.usdPerOunce,
    rh: settings.metals.rh.usdPerOunce,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-400">Overview of your catalytic pricing system</p>
        </div>
      </div>

      <div>
        <QuickMarketRateForm initialRates={initialRates} />
      </div>

      <div className="space-y-4 mb-6 sm:mb-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          Quick Search
        </h3>
        <AdminDashboardSearch data={calcs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 flex items-center gap-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
            <Package className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h3 className="text-slate-400 font-medium text-sm mb-1">Total Catalysers</h3>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{catalysers.length}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center gap-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-slate-400 font-medium text-sm mb-1">Active Rate (USD/AED)</h3>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-400 tracking-tight">{settings.usdToAed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
