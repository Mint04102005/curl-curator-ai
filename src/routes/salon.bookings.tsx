import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Construction, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/salon/bookings")({
  head: () => ({ meta: [{ title: "Salon Dashboard — AI Hairstyle Recommendation System" }] }),
  component: SalonStub,
});

function SalonStub() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <UnderConstruction
      title="Salon Dashboard"
      onLogout={() => {
        logout();
        navigate({ to: "/auth/login" });
      }}
    />
  );
}

function UnderConstruction({ title, onLogout }: { title: string; onLogout: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Construction className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Module này thuộc Phase 2. Sẽ được triển khai sau khi User Module hoàn tất.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/auth/login">Về trang đăng nhập</Link>
          </Button>
          <Button size="sm" onClick={onLogout}>
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}
