import { Link } from "@tanstack/react-router";
import { Scissors } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Scissors className="h-4 w-4" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight text-foreground">
          AI Hairstyle Recommendation System
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          AI Studio
        </span>
      </div>
    </Link>
  );
}
