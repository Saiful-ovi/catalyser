'use client';

import { useActionState, useEffect } from 'react';
import { createEmployee } from '@/actions/data';
import { useToast } from '@/context/ToastContext';

export default function EmployeeForm() {
  const [state, formAction, isPending] = useActionState(createEmployee, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.success) toast.success('Employee created successfully!');
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-sm">
          Employee created successfully!
        </div>
      )}
      
      <div>
        <label className="block text-sm text-slate-400 mb-2">Email Address</label>
        <input name="email" type="email" required className="glass-input" placeholder="employee@company.com" />
      </div>
      
      <div>
        <label className="block text-sm text-slate-400 mb-2">Password</label>
        <input name="password" type="password" required className="glass-input" placeholder="••••••••" />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full mt-4">
        {isPending ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}
