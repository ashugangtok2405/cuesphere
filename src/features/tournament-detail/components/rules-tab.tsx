import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import type { TournamentDetail } from "@/types/tournament-detail";

export function RulesTab({ tournament }: { tournament: TournamentDetail }) {
  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <ol className="space-y-3">
          {tournament.rules.map((rule, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              {rule}
            </li>
          ))}
        </ol>
        <LinkButton href="#" variant="outline" size="sm">
          Download Full Rulebook <Download className="size-3.5" />
        </LinkButton>
      </CardContent>
    </Card>
  );
}
