'use client';

import { useState, useTransition } from 'react';
import { changeAdminEmail, changeAdminPassword } from '@/actions/data';
import { useToast } from '@/context/ToastContext';
import { Shield, Mail, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminCredentialsForm({ adminEmail }) {
  const toast = useToast();

  // Email change
  const [emailPassword, setEmailPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isEmailPending, startEmailTransition] = useTransition();

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (!newEmail || !emailPassword) return;

    startEmailTransition(async () => {
      const res = await changeAdminEmail(emailPassword, newEmail);
      if (res.success) {
        toast.success('Admin email updated successfully!');
        setNewEmail('');
        setEmailPassword('');
      } else {
        toast.error(res.error);
      }
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (!currentPassword || !newPassword) return;

    startPasswordTransition(async () => {
      const res = await changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        toast.success('Admin password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="glass-panel p-4 sm:p-6 border-amber-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <Shield className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Admin Security</h2>
          <p className="text-xs sm:text-sm text-slate-400">Change your admin login credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Change */}
        <form onSubmit={handleEmailChange} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Email</h3>
          </div>
          <p className="text-xs text-slate-500 -mt-2">Current: <span className="text-slate-300">{adminEmail}</span></p>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="glass-input text-sm"
              placeholder="new-admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Current Password (verify)</label>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              required
              className="glass-input text-sm"
              placeholder="Enter current password"
            />
          </div>
          <button
            type="submit"
            disabled={isEmailPending || !newEmail || !emailPassword}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isEmailPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {isEmailPending ? 'Updating...' : 'Update Email'}
          </button>
        </form>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h3>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="glass-input text-sm pr-10"
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
                className="glass-input text-sm pr-10"
                placeholder="Enter new password"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={4}
              className="glass-input text-sm"
              placeholder="Re-enter new password"
            />
          </div>
          <button
            type="submit"
            disabled={isPasswordPending || !currentPassword || !newPassword || !confirmPassword}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isPasswordPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {isPasswordPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
