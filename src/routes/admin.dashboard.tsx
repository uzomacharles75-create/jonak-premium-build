import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Jonak Construction Limited" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return <AdminDashboard />;
}
