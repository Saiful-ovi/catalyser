'use client';

import { useTransition } from 'react';
import { deleteCatalyser } from '@/actions/data';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function DeleteAction({ id }) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  return (
    <button 
      onClick={() => startTransition(async () => {
        await deleteCatalyser(id);
        toast.success('Catalyser deleted');
      })}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
