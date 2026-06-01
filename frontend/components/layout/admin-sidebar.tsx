import { AdminNav } from "./admin-nav";

// Sidebar admin (desktop). Mobile pakai drawer di admin-topbar.
export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
      <AdminNav />
    </aside>
  );
}
