import RefiningCalculator from '@/components/RefiningCalculator';

export default function EmployeeCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Refining Calculator</h1>
        <p className="text-slate-400">Calculate custom catalytic pricing with live market rates.</p>
      </div>
      
      <RefiningCalculator />
    </div>
  );
}
