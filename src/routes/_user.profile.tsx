import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ImageOff, Mail, Phone, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { BOOKING_STATUS_LABEL } from "@/constants";
import { bookingService } from "@/services/booking.service";
import { tryOnService } from "@/services/try-on.service";
import { useAuthStore } from "@/stores/auth.store";
import type { BookingStatus } from "@/types";

export const Route = createFileRoute("/_user/profile")({
  head: () => ({ meta: [{ title: "Hồ sơ — HairSense" }] }),
  component: ProfilePage,
});

const STATUS_TONE: Record<BookingStatus, string> = {
  P: "bg-warning/15 text-warning",
  C: "bg-primary/15 text-primary",
  D: "bg-success/15 text-success",
  X: "bg-destructive/15 text-destructive",
};

function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const historyQuery = useQuery({
    queryKey: ["history", user?.user_id],
    queryFn: () => tryOnService.listByUser(user!.user_id, 5),
    enabled: !!user,
  });

  const bookingsQuery = useQuery({
    queryKey: ["my-bookings", user?.user_id],
    queryFn: () => bookingService.listByUser(user!.user_id),
    enabled: !!user,
  });

  if (!user) return <LoadingState />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <Avatar className="h-20 w-20 ring-4 ring-secondary">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold tracking-tight">{user.username}</h1>
            <p className="text-sm text-muted-foreground">
              Thành viên từ {new Date(user.created_at).toLocaleDateString("vi-VN")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {user.phone}
              </span>
              <Badge variant="secondary">{user.gender === "female" ? "Nữ" : "Nam"}</Badge>
            </div>
          </div>
          <Button asChild>
            <Link to="/recommendation">
              <Sparkles className="mr-2 h-4 w-4" /> Gợi ý cho tôi
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Try-On gần đây</h2>
            <span className="text-xs text-muted-foreground">5 ảnh mới nhất</span>
          </header>
          {historyQuery.isLoading ? (
            <LoadingState />
          ) : !historyQuery.data || historyQuery.data.length === 0 ? (
            <EmptyState
              title="Chưa có lịch sử thử tóc"
              description="Thử ngay một kiểu tóc để lưu vào thư viện của bạn."
              icon={<ImageOff className="h-5 w-5" />}
              action={
                <Button asChild size="sm">
                  <Link to="/try-on">Thử tóc ngay</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {historyQuery.data.map((h) => (
                <div
                  key={h.history_id}
                  className="overflow-hidden rounded-xl border border-border bg-muted"
                >
                  <img
                    src={h.output_img_url}
                    alt="try on"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lịch của tôi</h2>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </header>
          {bookingsQuery.isLoading ? (
            <LoadingState />
          ) : !bookingsQuery.data || bookingsQuery.data.length === 0 ? (
            <EmptyState
              title="Chưa có lịch đặt"
              description="Tìm salon yêu thích và đặt lịch ngay."
              action={
                <Button asChild size="sm">
                  <Link to="/salons">Tìm salon</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {bookingsQuery.data.slice(0, 6).map((b) => (
                <li
                  key={b.booking_id}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
                >
                  <div>
                    <p className="text-sm font-medium">Salon #{b.salon_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.booking_date).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <Badge className={STATUS_TONE[b.status]}>
                    {BOOKING_STATUS_LABEL[b.status]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
