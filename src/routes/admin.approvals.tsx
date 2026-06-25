import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Construction, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({ meta: [{ title: "Admin Dashboard — HairSense" }] }),
  component: AdminStub,
});

function AdminStub() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Construction className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Module này thuộc Phase 3. Sẽ được triển khai sau khi User Module hoàn tất.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button asChild variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700">
            <Link to="/auth/login">Về trang đăng nhập</Link>
          </Button>
          <Button size="sm" onClick={() => { logout(); navigate({ to: "/auth/login" }); }}>
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}
