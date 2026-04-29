import { getSettings } from '@/actions/data';
import RefiningCalculator from '@/components/RefiningCalculator';

export default async function AdminCalculatorPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Refining Calculator</h1>
        <p className="text-slate-400">PPM-based valuation tool using live market rates.</p>
      </div>

      <RefiningCalculator initialRates={settings} />
    </div>
  );
}
