import { getCatalysers, getSettings } from '@/actions/data';
import { calculatePrice } from '@/lib/calculator';
import QuickMarketRateForm from '@/components/QuickMarketRateForm';
import AdminDashboardSearch from '@/components/AdminDashboardSearch';
import { Search, ArrowRight } from 'lucide-react';
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickMarketRateForm initialRates={initialRates} />
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            Quick Search
          </h3>
          <AdminDashboardSearch data={calcs} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-4 sm:p-6">
          <h3 className="text-slate-400 font-medium mb-1">Total Catalysers</h3>
          <p className="text-2xl sm:text-4xl font-bold text-white">{catalysers.length}</p>
        </div>
        <div className="glass-panel p-4 sm:p-6">
          <h3 className="text-slate-400 font-medium mb-1">Active Rate (USD/AED)</h3>
          <p className="text-2xl sm:text-4xl font-bold text-indigo-400">{settings.usdToAed}</p>
        </div>
      </div>

    </div>
  );
}
