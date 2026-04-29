import { getSettings, getUsers } from '@/actions/data';
import { getSession } from '@/lib/auth';
import SettingsForm from '@/components/SettingsForm';
import AdminCredentialsForm from '@/components/AdminCredentialsForm';

export default async function SettingsPage() {
  const settings = await getSettings();
  const session = await getSession();
  const users = await getUsers();
  const admin = users.find(u => u.id === session.id);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Settings & Market Rates</h1>
        <p className="text-sm sm:text-base text-slate-400">Update formulas, constants, live market prices, and admin credentials.</p>
      </div>

      <AdminCredentialsForm adminEmail={admin?.email || ''} />

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
