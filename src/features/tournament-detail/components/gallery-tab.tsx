import { Card, CardContent } from "@/components/ui/card";
import type { TournamentDetail } from "@/types/tournament-detail";

export function GalleryTab({ tournament }: { tournament: TournamentDetail }) {
  const items = Array.from({ length: 8 }, (_, i) => `${tournament.name} — Photo ${i + 1}`);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((caption) => (
            <div key={caption} className="space-y-1.5">
              <div className="flex aspect-square items-center justify-center rounded-xl felt-texture">
                <svg viewBox="0 0 24 24" className="size-6 text-primary/80" fill="currentColor">
                  <circle cx="12" cy="12" r="6" />
                </svg>
              </div>
              <p className="truncate text-[11px] text-muted-foreground">{caption}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
