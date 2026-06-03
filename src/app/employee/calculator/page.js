import { getSettings } from '@/actions/data';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RefiningCalculator from '@/components/RefiningCalculator';

export default async function EmployeeCalculatorPage() {
  const [session, settings] = await Promise.all([
    getSession(),
    getSettings()
  ]);

  const hasCalculatorAccess = session && settings?.calculatorAccess?.[session.id] === true;
  if (!hasCalculatorAccess) {
    redirect('/employee');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Refining Calculator</h1>
        <p className="text-slate-400">Calculate custom catalytic pricing with live market rates.</p>
      </div>
      
      <RefiningCalculator initialRates={settings} />
    </div>
  );
}
