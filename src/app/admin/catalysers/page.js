import { getCatalysers, getSettings } from '@/actions/data';
import CatalysersManager from '@/components/CatalysersManager';

export default async function CatalysersPage() {
  const [catalysers, settings] = await Promise.all([
    getCatalysers(),
    getSettings()
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Catalysers Database</h1>
        <p className="text-slate-400">Manage all your catalyser models, weights, and PPMs here.</p>
      </div>

      <CatalysersManager initialData={catalysers} settings={settings} />
    </div>
  );
}


