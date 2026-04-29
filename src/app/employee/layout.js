import EmployeeSidebar from '@/components/EmployeeSidebar';
import { CartProvider } from '@/context/CartContext';

export default function EmployeeLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex">
        <EmployeeSidebar />
        <main className="flex-1 md:ml-64 p-4 pt-16 md:pt-8 md:px-6 lg:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}
