import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { AuthGuard } from "@/components/admin/auth-guard";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-secondary/30">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminTopbar />
          <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
