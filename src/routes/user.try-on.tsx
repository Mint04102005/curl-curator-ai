import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Camera, Download, ImagePlus, Loader2, Save, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/shared/StateViews";
import { hairstyleService } from "@/services/hairstyle.service";
import { tryOnService } from "@/services/try-on.service";
import { useAuthStore } from "@/stores/auth.store";

const searchSchema = z.object({
  hair_id: z.coerce.number().optional(),
});

export const Route = createFileRoute("/user/try-on")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Thử tóc ảo — AI Hairstyle Recommendation System" }] }),
  component: TryOnPage,
});

function TryOnPage() {
  const { hair_id } = Route.useSearch();
  const user = useAuthStore((s) => s.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const [inputImg, setInputImg] = useState<string | null>(null);
  const [selectedHairId, setSelectedHairId] = useState<number | null>(hair_id ?? null);
  const [output, setOutput] = useState<string | null>(null);

  const hairsQuery = useQuery({
    queryKey: ["hairstyles-all"],
    queryFn: () => hairstyleService.list(),
  });

  useEffect(() => {
    if (hair_id) setSelectedHairId(hair_id);
  }, [hair_id]);

  const selectedHair = hairsQuery.data?.find((h) => h.hair_id === selectedHairId);

  const mergeMutation = useMutation({
    mutationFn: async () => {
      if (!inputImg || !selectedHair) throw new Error("Vui lòng chọn ảnh và kiểu tóc");
      return tryOnService.merge({
        user_id: user!.user_id,
        hair_id: selectedHair.hair_id,
        input_img_url: inputImg,
        hair_img_url: selectedHair.image_url,
      });
    },
    onSuccess: (url) => {
      setOutput(url);
      toast.success("Đã ghép tóc thành công!");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Ghép tóc thất bại"),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!output || !selectedHair) throw new Error("Chưa có kết quả để lưu");
      return tryOnService.save({
        user_id: user!.user_id,
        hair_id: selectedHair.hair_id,
        input_img_url: inputImg!,
        output_img_url: output,
      });
    },
    onSuccess: () => toast.success("Đã lưu vào thư viện."),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Lưu thất bại"),
  });

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImg(e.target?.result as string);
      setOutput(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const a = document.createElement("a");
    a.href = output;
    a.download = `ai-hairstyle-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Virtual Try-On</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Ghép kiểu tóc đã chọn lên ảnh của bạn — xử lý ảnh trực tiếp trên trình duyệt.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Controls */}
        <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div>
            <Label>Ảnh của bạn</Label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-2 flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:border-primary"
            >
              {inputImg ? (
                <img src={inputImg} alt="input" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-10 w-10" />
                  <p className="text-sm">Bấm để chọn ảnh</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Mở camera thiết bị")}>
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Chụp
              </Button>
            </div>
          </div>

          <div>
            <Label>Chọn kiểu tóc</Label>
            <Select
              value={selectedHairId ? String(selectedHairId) : ""}
              onValueChange={(v) => setSelectedHairId(Number(v))}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Chọn kiểu tóc..." />
              </SelectTrigger>
              <SelectContent>
                {hairsQuery.data?.map((h) => (
                  <SelectItem key={h.hair_id} value={String(h.hair_id)}>
                    {h.hair_name} ({h.gender === "female" ? "Nữ" : "Nam"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedHair ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-2">
                <img
                  src={selectedHair.image_url}
                  alt={selectedHair.hair_name}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="text-sm">
                  <p className="font-medium">{selectedHair.hair_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedHair.gender === "female" ? "Nữ" : "Nam"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!inputImg || !selectedHairId || mergeMutation.isPending}
            onClick={() => mergeMutation.mutate()}
          >
            {mergeMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Ghép tóc
          </Button>
        </div>

        {/* Result */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          {mergeMutation.isPending ? (
            <LoadingState label="Đang xử lý ảnh trên canvas..." />
          ) : output && inputImg ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <BeforeAfter label="Before" src={inputImg} />
                <BeforeAfter label="After" src={output} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Result
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wand2 className="h-6 w-6" />
              </div>
              <p className="mt-4 max-w-sm text-sm">
                Chọn ảnh và kiểu tóc, sau đó bấm <strong>Ghép tóc</strong> để xem kết quả.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BeforeAfter({ label, src }: { label: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted">
      <div className="flex items-center justify-between border-b border-border bg-background/80 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <img src={src} alt={label} className="aspect-square w-full object-cover" />
    </div>
  );
}
