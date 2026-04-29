import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 pt-16 md:pt-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
