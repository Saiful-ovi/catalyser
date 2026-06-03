import EmployeeSidebar from '@/components/EmployeeSidebar';
import { CartProvider } from '@/context/CartContext';
import { getSession } from '@/lib/auth';
import { getSettings } from '@/actions/data';

export default async function EmployeeLayout({ children }) {
  const [session, settings] = await Promise.all([
    getSession(),
    getSettings()
  ]);

  const hasCalculatorAccess = session && settings?.calculatorAccess?.[session.id] === true;

  return (
    <CartProvider>
      <div className="min-h-screen flex">
        <EmployeeSidebar hasCalculatorAccess={hasCalculatorAccess} />
        <main className="flex-1 md:ml-64 p-4 pb-24 md:pb-8 pt-16 md:pt-8 md:px-6 lg:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}
