import { getUsers } from '@/actions/data';
import EmployeeForm from '@/components/EmployeeForm';
import { ToggleStatusButton, ChangePasswordButton, DeleteEmployeeButton } from '@/components/EmployeeActions';

export default async function EmployeesPage() {
  const users = await getUsers();
  const employees = users.filter(u => u.role === 'employee');

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Employee Management</h1>
        <p className="text-sm sm:text-base text-slate-400">Create employee accounts to access the pricing portal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="glass-panel p-4 sm:p-6 lg:col-span-1 h-fit">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Create Employee</h2>
          <EmployeeForm />
        </div>

        <div className="glass-panel p-4 sm:p-6 lg:col-span-2 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Employee Accounts ({employees.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400">
                  <th className="pb-3 font-medium">Email Address</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {employees.map(emp => {
                  const isActive = emp.active !== false;
                  return (
                    <tr key={emp.id} className="text-slate-300">
                      <td className="py-4 font-medium text-white">{emp.email}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                          {emp.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center space-x-3">
                          <ToggleStatusButton id={emp.id} isActive={isActive} />
                          <span className={`text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <ChangePasswordButton id={emp.id} email={emp.email} />
                          <DeleteEmployeeButton id={emp.id} email={emp.email} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">No employees created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

