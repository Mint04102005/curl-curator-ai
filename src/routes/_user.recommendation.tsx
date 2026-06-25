import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ImagePlus, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { HairstyleCard } from "@/components/cards/HairstyleCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { recommendationService } from "@/services/recommendation.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Gender, RecommendationResult } from "@/types";

export const Route = createFileRoute("/_user/recommendation")({
  head: () => ({
    meta: [{ title: "AI Recommendation — HairSense" }],
  }),
  component: RecommendationPage,
});

function RecommendationPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState<Gender>(user?.gender ?? "female");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: () =>
      recommendationService.analyzeFace({
        imageDataUrl: image ?? "",
        description,
        gender,
      }),
    onSuccess: (r) => {
      setResult(r);
      toast.success(`Phát hiện dáng mặt: ${r.detectedShape}`);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Phân tích thất bại"),
  });

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <Badge variant="secondary" className="mb-3">
          <Sparkles className="mr-1 h-3 w-3 text-primary" /> AI Recommendation
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Phân tích khuôn mặt & gợi ý kiểu tóc
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tải ảnh khuôn mặt, mô tả phong cách mong muốn. AI sẽ xác định dáng mặt và đề xuất 5 kiểu
          tóc phù hợp nhất.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div>
            <Label>Ảnh khuôn mặt</Label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-2 flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary"
            >
              {image ? (
                <img src={image} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-10 w-10" />
                  <p className="text-sm">Bấm để chọn ảnh hoặc kéo thả</p>
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
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload ảnh
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info("Tính năng chụp ảnh sẽ kích hoạt camera thiết bị")}>
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Chụp ảnh
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="desc">Mô tả mong muốn</Label>
            <Textarea
              id="desc"
              placeholder="VD: phong cách Hàn Quốc, công sở, dễ chăm sóc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 min-h-[110px]"
            />
          </div>

          <div>
            <Label>Giới tính</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="male">Nam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!image || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Phân tích và gợi ý
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          {mutation.isPending ? (
            <AnalyzingState />
          ) : result ? (
            <ResultView
              result={result}
              onTry={(hair_id) => navigate({ to: "/try-on", search: { hair_id } })}
            />
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="mt-4 max-w-sm text-sm">
                Tải ảnh và bấm <strong>Phân tích</strong> để xem kết quả gợi ý từ AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <Sparkles className="h-7 w-7" />
      </motion.div>
      <div className="text-center">
        <p className="font-semibold">AI đang phân tích khuôn mặt...</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nhận diện dáng mặt, đối chiếu kho dữ liệu kiểu tóc.
        </p>
      </div>
      <Progress value={70} className="w-3/4 max-w-sm" />
    </div>
  );
}

function ResultView({
  result,
  onTry,
}: {
  result: RecommendationResult;
  onTry: (id: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Dáng mặt</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">{result.detectedShape}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Độ tin cậy</p>
            <p className="mt-1 text-3xl font-semibold text-success">{result.confidence}%</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{result.explanation}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Top 5 kiểu tóc phù hợp</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.recommendations.map((r) => (
            <div key={r.hairstyle.hair_id} className="space-y-2">
              <HairstyleCard hair={r.hairstyle} score={r.score} />
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => onTry(r.hairstyle.hair_id)}
              >
                Thử kiểu tóc →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
