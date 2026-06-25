import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Calendar,
  ImageOff,
  Mail,
  Phone,
  Sparkles,
  User as UserIcon,
  MapPin,
  Shield,
  BarChart3,
  Edit3,
  Save,
  X,
  KeyRound,
  CheckCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { BOOKING_STATUS_LABEL } from "@/constants";
import { bookingService } from "@/services/booking.service";
import { tryOnService } from "@/services/try-on.service";
import { useAuthStore } from "@/stores/auth.store";
import type { BookingStatus, Gender } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/user/profile")({
  head: () => ({ meta: [{ title: "Hồ sơ — AI Hairstyle Recommendation System" }] }),
  component: ProfilePage,
});

const STATUS_TONE: Record<BookingStatus, string> = {
  P: "bg-warning/15 text-warning",
  C: "bg-primary/15 text-primary",
  D: "bg-success/15 text-success",
  X: "bg-destructive/15 text-destructive",
};

const PRESET_AVATARS = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=60",
];

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Profile fields state
  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Password fields state
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFullname(user.fullname || user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setGender(user.gender || "female");
      setDob(user.dob || "2000-01-01");
      setAddress(user.address || "Chưa cập nhật");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user, isEditing]);

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

  const handleCancel = () => {
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const handleSave = () => {
    if (!fullname.trim()) {
      toast.error("Họ và tên không được để trống");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (phone.length < 8) {
      toast.error("Số điện thoại tối thiểu 8 chữ số");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setUser({
        ...user,
        fullname,
        email,
        phone,
        gender,
        dob,
        address,
        avatar_url: avatarUrl,
      });
      setIsEditing(false);
      setShowAvatarPicker(false);
      setIsSaving(false);
      toast.success("Cập nhật thông tin cá nhân thành công!");
    }, 600);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (newPwd.length < 6) {
      toast.error("Mật khẩu mới phải tối thiểu 6 ký tự");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("Mật khẩu nhập lại không trùng khớp");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setShowPwdForm(false);
      setIsSaving(false);
      toast.success("Thay đổi mật khẩu tài khoản thành công!");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Upper Profile Overview */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 transition-all group-hover:ring-primary/40">
              <AvatarImage src={avatarUrl} alt={user.username} />
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                {user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Thay đổi
              </button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-2xl font-bold tracking-tight">{fullname}</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {user.role_id === 1 ? "Admin" : user.role_id === 3 ? "Salon" : "User"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tên đăng nhập: <span className="font-mono">{user.username}</span>
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {phone}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-1.5 h-4 w-4" /> Hủy
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <span className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : (
                    <Save className="mr-1.5 h-4 w-4" />
                  )}
                  Lưu
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Preset Avatars Selector */}
        {isEditing && showAvatarPicker && (
          <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-semibold text-foreground mb-3">Chọn ảnh đại diện có sẵn:</p>
            <div className="flex flex-wrap gap-3">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatarUrl(url)}
                  className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                    avatarUrl === url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent"
                  }`}
                >
                  <img src={url} alt="preset" className="h-full w-full object-cover" />
                </button>
              ))}
              <div className="flex items-center pl-2">
                <Input
                  placeholder="Hoặc nhập URL ảnh..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="h-9 w-60 text-xs bg-background"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Profile Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1.8fr]">
        {/* Left Side: Stats & Account Details */}
        <div className="space-y-6">
          {/* Usage Stats Card */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Thống kê sử dụng</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-muted/30 p-3">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Phân tích mặt</p>
              </div>
              <div className="rounded-2xl bg-muted/30 p-3">
                <p className="text-2xl font-bold text-foreground">
                  {historyQuery.data?.length || 0}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Đã lưu</p>
              </div>
              <div className="rounded-2xl bg-muted/30 p-3">
                <p className="text-2xl font-bold text-foreground">
                  {historyQuery.data ? historyQuery.data.length + 3 : 3}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Thử kiểu tóc</p>
              </div>
            </div>
          </section>

          {/* Account Details Card */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Thông tin tài khoản</h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Tài khoản</span>
                <span className="font-mono text-xs">{user.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tham gia</span>
                <span>{new Date(user.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                  <CheckCircle className="h-3 w-3 fill-success/10" /> Đang hoạt động
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vai trò đăng nhập</span>
                <span className="capitalize">
                  {user.role_id === 1 ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>
            </div>
          </section>

          {/* Password Action Card */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            {!showPwdForm ? (
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setShowPwdForm(true)}
              >
                <KeyRound className="mr-2 h-4 w-4 text-primary" /> Đổi mật khẩu tài khoản
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-sm font-semibold flex items-center gap-1.5">
                    <KeyRound className="h-4 w-4 text-primary" /> Đổi mật khẩu
                  </span>
                  <button type="button" onClick={() => setShowPwdForm(false)}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="curr-pwd">Mật khẩu hiện tại</Label>
                    <Input
                      id="curr-pwd"
                      type="password"
                      className="mt-1"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-pwd">Mật khẩu mới</Label>
                    <Input
                      id="new-pwd"
                      type="password"
                      className="mt-1"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-pwd">Nhập lại mật khẩu mới</Label>
                    <Input
                      id="confirm-pwd"
                      type="password"
                      className="mt-1"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPwdForm(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" size="sm" disabled={isSaving}>
                    Xác nhận
                  </Button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Right Side: Personal Info & History/Bookings */}
        <div className="space-y-6">
          {/* Personal Info Form Card */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
              <UserIcon className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Thông tin cá nhân</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input
                  id="fullname"
                  disabled={!isEditing}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="bg-muted/10 disabled:opacity-85"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/10 disabled:opacity-85"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-muted/10 disabled:opacity-85"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Giới tính</Label>
                {isEditing ? (
                  <RadioGroup
                    value={gender}
                    onValueChange={(v) => setGender(v as Gender)}
                    className="flex gap-4 pt-2.5"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Nữ</Label>
                    </div>
                  </RadioGroup>
                ) : (
                  <Input
                    disabled
                    value={gender === "female" ? "Nữ" : "Nam"}
                    className="bg-muted/10 disabled:opacity-85"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input
                  id="dob"
                  type="date"
                  disabled={!isEditing}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-muted/10 disabled:opacity-85"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Địa chỉ cư trú</Label>
                <Input
                  id="address"
                  disabled={!isEditing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-muted/10 disabled:opacity-85"
                />
              </div>
            </div>
          </section>

          {/* Try-On & Bookings Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Try-On history */}
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Try-On gần đây</h2>
                <span className="text-xs text-muted-foreground">Mới nhất</span>
              </header>
              {historyQuery.isLoading ? (
                <LoadingState />
              ) : !historyQuery.data || historyQuery.data.length === 0 ? (
                <EmptyState
                  title="Chưa thử tóc"
                  description="Thử ngay một kiểu tóc mới."
                  icon={<ImageOff className="h-5 w-5" />}
                  action={
                    <Button asChild size="sm">
                      <Link to="/user/try-on">Thử ngay</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {historyQuery.data.slice(0, 3).map((h) => (
                    <div
                      key={h.history_id}
                      className="overflow-hidden rounded-xl border border-border bg-muted aspect-square"
                    >
                      <img
                        src={h.output_img_url}
                        alt="try on"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bookings */}
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Lịch của tôi</h2>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </header>
              {bookingsQuery.isLoading ? (
                <LoadingState />
              ) : !bookingsQuery.data || bookingsQuery.data.length === 0 ? (
                <EmptyState
                  title="Chưa đặt lịch"
                  description="Tìm và đặt lịch salon."
                  action={
                    <Button asChild size="sm">
                      <Link to="/user/salons">Đặt lịch</Link>
                    </Button>
                  }
                />
              ) : (
                <ul className="space-y-2">
                  {bookingsQuery.data.slice(0, 3).map((b) => (
                    <li
                      key={b.booking_id}
                      className="flex items-center justify-between rounded-xl border border-border bg-background p-2.5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">Salon #{b.salon_id}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(b.booking_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <Badge className={`${STATUS_TONE[b.status]} text-[10px] py-0 px-1.5`}>
                        {BOOKING_STATUS_LABEL[b.status]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
