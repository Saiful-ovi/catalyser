import { getCatalysers, getSettings } from '@/actions/data';
import { calculatePrice } from '@/lib/calculator';
import EmployeeSearch from '@/components/EmployeeSearch';

export default async function EmployeePage() {
  const catalysers = await getCatalysers();
  const settings = await getSettings();

  // ONLY extract non-sensitive data and final price
  const safeCatalysers = catalysers.map(cat => {
    const pricing = calculatePrice(cat, settings);
    return {
      id: cat.id,
      modelNumber: cat.modelNumber,
      brandName: cat.brandName,
      description: cat.description || '',
      images: cat.images || (cat.image ? [cat.image] : []),
      finalPrice: pricing.final_price
    };
  });

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Search Catalysers</h2>
        <p className="text-slate-400">Search by model number or brand name to get live calculated prices.</p>
      </div>

      <EmployeeSearch data={safeCatalysers} />
    </div>
  );
}
