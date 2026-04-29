import { getCatalyserById } from '@/actions/data';
import EditCatalyserForm from '@/components/EditCatalyserForm';
import { notFound } from 'next/navigation';

export default async function EditCatalyserPage({ params }) {
  const { id } = await params;
  const catalyser = await getCatalyserById(id);

  if (!catalyser) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Catalyser</h1>
        <p className="text-slate-400">Update the details for model {catalyser.modelNumber}.</p>
      </div>

      <div className="glass-panel p-6">
        <EditCatalyserForm catalyser={catalyser} />
      </div>
    </div>
  );
}
