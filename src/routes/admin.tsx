import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import { AdminLogin } from "@/components/admin/AdminLogin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Login | Jonak Construction Limited" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { pathname } = useLocation();
  const normalizedPathname = pathname.replace(/\/$/, "");

  if (normalizedPathname === "/admin") {
    return <AdminLogin />;
  }

  return <Outlet />;
}
