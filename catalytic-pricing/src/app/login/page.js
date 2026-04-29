'use client';

import { useActionState, useEffect } from 'react';
import { login } from '@/actions/auth';
import { ShieldAlert, KeyRound, Mail } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success('Login successful! Redirecting...');
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        
        <div className="relative">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full shadow-lg border border-slate-700/50">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-white mb-2">Secure Access</h1>
          <p className="text-slate-400 text-center mb-8">Enter your credentials to continue</p>

          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="glass-input-icon"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="glass-input-icon"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full flex justify-center items-center space-x-2"
            >
              {isPending ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <span>Authenticate</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
