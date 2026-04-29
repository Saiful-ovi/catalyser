'use client';

import { useState, useTransition } from 'react';
import { toggleEmployeeStatus, changeEmployeePassword, deleteEmployee } from '@/actions/data';
import { KeyRound, Check, X, Loader2, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function ToggleStatusButton({ id, isActive }) {
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState(isActive);
  const toast = useToast();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleEmployeeStatus(id);
      if (result.success) {
        setActive(result.active);
        toast.success(result.active ? 'Employee activated' : 'Employee deactivated');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-7 w-[52px] items-center rounded-full transition-colors duration-300 focus:outline-none ${
        active ? 'bg-emerald-600 shadow-emerald-500/30 shadow-lg' : 'bg-slate-700'
      }`}
      title={active ? 'Click to deactivate' : 'Click to activate'}
    >
      {isPending ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </span>
      ) : (
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
            active ? 'translate-x-[26px]' : 'translate-x-[4px]'
          }`}
        />
      )}
    </button>
  );
}

export function ChangePasswordButton({ id, email }) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await changeEmployeePassword(id, password);
      setResult(res);
      if (res.success) {
        toast.success('Password changed successfully!');
        setPassword('');
        setTimeout(() => {
          setIsOpen(false);
          setResult(null);
        }, 1500);
      } else if (res.error) {
        toast.error(res.error);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
        title="Change Password"
      >
        <KeyRound className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => { setIsOpen(false); setResult(null); }} />
          
          <div className="relative glass-panel border-white/10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Change Password</h3>
                <p className="text-sm text-slate-400 mt-1">{email}</p>
              </div>
              <button 
                onClick={() => { setIsOpen(false); setResult(null); }}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {result?.error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-4">
                {result.error}
              </div>
            )}
            {result?.success && (
              <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-xl text-sm mb-4 flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Password changed successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={4}
                    className="glass-input pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !password}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteEmployeeButton({ id, email }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteEmployee(id);
      toast.success(`Employee ${email} deleted`);
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Delete Employee"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative glass-panel border-red-500/20 w-full max-w-sm p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Employee?</h3>
              <p className="text-sm text-slate-400 mt-2">
                Are you sure you want to permanently delete <span className="text-white font-medium">{email}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
