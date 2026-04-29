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

      <div className="glass-panel p-4 sm:p-6 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Recent Calculations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400">
                <th className="pb-3 font-medium">Model</th>
                <th className="pb-3 font-medium">Brand</th>
                <th className="pb-3 font-medium">Weight (g)</th>
                <th className="pb-3 font-medium">Pt / Pd / Rh Value</th>
                <th className="pb-3 font-medium text-right">Final Price (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[...calcs].reverse().slice(0, 5).map(cat => (
                <tr key={cat.id} className="text-slate-300">
                  <td className="py-4">{cat.modelNumber}</td>
                  <td className="py-4">{cat.brandName}</td>
                  <td className="py-4">{cat.weightGram}</td>
                  <td className="py-4">
                    <span className="text-slate-400 text-sm">
                      {cat.pricing.pt_value.toFixed(2)} / {cat.pricing.pd_value.toFixed(2)} / {cat.pricing.rh_value.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-white">
                    {cat.pricing.final_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {calcs.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No catalysers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-center">
          <Link 
            href="/admin/catalysers"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
          >
            View More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
