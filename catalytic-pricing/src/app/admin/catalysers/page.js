import { getCatalysers } from '@/actions/data';
import CatalyserForm from '@/components/CatalyserForm';
import CatalyserGrid from '@/components/CatalyserGrid';

export default async function CatalysersPage() {
  const catalysers = await getCatalysers();

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Catalysers Database</h1>
        <p className="text-slate-400">Manage all your catalyser models, weights, and PPMs here.</p>
      </div>

      <div className="glass-panel p-6 border-blue-500/10">
        <h2 className="text-xl font-bold text-white mb-6">Add New Catalyser</h2>
        <CatalyserForm />
      </div>

      <CatalyserGrid initialData={catalysers} />
    </div>
  );
}

